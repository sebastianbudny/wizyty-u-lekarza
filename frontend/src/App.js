import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

//Komponenty układu
import Navbar from './components/layout/Navbar';

//Chroniona trasa
import ProtectedRoute from './components/ProtectedRoute';

//Komponenty logowanie, rejestracja, reset hasła, wniosek o uprawnienia administratorskie
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import RequestAdmin from './components/RequestAdmin';

//Komponenty panelu rejestratora
import RegistrarDashboard from './components/registrar/RegistrarDashboard';
import AddVisit from './components/registrar/visits/AddVisit';
import ManageVisits from './components/registrar/visits/ManageVisits';
import DoctorsList from './components/registrar/doctors/DoctorsList';
import AddDoctor from './components/registrar/doctors/AddDoctor';
import ManageDoctors from './components/registrar/doctors/ManageDoctors';


//Komponenty panelu administratora
import AdminDashboard from './components/admin/AdminDashboard';
import ManageRegistrars from './components/admin/ManageRegistrars';

//Komponenty panelu superadministratora
import SuperadminDashboard from './components/superadmin/SuperadminDashboard';
import ManageAdminRequests from './components/superadmin/ManageAdminRequests';
import ManageAdmins from './components/superadmin/ManageAdmins';

//Serwisy do komunikacji z API
import UserService from './services/UserService';

//Interceptory do obsługi błędów
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      UserService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const AppContent = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/*Trasy działające przed zalogowaniem*/}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/request-admin" element={<RequestAdmin />} />

        {/*Trasy dla rejestratora*/}
        <Route path="/registrar-dashboard" element={<ProtectedRoute><RegistrarDashboard /></ProtectedRoute>} />
        <Route path="/visits/add" element={<ProtectedRoute><AddVisit /></ProtectedRoute>} />
        <Route path="/visits/manage" element={<ProtectedRoute><ManageVisits /></ProtectedRoute>} />

        <Route path="/doctors" element={<ProtectedRoute><DoctorsList /></ProtectedRoute>} />
        <Route path="/doctors/add" element={<ProtectedRoute><AddDoctor /></ProtectedRoute>} />
        <Route path="/doctors/manage" element={<ProtectedRoute><ManageDoctors /></ProtectedRoute>} />
        
        

        {/*Trasy dla administratora*/}
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/registrars/manage" element={<ProtectedRoute><ManageRegistrars /></ProtectedRoute>} />

        {/*Trasy dla superadministratora*/}
        <Route path="/superadmin-dashboard" element={<ProtectedRoute><SuperadminDashboard /></ProtectedRoute>} />
        <Route path="/admin-requests/manage" element={<ProtectedRoute><ManageAdminRequests /></ProtectedRoute>} />
        <Route path="/admins/manage" element={<ProtectedRoute><ManageAdmins /></ProtectedRoute>} />

        {/*Domyślna trasa*/}
        <Route path="/" element={ <Navigate to="/login" replace />} />
        <Route path="*" element={ <Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
