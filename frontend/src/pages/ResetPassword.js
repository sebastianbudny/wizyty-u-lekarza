// filepath: frontend/src/pages/ResetPassword.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ResetPasswordForm from '../components/ResetPasswordForm';

const ResetPassword = () => {
  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2>Resetowanie Hasła</h2>
          <ResetPasswordForm />
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;