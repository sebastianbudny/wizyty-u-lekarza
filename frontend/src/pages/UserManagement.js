import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMessage('Wystąpił błąd podczas pobierania listy użytkowników');
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSuccessMessage('Użytkownik został pomyślnie usunięty');
        fetchUsers(); // Refresh the list of users
      } else {
        const errorData = await response.json();
        setErrorMessage(`Błąd: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage('Wystąpił błąd podczas usuwania użytkownika');
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      const response = await fetch(`/api/users/reset-password/${userId}`, {
        method: 'POST',
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Wystąpił błąd podczas resetowania hasła');
    }
  };

  return (
    <Container>
      <h2>Zarządzanie Użytkownikami</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
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
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(user._id)}>
                  Usuń
                </Button>
                <Button variant="warning" onClick={() => handleResetPassword(user._id)}>
                  Resetuj Hasło
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserManagement;