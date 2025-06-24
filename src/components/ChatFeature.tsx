import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const ChatFeature = () => {
  const [query, setQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  setQuery('');
  const lines = [
    "How do I prepare for a system design interview?",
    "What are common React interview questions?",
    "Can you help with a mock JavaScript interview?",
    "How should I explain my experience with databases?",
    "What's the best approach to solving algorithm problems?",
  ];

  useEffect(() => {
    const typingDuration = lines[currentTextIndex].length * 60;
    const waitTime = 2000;

    const timeout = setTimeout(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % lines.length);
    }, typingDuration + waitTime);

    return () => clearTimeout(timeout);
  }, [currentTextIndex]);

  useEffect(() => {
    let timeouts: any = [];
    const currentLine = lines[currentTextIndex];
    setPlaceholder('');

    currentLine.split('').forEach((char, idx) => {
      const timeout = setTimeout(() => {
        setPlaceholder((prev) => prev + char);
      }, idx * 60);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((t: any) => clearTimeout(t));
    };
  }, [currentTextIndex]);

  return (
    <motion.div 
      id="chat-feature"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center px-5 py-24 bg-white dark:bg-black w-full"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center text-black dark:text-white mb-4 tracking-tight">
        Ask Your Interview AI
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl text-center">
        Get instant answers to your interview preparation questions
      </p>
      
      <div className="relative w-full max-w-2xl">
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          className="w-full h-14 px-6 pr-16 text-md rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
        />
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
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ChatFeature;
