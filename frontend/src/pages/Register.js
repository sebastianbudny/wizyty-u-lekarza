// filepath: frontend/src/pages/Register.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2>Rejestracja</h2>
          <RegisterForm />
        </Col>
      </Row>
    </Container>
  );
};

export default Register;