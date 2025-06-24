import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import HeaderHomePage from './Header';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/auth.service';

interface Topic {
  id: string;
  name: string;
  selected: boolean;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    experienceLevel: '',
    goals: '',
    weakTopics: [] as string[],
    strongTopics: [] as string[],
    preferredLanguages: [] as string[]
  });

  const frontendTopics: Topic[] = [
    { id: 'html', name: 'HTML', selected: false },
    { id: 'css', name: 'CSS', selected: false },
    { id: 'javascript', name: 'JavaScript', selected: false },
    { id: 'react', name: 'React', selected: false },
    { id: 'vue', name: 'Vue.js', selected: false },
    { id: 'angular', name: 'Angular', selected: false },
    { id: 'typescript', name: 'TypeScript', selected: false },
    { id: 'responsiveDesign', name: 'Responsive Design', selected: false }
  ];
  
  const backendTopics: Topic[] = [
    { id: 'nodejs', name: 'Node.js', selected: false },
    { id: 'express', name: 'Express', selected: false },
    { id: 'python', name: 'Python', selected: false },
    { id: 'django', name: 'Django', selected: false },
    { id: 'java', name: 'Java', selected: false },
    { id: 'spring', name: 'Spring Boot', selected: false },
    { id: 'php', name: 'PHP', selected: false },
    { id: 'csharp', name: 'C#', selected: false }
  ];
  
  const databaseTopics: Topic[] = [
    { id: 'sql', name: 'SQL', selected: false },
    { id: 'mysql', name: 'MySQL', selected: false },
    { id: 'postgresql', name: 'PostgreSQL', selected: false },
    { id: 'mongodb', name: 'MongoDB', selected: false },
    { id: 'redis', name: 'Redis', selected: false },
    { id: 'firebase', name: 'Firebase', selected: false },
    { id: 'graphql', name: 'GraphQL', selected: false },
    { id: 'orm', name: 'ORM', selected: false }
  ];

  const dsaTopics: Topic[] = [
    { id: 'arrays', name: 'Arrays & Strings', selected: false },
    { id: 'linkedLists', name: 'Linked Lists', selected: false },
    { id: 'trees', name: 'Trees & Graphs', selected: false },
    { id: 'recursion', name: 'Recursion', selected: false },
    { id: 'sorting', name: 'Sorting & Searching', selected: false },
    { id: 'dp', name: 'Dynamic Programming', selected: false },
    { id: 'heaps', name: 'Heaps', selected: false },
    { id: 'complexity', name: 'Time & Space Complexity', selected: false }
  ];

  const programmingLanguages: Topic[] = [
    { id: 'javascript', name: 'JavaScript', selected: false },
    { id: 'python', name: 'Python', selected: false },
    { id: 'java', name: 'Java', selected: false },
    { id: 'csharp', name: 'C#', selected: false },
    { id: 'cpp', name: 'C++', selected: false },
    { id: 'go', name: 'Go', selected: false },
    { id: 'ruby', name: 'Ruby', selected: false },
    { id: 'swift', name: 'Swift', selected: false },
    { id: 'php', name: 'PHP', selected: false },
    { id: 'rust', name: 'Rust', selected: false }
  ];

  const [frontendState, setFrontendState] = useState(frontendTopics);
  const [backendState, setBackendState] = useState(backendTopics);
  const [databaseState, setDatabaseState] = useState(databaseTopics);
  const [dsaState, setDsaState] = useState(dsaTopics);
  const [languagesState, setLanguagesState] = useState(programmingLanguages);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const toggleTopic = (id: string, topicType: string, isStrength: boolean) => {
    let updatedTopics: Topic[] = [];
    let stateSetter: React.Dispatch<React.SetStateAction<Topic[]>>;

    switch (topicType) {
      case 'frontend':
        updatedTopics = [...frontendState];
        stateSetter = setFrontendState;
        break;
      case 'backend':
        updatedTopics = [...backendState];
        stateSetter = setBackendState;
        break;
      case 'database':
        updatedTopics = [...databaseState];
        stateSetter = setDatabaseState;
        break;
      case 'dsa':
        updatedTopics = [...dsaState];
        stateSetter = setDsaState;
        break;
      case 'languages':
        updatedTopics = [...languagesState];
        stateSetter = setLanguagesState;
        break;
      default:
        return;
    }

    const topicIndex = updatedTopics.findIndex(topic => topic.id === id);
    if (topicIndex !== -1) {
      updatedTopics[topicIndex].selected = !updatedTopics[topicIndex].selected;
      stateSetter(updatedTopics);

      // Update userData based on whether it's a strength or weakness
      if (isStrength) {
        if (updatedTopics[topicIndex].selected) {
          setUserData({
            ...userData,
            strongTopics: [...userData.strongTopics, id]
          });
        } else {
          setUserData({
            ...userData,
            strongTopics: userData.strongTopics.filter(topic => topic !== id)
          });
        }
      } else {
        if (updatedTopics[topicIndex].selected) {
          setUserData({
            ...userData,
            weakTopics: [...userData.weakTopics, id]
          });
        } else {
          setUserData({
            ...userData,
            weakTopics: userData.weakTopics.filter(topic => topic !== id)
          });
        }
      }
    }
  };

  const toggleLanguage = (id: string) => {
    const updatedLanguages = [...languagesState];
    const langIndex = updatedLanguages.findIndex(lang => lang.id === id);
    
    if (langIndex !== -1) {
      updatedLanguages[langIndex].selected = !updatedLanguages[langIndex].selected;
      setLanguagesState(updatedLanguages);
      
      if (updatedLanguages[langIndex].selected) {
        setUserData({
          ...userData,
          preferredLanguages: [...userData.preferredLanguages, id]
        });
      } else {
        setUserData({
          ...userData,
          preferredLanguages: userData.preferredLanguages.filter(lang => lang !== id)
        });
      }
    }
  };

  const nextStep = () => {
    // Validate form at each step
    if (step === 1) {
      if (!userData.name || !userData.experienceLevel || !userData.goals) {
        alert("Please fill in all required fields before proceeding.");
        return;
      }
    } else if (step === 2 && userData.strongTopics.length === 0) {
      alert("Please select at least one strength topic before proceeding.");
      return;
    } else if (step === 3 && userData.weakTopics.length === 0) {
      alert("Please select at least one area to improve before proceeding.");
      return;
    } else if (step === 4 && userData.preferredLanguages.length === 0) {
      alert("Please select at least one programming language before proceeding.");
      return;
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Prepare onboarding data in the format expected by the backend API
      const onboardingData = {
        experienceLevel: userData.experienceLevel,
        goals: userData.goals,
        weakTopics: userData.weakTopics,
        strongTopics: userData.strongTopics,
        preferredLanguages: userData.preferredLanguages
      };
      
      console.log('Submitting onboarding data:', onboardingData);
      
      // Submit onboarding data to backend
      const response = await authService.completeOnboarding(onboardingData);
      
      // Update user in context to mark profile as complete
      setUser(response.user);
      
      console.log('Onboarding completed successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // For now, still navigate to dashboard even if onboarding fails
      // In production, you might want to show an error message
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const renderTopicButtons = (topics: Topic[], topicType: string, isStrength: boolean) => {
    return (
      <div className="flex flex-wrap gap-3">
        {topics.map(topic => (
          <button
            key={topic.id}
            type="button"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
              ${topic.selected 
                ? (isStrength ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-orange-100 text-orange-800 border border-orange-300') 
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`}
            onClick={() => toggleTopic(topic.id, topicType, isStrength)}
          >
            {topic.name}
            {topic.selected && <FontAwesomeIcon icon={faCheck} className={isStrength ? 'text-green-600' : 'text-orange-600'} />}
          </button>
        ))}
      </div>
    );
  };
  
  const renderLanguageButtons = () => {
    return (
      <div className="flex flex-wrap gap-3">
        {languagesState.map(lang => (
          <button
            key={lang.id}
            type="button"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
              ${lang.selected 
                ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`}
            onClick={() => toggleLanguage(lang.id)}
          >
            {lang.name}
            {lang.selected && <FontAwesomeIcon icon={faCheck} className="text-blue-600" />}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <HeaderHomePage />
      
      <div className="container mx-auto max-w-7xl py-12 px-4 mt-16">
        <div className="bg-black border border-gray-400 rounded-xl shadow-md p-8 text-white">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-white">Let's personalize your experience</h1>
              <div className="text-sm text-gray-400">Step {step} of 5</div>
            </div>
            
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {step === 1 && (
            <div className="space-y-10">
              <h2 className="text-xl font-semibold text-white">Tell us about yourself</h2>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  What's your name?*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:white"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="experienceLevel" className="block text-sm font-medium text-white mb-1">
                  What's your experience level?*
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={userData.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select your experience level</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3-5 years)</option>
                  <option value="expert">Expert (5+ years)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="goals" className="block text-sm font-medium text-white mb-1">
                  What are your interview goals?*
                </label>
                <textarea
                  id="goals"
                  name="goals"
                  value={userData.goals}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., I want to practice for a frontend developer role at a tech company"
                  required
                />
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">What are your strengths?</h2>
              <p className="text-white">Select the topics you feel confident about:</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-white mb-2">Frontend</h3>
                  {renderTopicButtons(frontendState, 'frontend', true)}
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-white mb-2">Backend</h3>
                  {renderTopicButtons(backendState, 'backend', true)}
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-white mb-2">Databases</h3>
                  {renderTopicButtons(databaseState, 'database', true)}
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-white mb-2">Data Structures & Algorithms</h3>
                  {renderTopicButtons(dsaState, 'dsa', true)}
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">What areas do you want to improve?</h2>
              <p className="text-white">Select the topics you want to focus on:</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-white mb-2">Frontend</h3>
                  {renderTopicButtons(frontendState, 'frontend', false)}
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-white mb-2">Backend</h3>
                  {renderTopicButtons(backendState, 'backend', false)}
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-white mb-2">Databases</h3>
                  {renderTopicButtons(databaseState, 'database', false)}
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-white mb-2">Data Structures & Algorithms</h3>
                  {renderTopicButtons(dsaState, 'dsa', false)}
                </div>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">What programming languages do you prefer?</h2>
              <p className="text-white">Select the languages you want to use in your interviews:</p>
              
              {renderLanguageButtons()}
            </div>
          )}
          
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-5">Review your information</h2>
              
              <div className="space-y-7">
                <div className="bg-black p-4 rounded-md border font-medium border-gray-400">
                  <p><span className="text-gray-500">Name:</span> {userData.name || 'Not specified'}</p>
                  <p><span className="text-gray-500">Experience Level:</span> {userData.experienceLevel || 'Not specified'}</p>
                  <p><span className="text-gray-500">Goals:</span> {userData.goals || 'Not specified'}</p>
                </div>
                
                <div className="bg-black border border-gray-400 p-4 rounded-md">
                  <h3 className="font-medium text-white mb-4">Strong Topics</h3>
                  {userData.strongTopics.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userData.strongTopics.map(topic => (
                        <span key={topic} className="bg-green-200 text-green-900 px-2 py-1 rounded-md text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : <p className="text-white">No topics selected</p>}
                </div>
                
                <div className="bg-black border border-gray-400 p-4 rounded-md">
                  <h3 className="font-medium text-white mb-4">Areas to Improve</h3>
                  {userData.weakTopics.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userData.weakTopics.map(topic => (
                        <span key={topic} className="bg-orange-200 text-orange-900 px-2 py-1 rounded-md text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : <p className="text-white">No topics selected</p>}
                </div>
                
                <div className="bg-black border border-gray-400 p-4 rounded-md">
                  <h3 className="font-medium text-white mb-4">Preferred Languages</h3>
                  {userData.preferredLanguages.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userData.preferredLanguages.map(lang => (
                        <span key={lang} className="bg-blue-200 text-blue-900 px-2 py-1 rounded-md text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  ) : <p className="text-white">No languages selected</p>}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-10">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Next
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <FontAwesomeIcon icon={faCheck} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
