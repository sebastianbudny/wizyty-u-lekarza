import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import DoctorsList from './components/registrar/doctors/DoctorsList';
import AddDoctor from './components/registrar/doctors/AddDoctor';
import UpdateDoctor from './components/registrar/doctors/UpdateDoctor';
import DeleteDoctor from './components/registrar/doctors/DeleteDoctor';
import AddVisit from './components/registrar/visits/AddVisit';
import UpdateVisit from './components/registrar/visits/UpdateVisit';
import DeleteVisit from './components/registrar/visits/DeleteVisit';

//Komponenty panelu administratora
import AdminDashboard from './components/admin/AdminDashboard';

//Komponenty panelu superadministratora
import SuperadminDashboard from './components/superadmin/SuperadminDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        {!['/login', '/register', '/forgot-password', '/reset-password', '/request-admin'].includes(window.location.pathname) && ( <Navbar />)}
        <Routes>
          {/*Trasy działające przed zalogowaniem*/}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/request-admin" element={<RequestAdmin />} />

          {/*Trasy dla rejestratora*/}
          <Route path="/registrar-dashboard" element={<ProtectedRoute><RegistrarDashboard /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><DoctorsList /></ProtectedRoute>} />
          <Route path="/doctors/add" element={<ProtectedRoute><AddDoctor /></ProtectedRoute>} />
          <Route path="/doctors/update/:id" element={<ProtectedRoute><UpdateDoctor /></ProtectedRoute>} />
          <Route path="/doctors/delete/:id" element={<ProtectedRoute><DeleteDoctor /></ProtectedRoute>} />
          <Route path="/visits/add" element={<ProtectedRoute><AddVisit /></ProtectedRoute>} />
          <Route path="/visits/update/:id" element={<ProtectedRoute><UpdateVisit /></ProtectedRoute>} />
          <Route path="/visits/delete/:id" element={<ProtectedRoute><DeleteVisit /></ProtectedRoute>} />

          {/*Trasy dla administratora*/}
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/*Trasy dla superadministratora*/}
          <Route path="/superadmin-dashboard" element={<ProtectedRoute><SuperadminDashboard /></ProtectedRoute>} />

          {/*Domyślna trasa*/}
          <Route path="/" element={ <Navigate to="/login" replace />} />
          <Route path="*" element={ <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
