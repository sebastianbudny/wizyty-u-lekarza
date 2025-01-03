// filepath: frontend/src/pages/UserPanel.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Doctors from './Doctors';
import AddAppointment from './AddAppointment';
import UpdateAppointment from './UpdateAppointment';
import DeleteAppointment from './DeleteAppointment';

const UserPanel = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h2>Panel Użytkownika</h2>
          <Doctors />
          <AddAppointment />
          <UpdateAppointment />
          <DeleteAppointment />
        </Col>
      </Row>
    </Container>
  );
};

export default UserPanel;