// filepath: frontend/src/pages/LoginRegister.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const LoginRegister = ({ onLogin }) => {
  return (
    <Container>
      <Row>
        <Col md={6}>
          <h2>Logowanie</h2>
          <LoginForm onLogin={onLogin} />
        </Col>
        <Col md={6}>
          <h2>Rejestracja</h2>
          <RegisterForm />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginRegister;