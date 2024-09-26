import { Navigate, useLocation } from 'react-router-dom';
import ApiClient from '../utils/ApiClient';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!ApiClient.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
