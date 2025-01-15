import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login.js';
import Register from './components/Register.js';
import ForgotPassword from './components/ForgotPassword.js';
import Header from './components/Header.js';
import RequestAdmin from './components/RequestAdmin.js';
import ResetPassword from './components/ResetPassword.js';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/request-admin" element={<RequestAdmin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
