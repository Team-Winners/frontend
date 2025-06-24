import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVolumeHigh, faSpinner, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import HeaderHomePage from './Header';
import { useSpeechToText } from '../hooks/use-speech-to-text';
import interviewService from '../services/interview.service';

type Message = {
  role: 'ai' | 'user';
  content: string;
  feedback?: string;
};

type Topic = {
  id: string;
  name: string;
  description: string;
};

const MockInterview = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [interviewTopic, setInterviewTopic] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [currentInterviewId, setCurrentInterviewId] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState('');
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    resetTranscript,
    hasRecognitionSupport 
  } = useSpeechToText({
    onResult: (result) => setUserInput(result),
    onEnd: () => {}
  });

  // Fetch available topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsResponse = await interviewService.getTopics();
        // Flatten all topics from different categories
        const allTopics = [
          ...topicsResponse.algorithms,
          ...topicsResponse.backend,
          ...topicsResponse.frontend,
          ...topicsResponse.database
        ];
        setAvailableTopics(allTopics);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
    
    fetchTopics();
    
    // Load speech synthesis voices
    if ('speechSynthesis' in window) {
      // Some browsers require user interaction before loading voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          // If voices aren't loaded yet, try again after a delay
          setTimeout(loadVoices, 100);
        }
      };
      
      // Load voices immediately and also listen for the voiceschanged event
      loadVoices();
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  // Request microphone permission on component mount
  useEffect(() => {
    const requestMicrophonePermission = async () => {
      if (hasRecognitionSupport && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Request microphone permission
          await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log('Microphone permission granted');
        } catch (error) {
          console.warn('Microphone permission denied:', error);
        }
      }
    };
    
    requestMicrophonePermission();
  }, [hasRecognitionSupport]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Stop speech synthesis when component unmounts
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      
      // Stop speech recognition when component unmounts
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);

  // Auto scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Update userInput when transcript changes
  useEffect(() => {
    if (transcript) {
      setUserInput(transcript);
    }
  }, [transcript]);

  // Start interview with AI-generated first question
  const startInterview = async () => {
    if (!selectedTopicId) return;
    
    setInterviewStarted(true);
    setLoading(true);
    
    try {
      // Start interview with backend
      const startResponse = await interviewService.startInterview(selectedTopicId);
      setCurrentInterviewId(startResponse.interviewId);
      setCurrentQuestionId(startResponse.firstQuestion.id);
      
      const initialMessage: Message = {
        role: 'ai',
        content: startResponse.firstQuestion.text
      };
      
      setMessages([initialMessage]);
      setLoading(false);
      speakAiMessage(initialMessage.content);
    } catch (error) {
      console.error('Error starting interview:', error);
      setLoading(false);
      // Fallback to demo mode
      const fallbackMessage: Message = {
        role: 'ai',
        content: `Welcome to your ${interviewTopic} interview! I'll be asking you a series of questions to assess your knowledge and skills. Let's start with an introduction: Could you tell me about your experience with ${interviewTopic}?`
      };
      setMessages([fallbackMessage]);
      speakAiMessage(fallbackMessage.content);
    }
  };

  // Handle user answer and get next AI-generated question
  const handleUserAnswer = async (answer: string) => {
    if (!answer.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: answer
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);
    
    try {
      if (currentInterviewId && currentQuestionId) {
        // Get next question from AI
        const nextResponse = await interviewService.getNextQuestion(
          currentInterviewId,
          currentQuestionId,
          answer
        );
        
        if (nextResponse.isLastQuestion) {
          // Complete the interview
          const completeResponse = await interviewService.completeInterview(
            currentInterviewId,
            currentQuestionId,
            answer
          );
          
          // Navigate to results
          navigate(completeResponse.redirectTo + '/' + completeResponse.interviewResultId);
          return;
        }
        
        // Add AI response with next question
        const aiMessage: Message = {
          role: 'ai',
          content: nextResponse.question.text
        };
        
        setCurrentQuestionId(nextResponse.question.id);
        setMessages(prev => [...prev, aiMessage]);
        setCurrentQuestion(prev => prev + 1);
        setLoading(false);
        speakAiMessage(aiMessage.content);
      } else {
        // Fallback for demo mode
        const demoResponse = getDemoResponse();
        const aiMessage: Message = {
          role: 'ai',
          content: demoResponse
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setCurrentQuestion(prev => prev + 1);
        setLoading(false);
        speakAiMessage(aiMessage.content);
      }
    } catch (error) {
      console.error('Error getting next question:', error);
      setLoading(false);
      
      // Fallback response
      const fallbackMessage: Message = {
        role: 'ai',
        content: "Thank you for your answer. Let me ask you another question: Can you explain how you would approach solving a complex problem in this domain?"
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      setCurrentQuestion(prev => prev + 1);
      speakAiMessage(fallbackMessage.content);
    }
  };

  // AI text-to-speech using Web Speech API
  const speakAiMessage = (text: string) => {
    setIsAiSpeaking(true);
    
    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure the speech
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to use a specific voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Alex') || 
        voice.name.includes('Samantha') ||
        voice.lang.startsWith('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Handle speech events
      utterance.onstart = () => {
        setIsAiSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsAiSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsAiSpeaking(false);
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback: just simulate speaking with a timeout
      console.warn('Speech synthesis not supported in this browser');
      setTimeout(() => {
        setIsAiSpeaking(false);
      }, text.length * 50);
    }
  };

  // Stop AI speaking
  const stopAiSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }
  };

  // Toggle recording state
  const toggleRecording = () => {
    if (!hasRecognitionSupport) {
      alert('Speech recognition is not supported in your browser. Please type your answer instead.');
      return;
    }
    
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setUserInput(''); // Clear any existing input
      startListening();
    }
  };

  // For demo purposes - backup if speech recognition isn't supported
  const getDemoResponse = () => {
    const demoResponses = [
      "I have about three years of experience working with React and JavaScript. I've built several web applications including e-commerce platforms and dashboards.",
      "I think the key advantage of using a state management library like Redux is to have a centralized store for application state, which makes it easier to debug and test.",
      "When optimizing a React application, I focus on minimizing re-renders using memoization, code splitting, and lazy loading components when possible.",
      "I'd approach this problem by first breaking it down into smaller components, then implementing a sorting algorithm like quicksort or merge sort depending on the requirements."
    ];
    
    return demoResponses[Math.floor(Math.random() * demoResponses.length)];
  };

  // Send user's message
  const sendMessage = () => {
    if (!userInput.trim()) return;
    handleUserAnswer(userInput);
  };

  // End the interview and go to results
  const endInterview = () => {
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-black">
      <HeaderHomePage />
      
      <div className="container mx-auto max-w-4xl py-8 px-4 mt-16">
        {!interviewStarted ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-black mb-6">Start Your Mock Interview</h1>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                  Select a topic for your interview
                </label>
                <select
                  id="topic"
                  value={selectedTopicId}
                  onChange={(e) => {
                    setSelectedTopicId(e.target.value);
                    const selectedTopic = availableTopics.find(t => t.id === e.target.value);
                    setInterviewTopic(selectedTopic?.name || '');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Choose a topic</option>
                  {availableTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
                {selectedTopicId && (
                  <p className="mt-2 text-sm text-gray-600">
                    {availableTopics.find(t => t.id === selectedTopicId)?.description}
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h2 className="text-md font-medium text-gray-800 mb-2">How it works:</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Select a topic for your interview</li>
                  <li>The AI interviewer will ask you questions</li>
                  <li>Click the microphone button to record your answer</li>
                  <li>Your answer will be converted to text</li>
                  <li>The AI will evaluate your response and ask follow-up questions</li>
                  <li>Complete the interview to see your results</li>
                </ul>
              </div>
              
              <button
                onClick={startInterview}
                disabled={!selectedTopicId}
                className={`w-full py-3 rounded-md font-medium text-white flex items-center justify-center gap-2
                  ${selectedTopicId ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Start AI Interview
                <FontAwesomeIcon icon={faMicrophone} />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col h-[80vh]">
            {/* Interview header */}
            <div className="bg-black text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold">{interviewTopic} Interview</h1>
                  <div className="flex items-center mt-1 text-sm text-gray-300">
                    <span>Question {currentQuestion}</span>
                  </div>
                </div>
                <button
                  onClick={endInterview}
                  className="px-3 py-1 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-100"
                >
                  End Interview
                </button>
              </div>
            </div>
            
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'ai' 
                        ? 'bg-gray-100 text-black border border-gray-200' 
                        : 'bg-black text-white'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faSpinner} className="text-gray-500 animate-spin" />
                      <p className="text-gray-500">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Recording/input area */}
            <div className="border-t border-gray-200 p-4">
              {isAiSpeaking ? (
                <div className="flex items-center justify-center gap-3 text-gray-600">
                  <FontAwesomeIcon icon={faVolumeHigh} className="text-black animate-pulse" />
                  <p>AI is speaking...</p>
                  <button
                    onClick={stopAiSpeaking}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Stop Speaking
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  {isListening ? (
                    <button 
                      onClick={toggleRecording}
                      className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors relative"
                      title="Stop recording"
                    >
                      <FontAwesomeIcon icon={faMicrophoneSlash} />
                      <div className="absolute -inset-1 bg-red-600 rounded-full animate-ping opacity-75"></div>
                    </button>
                  ) : (
                    <button 
                      onClick={toggleRecording}
                      className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                      title="Start recording"
                      disabled={!hasRecognitionSupport}
                    >
                      <FontAwesomeIcon icon={faMicrophone} />
                    </button>
                  )}
                  
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={isListening ? "Listening... Speak now!" : "Type your answer or click the mic to speak"}
                    className={`flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                      isListening ? 'bg-gray-50 border-gray-300' : ''
                    }`}
                    disabled={isListening}
                    onPaste={(e) => {
                      e.preventDefault();
                      alert("Copy-paste is not allowed during the interview.");
                    }}
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={!userInput.trim() || isListening}
                    className={`p-3 rounded-full transition-colors ${
                      userInput.trim() && !isListening
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </div>
              )}
              
              {!hasRecognitionSupport && (
                <div className="mt-2 text-xs text-orange-600 text-center bg-orange-50 p-2 rounded border border-orange-200">
                  ⚠️ Speech recognition is not supported in your browser. Please type your answers instead.
                </div>
              )}
              
              {hasRecognitionSupport && (
                <div className="mt-2 text-xs text-black text-center">
                  🎤 Speech recognition is ready! Click the microphone to start speaking.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
