import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Wizyty u Lekarza</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {user && user.role === 'rejestrator' && (
              <>
                <Nav.Link as={Link} to="/home">Home</Nav.Link>
                <Nav.Link as={Link} to="/doctors">Lekarze</Nav.Link>
                <Nav.Link as={Link} to="/register-doctor">Rejestracja Lekarza</Nav.Link>
                <Nav.Link as={Link} to="/delete-doctor">Usunięcie Lekarza</Nav.Link>
                <Nav.Link as={Link} to="/add-visit">Dodanie Wizyty</Nav.Link>
                <Nav.Link as={Link} to="/update-visit">Aktualizacja Wizyty</Nav.Link>
                <Nav.Link as={Link} to="/delete-visit">Usunięcie Wizyty</Nav.Link>
                <Nav.Link as={Link} to="/change-password">Zmiana Hasła</Nav.Link>
                <Nav.Link as={Link} to="/" onClick={onLogout}>Wyloguj się</Nav.Link>
              </>
            )}
            {user && user.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/requests">Wnioski</Nav.Link>
                <Nav.Link as={Link} to="/user-management">Zarządzanie Użytkownikami</Nav.Link>
                <Nav.Link as={Link} to="/change-password">Zmiana Hasła</Nav.Link>
                <Nav.Link as={Link} to="/" onClick={onLogout}>Wyloguj się</Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="ml-auto">
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">Logowanie</Nav.Link>
                <Nav.Link as={Link} to="/register">Rejestracja</Nav.Link>
                <Nav.Link as={Link} to="/reset-password">Resetowanie Hasła</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;