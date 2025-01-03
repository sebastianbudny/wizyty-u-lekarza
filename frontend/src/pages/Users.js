// filepath: frontend/src/pages/Users.js
import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from backend
    fetch('http://localhost:5555/api/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  const handleResetPassword = (userId) => {
    // Send POST request to backend to reset password
    fetch('http://localhost:5555/api/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    }).then(response => response.json())
      .then(data => {
        alert(data.message);
      });
  };

  return (
    <Container>
      <h2 className="my-4">Użytkownicy</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="warning" onClick={() => handleResetPassword(user._id)}>Resetuj Hasło</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Users;