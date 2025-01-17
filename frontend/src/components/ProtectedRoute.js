import { Navigate } from 'react-router-dom';
import UserService from '../services/UserService';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = UserService.setupToken();
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (window.location.pathname.startsWith('/registrar') && user?.role !== 'registrar') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;