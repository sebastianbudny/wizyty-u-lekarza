import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import UserManagementForm from '../components/UserManagementForm';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  const handleAddUser = async (user) => {
    await fetch('/api/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    fetchUsers();
  };

  const handleBlockUser = async (userId) => {
    await fetch(`/api/users/block/${userId}`, {
      method: 'PUT',
    });
    fetchUsers();
  };

  const handleUnblockUser = async (userId) => {
    await fetch(`/api/users/unblock/${userId}`, {
      method: 'PUT',
    });
    fetchUsers();
  };

  const handleResetPassword = async (email) => {
    const response = await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    alert(data.message);
  };

  return (
    <Container>
      <h2>Zarządzanie Użytkownikami</h2>
      <UserManagementForm onSubmit={handleAddUser} />
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Nazwa użytkownika</th>
            <th>Email</th>
            <th>Rola</th>
            <th>Aktywny</th>
            <th>Zablokowany</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? 'Tak' : 'Nie'}</td>
              <td>{user.blocked ? 'Tak' : 'Nie'}</td>
              <td>
                {user.blocked ? (
                  <Button variant="success" onClick={() => handleUnblockUser(user._id)}>Odblokuj</Button>
                ) : (
                  <Button variant="danger" onClick={() => handleBlockUser(user._id)}>Zablokuj</Button>
                )}
                <Button variant="warning" onClick={() => handleResetPassword(user.email)}>Resetuj Hasło</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserManagement;