// filepath: /c:/Inzynier/wizyty-u-lekarza/frontend/src/App.js
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
import AddAppointment from './pages/AddAppointment';
import UpdateAppointment from './pages/UpdateAppointment';
import DeleteAppointment from './pages/DeleteAppointment';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Mailbox from './pages/Mailbox';
import Requests from './pages/Requests';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';
import ChangePassword from './pages/ChangePassword';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  useEffect(() => {
    const mailboxOpened = localStorage.getItem('mailboxOpened');
    console.log('Checking if mailbox was opened:', mailboxOpened);
    if (!mailboxOpened) {
      console.log('Opening mailbox...');
      const newWindow = window.open('/mailbox', '_blank');
      if (newWindow) {
        console.log('Mailbox opened successfully');
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
        <Header user={user} />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/register-doctor" element={<ProtectedRoute><RegisterDoctor /></ProtectedRoute>} />
          <Route path="/update-doctor" element={<ProtectedRoute><UpdateDoctor /></ProtectedRoute>} />
          <Route path="/delete-doctor" element={<ProtectedRoute><DeleteDoctor /></ProtectedRoute>} />
          <Route path="/add-appointment" element={<ProtectedRoute><AddAppointment /></ProtectedRoute>} />
          <Route path="/update-appointment" element={<ProtectedRoute><UpdateAppointment /></ProtectedRoute>} />
          <Route path="/delete-appointment" element={<ProtectedRoute><DeleteAppointment /></ProtectedRoute>} />
          <Route path="/mailbox" element={<Mailbox />} />
          <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          <Route path="/user-panel" element={<ProtectedRoute><UserPanel /></ProtectedRoute>} />
          <Route path="/admin-panel" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;