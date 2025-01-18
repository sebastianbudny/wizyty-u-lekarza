import { Navigate } from 'react-router-dom';
import UserService from '../services/UserService';

const allowedPaths = {
  registrar: [
    '/registrar-dashboard',
    '/visits/add',
    '/visits/manage',
    '/doctors',
    '/doctors/add',
    '/doctors/manage'
  ],
  admin: [
    '/admin-dashboard',
    '/registrars/manage'
  ],

  superadmin: [
    '/superadmin-dashboard',
    '/admin-requests/manage',
    '/admins/manage'
  ]
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.token;
  };

  const token = UserService.setupToken();
  const user = JSON.parse(localStorage.getItem('user'));
  const currentPath = window.location.pathname;

  if (!isAuthenticated() || !token) {
    return <Navigate to="/login" />;
  }

  const userRole = user.role;
  const allowedPathsForRole = allowedPaths[userRole] || [];

  if (!allowedPathsForRole.includes(currentPath)) {
    if (userRole === 'superadmin') {
      return <Navigate to="/superadmin-dashboard" />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin-dashboard" />;
    } else if (userRole === 'registrar') {
      return <Navigate to="/registrar-dashboard" />;
    }
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;