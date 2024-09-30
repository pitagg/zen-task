import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ apiClient, children }) => {
  const location = useLocation();
  if (!apiClient.isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
