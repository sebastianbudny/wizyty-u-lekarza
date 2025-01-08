import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';

const UserPanel = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/users/me');
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setErrorMessage('Wystąpił błąd podczas pobierania danych użytkownika');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'DELETE',
      });
      if (response.ok) {
        setSuccessMessage('Konto zostało pomyślnie usunięte');
        setUser(null);
      } else {
        const errorData = await response.json();
        setErrorMessage(`Błąd: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setErrorMessage('Wystąpił błąd podczas usuwania konta');
    }
  };

  return (
    <Container>
      <h2>Panel Użytkownika</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {user ? (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Nazwa Użytkownika</th>
              <th>Email</th>
              <th>Rola</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="danger" onClick={handleDeleteAccount}>
                  Usuń Konto
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">Nie znaleziono danych użytkownika</Alert>
      )}
    </Container>
  );
};

export default UserPanel;