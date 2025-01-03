// filepath: frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import LoginRegister from './pages/LoginRegister';
import Mailbox from './pages/Mailbox';
import Requests from './pages/Requests';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    window.open('/mailbox', '_blank');
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route exact path="/" element={<LoginRegister onLogin={handleLogin} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/register-doctor" element={<RegisterDoctor />} />
          <Route path="/update-doctor" element={<UpdateDoctor />} />
          <Route path="/delete-doctor" element={<DeleteDoctor />} />
          <Route path="/add-appointment" element={<AddAppointment />} />
          <Route path="/update-appointment" element={<UpdateAppointment />} />
          <Route path="/delete-appointment" element={<DeleteAppointment />} />
          <Route path="/mailbox" element={<Mailbox />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/user-panel" element={<UserPanel />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;