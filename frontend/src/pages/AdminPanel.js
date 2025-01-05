import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Requests from './Requests';
import UserManagement from './UserManagement';

const AdminPanel = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h2>Panel Administratora</h2>
          <Requests />
          <UserManagement />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;