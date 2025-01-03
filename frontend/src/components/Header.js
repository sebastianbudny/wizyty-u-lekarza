import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Wizyty u Lekarza</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/doctors">Lekarze</Nav.Link>
            <Nav.Link as={Link} to="/register-doctor">Rejestracja Lekarza</Nav.Link>
            <Nav.Link as={Link} to="/update-doctor">Aktualizacja Lekarza</Nav.Link>
            <Nav.Link as={Link} to="/delete-doctor">Usunięcie Lekarza</Nav.Link>
            <Nav.Link as={Link} to="/add-appointment">Dodanie Wizyty</Nav.Link>
            <Nav.Link as={Link} to="/update-appointment">Aktualizacja Wizyty</Nav.Link>
            <Nav.Link as={Link} to="/delete-appointment">Usunięcie Wizyty</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;