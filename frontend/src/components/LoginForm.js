// filepath: frontend/src/components/LoginForm.js
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const LoginForm = ({ onLogin }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmailOrUsername">
          <Form.Label>Email lub Login</Form.Label>
          <Form.Control
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder="Wprowadź email lub login"
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
        <Button variant="primary" type="submit">
          Zaloguj się
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;