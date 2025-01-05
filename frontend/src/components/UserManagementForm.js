import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const UserManagementForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('rejestrator');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, email, password, role });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Nazwa użytkownika</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Wprowadź nazwę użytkownika"
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Wprowadź email"
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Hasło</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
          />
        </Form.Group>
        <Form.Group controlId="formRole">
          <Form.Label>Rola</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="rejestrator">Rejestrator</option>
            <option value="admin">Admin</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          Dodaj Użytkownika
        </Button>
      </Form>
    </Container>
  );
};

export default UserManagementForm;