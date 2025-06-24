import HeaderHomePage from './Header';
import FloatingNews from './FloatingNews';
import { Highlight, HeroHighlight } from '../HeroSection';
import Footer from './Footer';
import InterviewFeatureGrid from './InterviewFeature';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import ChatFeature from './ChatFeature';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faChevronRight, faArrowRight, faMicrophone } from '@fortawesome/free-solid-svg-icons';

const Homepage = () => {
  const navigate = useNavigate();

  const benefitsList = [
    "Personalized questions based on your experience level",
    "Detailed scoring on technical accuracy and communication",
    "Voice analysis for confident delivery",
    "Improvement suggestions for future interviews"
  ];

  return (
    <div className="min-h-screen w-full bg-black text-black dark:text-white">
      <HeaderHomePage />
      
      <HeroHighlight containerClassName="h-[52rem]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, -5, 0] }}
          transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
          className="text-3xl px-4 md:text-5xl lg:text-6xl font-semibold text-black dark:text-white max-w-4xl leading-tight md:leading-tight lg:leading-tight text-center mx-auto tracking-tight"
        >
          <p className='mb-3'>Practice interviews<br /></p>
          <Highlight className="text-black dark:text-white font-semibold px-5">
            with the precision of Untitled AI
          </Highlight>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto text-center px-4"
        >
          Every question is tailored practice. Every feedback, a step toward your dream role. 
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/signup"
            className="px-8 py-3 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Get Started
          </Link>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            View Demo
          </button>
        </motion.div>
      </HeroHighlight>

      <FloatingNews />
      <InterviewFeatureGrid />

      
      
      {/* Interview Demo Section */}
      <section className="pt-8 mb-20 bg-black">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-lg">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-2 text-sm text-gray-400">AI Interview Session</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full flex-shrink-0">
                      <FontAwesomeIcon icon={faMicrophone} className="text-black dark:text-white text-lg" />
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-gray-800 dark:text-gray-200">Can you explain how event delegation works in JavaScript?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 flex-row-reverse">
                    <div className="bg-black dark:bg-white p-3 rounded-full flex-shrink-0">
                      <FontAwesomeIcon icon={faUserGraduate} className="text-white dark:text-black text-lg" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-black">Event delegation is a technique where we add a single event listener to a parent element to handle events for its current and future children...</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 space-y-6"
            >
              <h2 className="text-3xl font-bold text-black dark:text-white leading-tight">
                Real-time feedback and analysis on your interview performance
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Our AI interviewer provides instant feedback on your responses, helping you identify areas for improvement and refine your communication skills.
              </p>
              <ul className="space-y-4">
                {benefitsList.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <FontAwesomeIcon icon={faChevronRight} className="text-black dark:text-white text-xs" />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link 
                  to="/onboarding" 
                  className="inline-flex items-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Try a mock interview
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <FloatingNews />
      
      {/* Call to Action */}
     <ChatFeature />
      
      <Footer />
    </div>
  );
};

export default Homepage;
