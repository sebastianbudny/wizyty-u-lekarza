import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = ({ user, onLogout }) => {
  return (
    <>
      <div className="header-title">
        Wizyty u Lekarza
      </div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {user && user.role === 'rejestrator' && (
                <>
                  <Nav.Link href="/user-home">Wizyty u Lekarza</Nav.Link>
                  <Nav.Link href="/doctors">Lekarze</Nav.Link>
                  <Nav.Link href="/register-doctor">Rejestracja Lekarza</Nav.Link>
                  <Nav.Link href="/delete-doctor">Usunięcie Lekarza</Nav.Link>
                  <Nav.Link href="/add-visit">Dodanie Wizyty</Nav.Link>
                  <Nav.Link href="/update-visit">Aktualizacja Wizyty</Nav.Link>
                  <Nav.Link href="/delete-visit">Usunięcie Wizyty</Nav.Link>
                  <Nav.Link href="/change-password">Zmiana Hasła</Nav.Link>
                  <Nav.Link href="/" onClick={onLogout}>Wyloguj się</Nav.Link>
                </>
              )}
              {user && user.role === 'admin' && (
                <>
                  <Nav.Link href="/admin-home">Lista użytkowników</Nav.Link>
                  <Nav.Link href="/user-management">Zarządzanie użytkownikami</Nav.Link>
                  <Nav.Link href="/change-password">Zmiana Hasła</Nav.Link>
                  <Nav.Link href="/" onClick={onLogout}>Wyloguj się</Nav.Link>
                </>
              )}
            </Nav>
            <Nav className="ml-auto">
              {!user && (
                <>
                  <Nav.Link href="/login">Logowanie</Nav.Link>
                  <Nav.Link href="/register">Rejestracja</Nav.Link>
                  <Nav.Link href="/reset-password">Resetowanie Hasła</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;