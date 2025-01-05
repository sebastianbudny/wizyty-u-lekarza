import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from '../components/LoginForm';

const Login = ({ onLogin }) => {
  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2>Logowanie</h2>
          <LoginForm onLogin={onLogin} />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;