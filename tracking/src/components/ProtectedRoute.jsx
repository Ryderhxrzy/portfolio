/**
 * Protected Route component
 * Redirects to login if user is not authenticated
 * 
 * TODO: Replace with real authentication check using JWT tokens
 */

import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useApp();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;



