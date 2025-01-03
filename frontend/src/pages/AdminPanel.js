// filepath: frontend/src/pages/AdminPanel.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Requests from './Requests';
import Users from './Users';

const AdminPanel = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h2>Panel Administratora</h2>
          <Requests />
          <Users />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;