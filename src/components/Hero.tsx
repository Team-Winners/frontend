import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Hero = () => {
  const { isLoggedIn } = useContext(AuthContext);
  
  return (
    <div className="w-full py-24 bg-white dark:bg-black">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-6 tracking-tight leading-tight">
            The future of interviews<br />is personalized.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            AI-powered mock interviews tailored to your career goals and experience level
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col md:flex-row w-full gap-4 mb-10"
        >
          <div className="w-full md:w-2/3 aspect-video bg-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-gray-800 opacity-90"></div>
            <div className="relative z-10 text-white max-w-md text-center p-6">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Technical Interview Preparation</h3>
              <p className="text-gray-300 mb-6">Master coding challenges, system design, and behavioral questions with real-time feedback</p>
              <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="px-6 py-2 bg-white text-black rounded-full font-medium text-sm hover:opacity-90 transition-opacity inline-block">
                Start Practice
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <div className="h-1/2 bg-gray-100 dark:bg-gray-800 rounded-xl p-6 flex flex-col justify-between">
              <h3 className="text-xl font-bold text-black dark:text-white">Performance Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Get detailed insights on your strengths and areas for improvement</p>
            </div>
            <div className="h-1/2 bg-black dark:bg-gray-700 rounded-xl p-6 flex flex-col justify-between">
              <h3 className="text-xl font-bold text-white">AI Feedback</h3>
              <p className="text-gray-300 text-sm mt-2">Receive personalized guidance to refine your interview skills</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
