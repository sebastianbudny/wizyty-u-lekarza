import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Home from './components/Home';
import AddVisit from './components/AddVisit';
import UpdateVisit from './components/UpdateVisit';
import DeleteVisit from './components/DeleteVisit';
import AddDoctor from './components/AddDoctor';
import UpdateDoctor from './components/UpdateDoctor';
import DeleteDoctor from './components/DeleteDoctor';
import './App.css'; 


function App() {
  return (
    <Router>
      <Container>
        {/* Górny nagłówek */}
        <Navbar bg="light" expand="lg" className="justify-content-center">
          <Navbar.Brand>System Umawiania Wizyt</Navbar.Brand>
        </Navbar>

        {/* Pasek nawigacyjny z zakładkami */}
        <Navbar bg="orange" expand="lg">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/home">Strona Główna</Nav.Link>
            <Nav.Link as={Link} to="/add-visit">Dodaj Wizytę</Nav.Link>
            <Nav.Link as={Link} to="/update-visit">Aktualizuj Wizytę</Nav.Link>
            <Nav.Link as={Link} to="/delete-visit">Usuń Wizytę</Nav.Link>
            <Nav.Link as={Link} to="/add-doctor">Dodaj Lekarza</Nav.Link>
            <Nav.Link as={Link} to="/update-doctor">Aktualizuj Lekarza</Nav.Link>
            <Nav.Link as={Link} to="/delete-doctor">Usuń Lekarza</Nav.Link>
          </Nav>
        </Navbar>

        {/* Zawartość zakładek */}
        <Container className="mt-3">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add-visit" element={<AddVisit />} />
            <Route path="/update-visit" element={<UpdateVisit />} />
            <Route path="/delete-visit" element={<DeleteVisit />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/update-doctor" element={<UpdateDoctor />} />
            <Route path="/delete-doctor" element={<DeleteDoctor />} />
          </Routes>
        </Container>
      </Container>
    </Router>
  );
}

export default App;
