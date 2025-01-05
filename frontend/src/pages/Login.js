import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Login = ({ onLogin }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      navigate(data.role === 'admin' ? '/user-management' : '/home');
    } else {
      alert(data.message);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2>Logowanie</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmailOrUsername">
              <Form.Label>Email lub Nazwa użytkownika</Form.Label>
              <Form.Control
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="Wprowadź email lub nazwę użytkownika"
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
        </Col>
      </Row>
    </Container>
  );
};

export default Login;