import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

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
      console.log('Login response:', data); // Dodaj logowanie do konsoli
      if (response.ok) {
        onLogin(data);
        navigate(data.role === 'admin' ? '/admin-home' : '/user-home');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Wystąpił błąd podczas logowania');
    }
  };

  return (
    <Container>
      <h2>Logowanie</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmailOrUsername">
          <Form.Label>Email lub Nazwa Użytkownika</Form.Label>
          <Form.Control
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder="Wprowadź email lub nazwę użytkownika"
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Hasło</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Zaloguj się
        </Button>
      </Form>
    </Container>
  );
};

export default Login;