import { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faBrain, faDatabase, faLaptopCode, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import HeaderHomePage from './HeaderHomePage';
import { AuthContext } from '../context/AuthContext';
import interviewService from '../services/interview.service';
import type { Topic } from '../services/interview.service';
import authService from '../services/auth.service';
import type { Skill } from '../services/auth.service';

// Function to get activity color based on level
const getActivityColor = (level: number) => {
  switch (level) {
    case 0: return 'bg-gray-800';
    case 1: return 'bg-blue-900';
    case 2: return 'bg-blue-700';
    case 3: return 'bg-blue-500';
    default: return 'bg-gray-800';
  }
};

// Component to render individual topic skill ratings
const SkillRating = ({ name, rating, icon }: { name: string; rating: number; icon: IconDefinition }) => {
  return (
    <div className="bg-black border border-gray-800 p-4 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-gray-900 p-2 rounded-lg">
          <FontAwesomeIcon icon={icon} className="text-white" />
        </div>
        <h3 className="font-semibold text-white">{name}</h3>
      </div>
      <input 
        type="range" 
        min="0" 
        max="10" 
        value={Math.round(rating / 10)} 
        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
        disabled 
      />
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
};

// Component to render interview cards
const InterviewCard = ({ title, description, icon, colorClass, topicId }: { title: string; description: string; icon: IconDefinition; colorClass: string; topicId?: string }) => {
  const linkPath = topicId ? `/interview?topic=${topicId}` : "/interview";
  
  return (
    <Link to={linkPath} className="group">
      <div className="bg-black border border-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-4`}>
          <FontAwesomeIcon icon={icon} className="text-white text-xl" />
        </div>
        <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <div className="flex items-center text-blue-400 text-sm font-medium">
          Start Interview
          <FontAwesomeIcon icon={faChevronRight} className="ml-1 group-hover:ml-2 transition-all" />
        </div>
      </div>
    </Link>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [recommendedInterviews, setRecommendedInterviews] = useState<Topic[]>([]);
  const [dashboardData, setDashboardData] = useState<{
    status: string;
    user: {
      username: string;
      email: string;
      experienceLevel: string;
    };
    activityData: Array<{ date: string; count: number }>;
    skillRatings: Array<{ name: string; rating: number; topicId?: string }>;
    recentInterviews: Array<{
      id: string;
      topic: string;
      date?: string;
      score: number;
      completed_at?: string;
    }>;
    recommendedInterviews: Array<{
      id: string;
      topic: string;
      description: string;
    }>;
  } | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
        
        // Fetch dashboard data - this contains everything we need
        const dashResponse = await interviewService.getDashboard();
        console.log('Dashboard data received:', dashResponse);
        setDashboardData(dashResponse);
        
        // The recommended interviews come from the dashboard response
        if (dashResponse.recommendedInterviews && dashResponse.recommendedInterviews.length > 0) {
          // Convert recommended interviews to Topic format for the interview cards
          const topicFormat = dashResponse.recommendedInterviews.map(rec => ({
            id: rec.id,
            name: rec.topic,
            description: rec.description
          }));
          setRecommendedInterviews(topicFormat);
        } else {
          // If no recommended interviews, fetch all topics as fallback
          try {
            const topicsResponse = await interviewService.getTopics();
            const allTopics = [
              ...topicsResponse.algorithms,
              ...topicsResponse.backend,
              ...topicsResponse.frontend,
              ...topicsResponse.database
            ];
            setRecommendedInterviews(allTopics.slice(0, 4)); // Take first 4 topics
          } catch (topicsError) {
            console.error('Error fetching topics:', topicsError);
            setRecommendedInterviews([]);
          }
        }
        
        // Use skillRatings from dashboard or fetch separately if needed
        if (dashResponse.skillRatings && dashResponse.skillRatings.length > 0) {
          // Convert dashboard skill ratings to Skill format
          const skillsFormat = dashResponse.skillRatings.map(skill => ({
            category: skill.name,
            score: skill.rating,
            details: [{ name: skill.name, score: skill.rating }]
          }));
          setUserSkills(skillsFormat);
        } else {
          // Try to fetch skills separately
          try {
            const skillsResponse = await authService.getUserSkills();
            console.log('Skills data received:', skillsResponse);
            setUserSkills(skillsResponse);
          } catch (skillsError) {
            console.error('Error fetching skills:', skillsError);
            setUserSkills([]);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set loading to false even on error to prevent infinite loading
        setLoading(false);
        // Set some default data to prevent crashes
        setDashboardData({
          status: 'error',
          user: {
            username: user?.username || 'Unknown User',
            email: user?.email || '',
            experienceLevel: 'Not specified'
          },
          activityData: [],
          skillRatings: [],
          recentInterviews: [],
          recommendedInterviews: []
        });
        setUserSkills([]);
        setRecommendedInterviews([]);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  // This would normally come from your backend/state
  const skillRatings = userSkills.length > 0 ? userSkills.flatMap(skillCategory => 
    skillCategory.details.map(skill => ({
      name: skill.name,
      rating: skill.score,
      icon: getSkillIcon(skillCategory.category)
    }))
  ) : [
    { name: 'Frontend Development', rating: 85, icon: faLaptopCode },
    { name: 'Backend Development', rating: 70, icon: faCode },
    { name: 'Data Structures & Algorithms', rating: 60, icon: faBrain },
    { name: 'Databases', rating: 75, icon: faDatabase }
  ];
  
  function getSkillIcon(category: string) {
    switch (category.toLowerCase()) {
      case 'frontend':
      case 'frontend development':
        return faLaptopCode;
      case 'backend':
      case 'backend development':
        return faCode;
      case 'algorithms':
      case 'data structures':
        return faBrain;
      case 'database':
      case 'databases':
        return faDatabase;
      default:
        return faCode;
    }
  }
  
  const interviewCards = recommendedInterviews.length > 0 
    ? recommendedInterviews.map((interview, index) => ({
        title: interview.name,
        description: interview.description,
        icon: getSkillIcon(interview.name.toLowerCase()),
        colorClass: getColorClass(index),
        topicId: interview.id
      }))
    : [
        { 
          title: 'Frontend Interview', 
          description: 'Practice React, JavaScript, HTML/CSS, and frontend best practices.',
          icon: faLaptopCode,
          colorClass: 'bg-blue-800',
          topicId: 'frontend'
        },
        { 
          title: 'Backend Interview', 
          description: 'Focus on Node.js, APIs, server architecture, and databases.',
          icon: faCode,
          colorClass: 'bg-green-800',
          topicId: 'backend'
        },
        { 
          title: 'Data Structures', 
          description: 'Tackle common DSA problems and optimization techniques.',
          icon: faBrain,
          colorClass: 'bg-purple-800',
          topicId: 'dsa'
        },
        { 
          title: 'Database Design', 
          description: 'Practice SQL queries, schema design, and database optimization.',
          icon: faDatabase,
          colorClass: 'bg-orange-800',
          topicId: 'database'
        }
      ];
  
  function getColorClass(index: number) {
    const colors = ['bg-blue-800', 'bg-green-800', 'bg-purple-800', 'bg-orange-800', 'bg-red-800', 'bg-indigo-800'];
    return colors[index % colors.length];
  }
  
  return loading ? (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-gray-300">Loading your dashboard...</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-black">
      <HeaderHomePage />
      
      <div className="container mx-auto max-w-6xl py-8 px-4 mt-16">
        {/* User welcome section */}
        <div className="bg-black border border-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {user?.username || user?.name || 'User'}</h1>
              <p className="text-gray-300">Track your progress and continue practicing for your interviews.</p>
            </div>
            <Link 
              to="/interview" 
              className="px-4 py-2 bg-white text-black rounded-md font-medium text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Start New Interview
            </Link>
          </div>
        </div>
        
        {/* Activity and skills section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="bg-black border border-gray-800 p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold text-white mb-4">Your Interview Activity</h3>
              <div className="grid grid-flow-col gap-1 mb-2">
                {/* Generate random activity data for display */}
                {Array.from({ length: 12 }).map((_, weekIndex) => (
                  <div key={weekIndex} className="grid grid-flow-row gap-1">
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const activityLevel = Math.floor(Math.random() * 4); // 0-3 activity level
                      return (
                        <div 
                          key={`${weekIndex}-${dayIndex}`} 
                          className={`w-3 h-3 rounded-sm ${getActivityColor(activityLevel)}`}
                          title={`${activityLevel} interviews on day ${weekIndex * 7 + dayIndex + 1}`}
                        ></div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 mt-2 text-xs text-gray-400">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-gray-800"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-900"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-700"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                <span>More</span>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-black border border-gray-800 p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold text-white mb-4">Recent Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last interview score</span>
                  <span className="font-semibold text-white">
                    {dashboardData?.recentInterviews && dashboardData.recentInterviews.length > 0 
                      ? `${dashboardData.recentInterviews[0].score}%` 
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total interviews</span>
                  <span className="font-semibold text-white">
                    {dashboardData?.recentInterviews?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Average Score</span>
                  <span className="font-semibold text-white">
                    {dashboardData?.recentInterviews && dashboardData.recentInterviews.length > 0 
                      ? Math.round(dashboardData.recentInterviews.reduce((sum, interview) => sum + interview.score, 0) / dashboardData.recentInterviews.length)
                      : 'N/A'}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Skills Tracked</span>
                  <span className="font-semibold text-white">
                    {dashboardData?.skillRatings?.length || userSkills.length || 0}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-800">
                  {dashboardData?.recentInterviews && dashboardData.recentInterviews.length > 0 ? (
                    <Link 
                      to={`/results/${dashboardData.recentInterviews[0].id}`} 
                      className="text-blue-400 text-sm hover:underline flex items-center"
                    >
                      View last interview results
                      <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
                    </Link>
                  ) : (
                    <span className="text-gray-500 text-sm">No previous interviews</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Skills rating section */}
        <h2 className="text-xl font-semibold text-white mb-4">Your Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {skillRatings.length > 0 ? skillRatings.map((skill, index) => (
            <SkillRating 
              key={index}
              name={skill.name}
              rating={skill.rating}
              icon={skill.icon}
            />
          )) : (
            // Default skills if no user skills available
            [
              { name: 'Frontend Development', rating: 75, icon: faLaptopCode },
              { name: 'Backend Development', rating: 60, icon: faCode },
              { name: 'Data Structures', rating: 55, icon: faBrain },
              { name: 'Databases', rating: 70, icon: faDatabase }
            ].map((skill, index) => (
              <SkillRating 
                key={index}
                name={skill.name}
                rating={skill.rating}
                icon={skill.icon}
              />
            ))
          )}
        </div>
        
        {/* Interview cards section */}
        <h2 className="text-xl font-semibold text-white mb-4">Practice Interviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {interviewCards.map((card, index) => (
            <InterviewCard 
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              colorClass={card.colorClass}
              topicId={card.topicId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;