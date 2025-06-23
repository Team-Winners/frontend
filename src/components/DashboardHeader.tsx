import { useContext, useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleNotch,
  faAngleDown,
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardHeader = () => {
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useContext(AuthContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUser(null);
    setShowProfileMenu(false);
    navigate('/');
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 sm:px-12 py-4 w-full bg-white text-black border-b border-gray-200">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <FontAwesomeIcon icon={faCircleNotch} className="text-xl text-black" />
        <p className="font-medium text-lg tracking-tight">Untitled AI</p>
      </Link>

      {/* Navigation */}
      <div className="hidden md:flex items-center gap-8 whitespace-nowrap text-sm font-medium">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <div className="cursor-pointer flex items-center gap-1 hover:text-gray-300">
          Products <FontAwesomeIcon icon={faAngleDown} className="text-xs" />
        </div>
        <div
          className="cursor-pointer hover:text-gray-300"
          onClick={() => {
            const chatFeature = document.getElementById('chat-feature');
            if (chatFeature) {
              chatFeature.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Mock AI
        </div>

        {/* Auth Logic */}
        {isLoggedIn ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-black"
            >
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <span>{user?.username || user?.name || 'User'}</span>
              <FontAwesomeIcon icon={faAngleDown} className="text-xs" />
            </button>

            {/* Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-30 border border-gray-200">
                <Link
                  to="/dashboard"
                  className="block p-4 text-sm hover:bg-gray-100 border-b border-gray-200"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left p-4 text-sm hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/signup"
            className="ml-2 border-2 border-white rounded-full font-medium py-2 px-4 text-sm hover:bg-white hover:text-black transition-all duration-300"
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
