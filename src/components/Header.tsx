import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faChevronDown, faBars, faTimes, faUser, faSignOutAlt, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import { useOutsideClick } from '../hooks/use-outside-click';

type HeaderProps = {
  transparent?: boolean;
};

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  
  const menuRef = useOutsideClick(() => {
    setShowProfileMenu(false);
  });
  
  const mobileMenuRef = useOutsideClick(() => {
    setShowMenu(false);
  });
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-700';
  };
  
  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <header className={`w-full py-4 ${transparent ? 'absolute top-0 left-0 z-10' : 'bg-white shadow-sm'}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/home" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-md">
              <FontAwesomeIcon icon={faMicrophone} className="text-md" />
            </div>
            <span className="font-bold text-xl text-gray-900">InterviewAI</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/home" className={`font-medium hover:text-blue-600 transition-colors ${isActive('/home')}`}>Home</Link>
          {isLoggedIn && (
            <>
              <Link to="/dashboard" className={`font-medium hover:text-blue-600 transition-colors ${isActive('/dashboard')}`}>Dashboard</Link>
              <Link to="/interview" className={`font-medium hover:text-blue-600 transition-colors ${isActive('/interview')}`}>Practice</Link>
            </>
          )}
        </nav>
        
        {/* User menu or Auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <FontAwesomeIcon icon={faUser} className="text-sm" />
                </div>
                <span className="font-medium">{user?.username || user?.name || 'User'}</span>
                <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-xs" />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 animate-fadeInUp">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FontAwesomeIcon icon={faChartLine} />
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/" className="btn btn-secondary">Sign In</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2">
            <FontAwesomeIcon icon={showMenu ? faTimes : faBars} className="text-gray-700 text-xl" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {showMenu && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-20 animate-fadeInUp" ref={mobileMenuRef}>
          <div className="container mx-auto p-4 flex flex-col gap-3">
            <Link to="/home" className="py-2 font-medium text-gray-900 hover:text-blue-600">Home</Link>
            {isLoggedIn && (
              <>
                <Link to="/dashboard" className="py-2 font-medium text-gray-900 hover:text-blue-600">Dashboard</Link>
                <Link to="/interview" className="py-2 font-medium text-gray-900 hover:text-blue-600">Practice</Link>
              </>
            )}
            <div className="border-t border-gray-200 pt-3 mt-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <FontAwesomeIcon icon={faUser} className="text-sm" />
                    </div>
                    <span className="font-medium">{user?.username || user?.name || 'User'}</span>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="w-full py-2 text-center bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="w-full py-2 text-center bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Sign In</Link>
                  <Link to="/signup" className="w-full py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
