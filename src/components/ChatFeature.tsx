import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const ChatFeature = () => {
  const [query, setQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const lines = [
    "How do I prepare for a system design interview?",
    "What are common React interview questions?",
    "Can you help with a mock JavaScript interview?",
    "How should I explain my experience with databases?",
    "What's the best approach to solving algorithm problems?",
  ];

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const typingDuration = lines[currentTextIndex].length * 60;
    const waitTime = 2000;

    const timeout = setTimeout(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % lines.length);
    }, typingDuration + waitTime);

    return () => clearTimeout(timeout);
  }, [currentTextIndex]);

  useEffect(() => {
    let timeouts = [];
    const currentLine = lines[currentTextIndex];
    setPlaceholder('');

    currentLine.split('').forEach((char, idx) => {
      const timeout = setTimeout(() => {
        setPlaceholder((prev) => prev + char);
      }, idx * 60);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [currentTextIndex]);

  return (
    <motion.div 
      id="chat-feature"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center px-5 py-15 bg-white w-full"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-2 tracking-tight">
        Ask Your Interview AI
      </h2>
      <p className="text-lg text-black mb-10 max-w-xl text-center">
        Get instant answers to your interview preparation questions
      </p>
      
      <div className="relative w-full max-w-5xl">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full h-14 px-6 pr-16 text-sm rounded-full border  bg-black  text-white placeholder-white dark:placeholder-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
        />
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <svg className="w-4 h-4 cursor-pointer text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
      
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        {[
          "Technical interviews", 
          "Behavioral questions", 
          "Resume tips", 
          "Coding challenges", 
          "Salary negotiation"
        ].map((tag, index) => (
          <span 
            key={index} 
            className="px-4 py-2 text-sm bg-black text-white rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ChatFeature;
