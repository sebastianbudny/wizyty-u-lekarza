import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import RegisterDoctor from './pages/RegisterDoctor';
import UpdateDoctor from './pages/UpdateDoctor';
import DeleteDoctor from './pages/DeleteDoctor';
import AddVisit from './pages/AddVisit';
import UpdateVisit from './pages/UpdateVisit';
import DeleteVisit from './pages/DeleteVisit';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Mailbox from './pages/Mailbox';
import Requests from './pages/Requests';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';
import ChangePassword from './pages/ChangePassword';
import UserManagement from './pages/UserManagement';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  useEffect(() => {
    const mailboxOpened = localStorage.getItem('mailboxOpened');
    if (!mailboxOpened) {
      const newWindow = window.open('/mailbox', '_blank');
      if (newWindow) {
        localStorage.setItem('mailboxOpened', 'true');
      } else {
        console.log('Failed to open mailbox');
      }
    }

    // Resetowanie localStorage przy zamknięciu aplikacji
    const resetMailboxOpened = () => {
      localStorage.removeItem('mailboxOpened');
    };

    window.addEventListener('beforeunload', resetMailboxOpened);

    return () => {
      window.removeEventListener('beforeunload', resetMailboxOpened);
    };
  }, []);

  return (
    <Router>
      <div>
        <Header user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? "/user-management" : "/home"} /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? "/user-management" : "/home"} /> : <Register />} />
          <Route path="/reset-password" element={user ? <Navigate to={user.role === 'admin' ? "/user-management" : "/home"} /> : <ResetPassword />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/register-doctor" element={<ProtectedRoute><RegisterDoctor /></ProtectedRoute>} />
          <Route path="/update-doctor" element={<ProtectedRoute><UpdateDoctor /></ProtectedRoute>} />
          <Route path="/delete-doctor" element={<ProtectedRoute><DeleteDoctor /></ProtectedRoute>} />
          <Route path="/add-visit" element={<ProtectedRoute><AddVisit /></ProtectedRoute>} />
          <Route path="/update-visit" element={<ProtectedRoute><UpdateVisit /></ProtectedRoute>} />
          <Route path="/delete-visit" element={<ProtectedRoute><DeleteVisit /></ProtectedRoute>} />
          <Route path="/mailbox" element={<ProtectedRoute><Mailbox /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          <Route path="/user-panel" element={<ProtectedRoute><UserPanel /></ProtectedRoute>} />
          <Route path="/admin-panel" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;