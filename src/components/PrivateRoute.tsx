import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  // If authenticated but profile not complete, redirect to onboarding
  // Exception: allow access to onboarding page itself
  if (user && !user.profile_complete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }
  
  // If authenticated and profile complete, allow access
  return <Outlet />;
};

export default PrivateRoute;
