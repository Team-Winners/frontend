import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faInfoCircle, faArrowRight, faStar } from '@fortawesome/free-solid-svg-icons';
import HeaderHomePage from './HeaderHomePage';
import interviewService from '../services/interview.service';
import Loading from './ui/Loading';

const InterviewResults = () => {
  const { id: interviewId } = useParams<{ id: string }>();
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!interviewId) {
        setError('No interview ID provided');
        setLoading(false);
        return;
      }

      try {
        const data = await interviewService.getInterviewResults(interviewId);
        setResults(data);
      } catch (err) {
        console.error('Error fetching interview results:', err);
        setError('Failed to load interview results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <HeaderHomePage />
        <div className="flex justify-center items-center min-h-[60vh] mt-16">
          <Loading />
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-black text-white">
        <HeaderHomePage />
        <div className="container mx-auto max-w-4xl py-8 px-4 mt-16">
          <div className="bg-black border border-gray-800 rounded-xl shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Unable to Load Results</h1>
            <p className="text-gray-400 mb-6">{error || 'Interview results not found'}</p>
            <Link to="/dashboard" className="px-4 py-2 bg-white text-black rounded-md font-medium text-sm">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Function to render score stars
  const renderScoreStars = (score: number) => {
    const totalStars = 5;
    const filledStars = Math.round((score / 100) * totalStars);
    
    return Array.from({ length: totalStars }).map((_, index) => (
      <FontAwesomeIcon 
        key={index} 
        icon={faStar} 
        className={index < filledStars ? 'text-yellow-400' : 'text-gray-300'} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <HeaderHomePage />
      
      <div className="container mx-auto max-w-4xl py-8 px-4 mt-16">
        <div className="bg-black border border-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-black border-b border-gray-800 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Interview Results</h1>
                <p className="text-gray-400">{results.topic || 'Technical Interview'} • {new Date(results.completedAt || Date.now()).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center gap-2 mr-6">
                  <div className="text-3xl font-bold text-white">{results.overallScore}%</div>
                  <div className="flex">
                    {renderScoreStars(results.overallScore)}
                  </div>
                </div>
                <Link 
                  to="/interview" 
                  className="px-4 py-2 bg-white text-black rounded-md font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  New Interview
                </Link>
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-6">
            {/* Sections with results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Topic Performance */}
              <div className="bg-black border border-gray-800 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-white mb-4">Topic Performance</h2>
                <div className="space-y-4">
                  {Array.isArray(results.topics) && results.topics.map((topic, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">{topic.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{topic.score}%</span>
                        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${topic.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!Array.isArray(results.topics) || results.topics.length === 0) && (
                    <p className="text-gray-400">No specific topics were evaluated.</p>
                  )}
                </div>
              </div>
              
              {/* Overall Assessment */}
              <div className="bg-black border border-gray-800 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-white mb-4">Overall Assessment</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Technical knowledge</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        {results.technicalScore || Math.round(results.overallScore * 0.8)}%
                      </span>
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${results.technicalScore || Math.round(results.overallScore * 0.8)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Communication</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        {results.communicationScore || Math.round(results.overallScore * 0.9)}%
                      </span>
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${results.communicationScore || Math.round(results.overallScore * 0.9)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Problem solving</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        {results.problemSolvingScore || Math.round(results.overallScore * 0.7)}%
                      </span>
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${results.problemSolvingScore || Math.round(results.overallScore * 0.7)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Detailed Feedback */}
            <div className="space-y-8">
              {/* Strengths */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Your Strengths</h2>
                <div className="bg-black border border-gray-800 p-6 rounded-xl">
                  <ul className="space-y-3">
                    {results.strengths?.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 text-green-500">
                          <FontAwesomeIcon icon={faCheck} />
                        </div>
                        <p className="text-gray-300">{strength}</p>
                      </li>
                    ))}
                    {(!results.strengths || results.strengths.length === 0) && (
                      <p className="text-gray-400">No specific strengths were identified.</p>
                    )}
                  </ul>
                </div>
              </div>
              
              {/* Areas to Improve */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Areas to Improve</h2>
                <div className="bg-black border border-gray-800 p-6 rounded-xl">
                  <ul className="space-y-3">
                    {Array.isArray(results.areasToImprove) && results.areasToImprove.map((area, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 text-orange-500">
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </div>
                        <p className="text-gray-300">{area}</p>
                      </li>
                    ))}
                    {(!Array.isArray(results.areasToImprove) || results.areasToImprove.length === 0) && (
                      <p className="text-gray-400">No specific areas for improvement were identified.</p>
                    )}
                  </ul>
                </div>
              </div>
              
              {/* Recommended Resources */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Recommended Resources</h2>
                <div className="bg-black border border-gray-800 p-6 rounded-xl">
                  <ul className="space-y-3">
                    {Array.isArray(results.recommendedResources) && results.recommendedResources.map((resource, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 text-blue-500">
                          <FontAwesomeIcon icon={faArrowRight} />
                        </div>
                        <div>
                          <p className="text-gray-300">{resource.title}</p>
                          {resource.url && (
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 text-sm hover:underline"
                            >
                              {resource.url}
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                    {(!Array.isArray(results.recommendedResources) || results.recommendedResources.length === 0) && (
                      <p className="text-gray-400">No specific resources were recommended.</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-10">
              <Link to="/dashboard" className="px-4 py-2 border border-gray-300 text-white rounded-md font-medium text-sm">
                Back to Dashboard
              </Link>
              <Link 
                to="/interview" 
                className="px-4 py-2 bg-white text-black rounded-md font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                Start New Interview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewResults;
