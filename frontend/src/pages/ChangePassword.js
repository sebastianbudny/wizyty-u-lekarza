// filepath: frontend/src/pages/ChangePassword.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChangePasswordForm from '../components/ChangePasswordForm';

const ChangePassword = () => {
  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2>Zmiana Hasła</h2>
          <ChangePasswordForm />
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;