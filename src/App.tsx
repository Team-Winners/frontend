import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Homepage from './components/Homepage';
import Dashboard from './components/DashBoard';
import Onboarding from './components/Onboarding';
import MockInterview from './components/MockInterview';
import InterviewResults from './components/InterviewResults';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import authService from './services/auth.service';
import type { User } from './services/auth.service';
import { AuthContext } from './context/AuthContext';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in on app load
    const checkAuthStatus = async () => {
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setIsLoggedIn(true);
            setUser(currentUser);
          } else {
            // Token is invalid
            setIsLoggedIn(false);
            setUser(null);
            authService.logout();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          // Don't logout immediately, might be network issue
          // Just use the stored user data for now
          const storedUser = authService.getUser();
          if (storedUser) {
            setIsLoggedIn(true);
            setUser(storedUser);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, logout }}>
      <Router>
        <Routes>
          {/* Public routes - accessible without authentication */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Route>
          
          {/* Protected routes - require authentication */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/interview" element={<MockInterview />} />
            <Route path="/results/:id" element={<InterviewResults />} />
          </Route>
          
          {/* Catch-all route - redirect to homepage */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
