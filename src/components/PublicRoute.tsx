import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const location = useLocation();
  
  if (isLoggedIn && user) {
    // If user is on homepage and logged in, redirect based on profile completion
    if (location.pathname === '/') {
      return user.profile_complete ? (
        <Navigate to="/dashboard" />
      ) : (
        <Navigate to="/onboarding" />
      );
    }
    
    // For other public routes (login/signup), always redirect to dashboard if logged in
    return user.profile_complete ? (
      <Navigate to="/dashboard" />
    ) : (
      <Navigate to="/onboarding" />
    );
  }
  
  // If not authenticated, show the public route
  return <Outlet />;
};

export default PublicRoute;
