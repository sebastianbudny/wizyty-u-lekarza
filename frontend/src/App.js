import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import UserHome from './pages/UserHome';
import AdminHome from './pages/AdminHome';
import AddVisit from './pages/AddVisit';
import UpdateVisit from './pages/UpdateVisit';
import DeleteVisit from './pages/DeleteVisit';
import Doctors from './pages/Doctors';
import RegisterDoctor from './pages/RegisterDoctor';
import UpdateDoctor from './pages/UpdateDoctor';
import DeleteDoctor from './pages/DeleteDoctor';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/ResetPassword';
import UserManagement from './pages/UserManagement';
import UserPanel from './pages/UserPanel';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    console.log('Logged in user from localStorage:', loggedInUser); // Dodaj logowanie do konsoli
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (userData) => {
    console.log('User data before setting localStorage:', userData); // Dodaj logowanie do konsoli
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('User data in localStorage:', localStorage.getItem('user')); // Dodaj logowanie do konsoli
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin-home' : '/user-home'} /> : <Navigate to="/login" />} />
            <Route path="/user-home" element={user && user.role === 'rejestrator' ? <UserHome user={user} /> : <Navigate to="/login" />} />
            <Route path="/admin-home" element={user && user.role === 'admin' ? <AdminHome user={user} /> : <Navigate to="/login" />} />
            <Route path="/add-visit" element={user && user.role === 'rejestrator' ? <AddVisit /> : <Navigate to="/login" />} />
            <Route path="/update-visit" element={user && user.role === 'rejestrator' ? <UpdateVisit /> : <Navigate to="/login" />} />
            <Route path="/delete-visit" element={user && user.role === 'rejestrator' ? <DeleteVisit /> : <Navigate to="/login" />} />
            <Route path="/doctors" element={user && user.role === 'rejestrator' ? <Doctors /> : <Navigate to="/login" />} />
            <Route path="/register-doctor" element={user && user.role === 'rejestrator' ? <RegisterDoctor /> : <Navigate to="/login" />} />
            <Route path="/update-doctor" element={user && user.role === 'rejestrator' ? <UpdateDoctor /> : <Navigate to="/login" />} />
            <Route path="/delete-doctor" element={user && user.role === 'rejestrator' ? <DeleteDoctor /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/user-management" element={user && user.role === 'admin' ? <UserManagement /> : <Navigate to="/login" />} />
            <Route path="/user-panel" element={<UserPanel />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;