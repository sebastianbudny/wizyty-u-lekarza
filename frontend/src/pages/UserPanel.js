import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Doctors from './Doctors';
import AddVisit from './AddVisit';
import UpdateVisit from './UpdateVisit';
import DeleteVisit from './DeleteVisit';

const UserPanel = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h2>Panel Użytkownika</h2>
          <Doctors />
          <AddVisit />
          <UpdateVisit />
          <DeleteVisit />
        </Col>
      </Row>
    </Container>
  );
};

export default UserPanel;