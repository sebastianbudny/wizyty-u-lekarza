import React from 'react';
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

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/register-doctor" element={<RegisterDoctor />} />
          <Route path="/update-doctor" element={<UpdateDoctor />} />
          <Route path="/delete-doctor" element={<DeleteDoctor />} />
          <Route path="/add-appointment" element={<AddAppointment />} />
          <Route path="/update-appointment" element={<UpdateAppointment />} />
          <Route path="/delete-appointment" element={<DeleteAppointment />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
