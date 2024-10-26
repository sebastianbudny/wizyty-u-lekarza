import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const Home = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointments from backend
    fetch('http://localhost:5555/api/visits')
      .then(response => response.json())
      .then(data => setAppointments(data.data));
  }, []);

  return (
    <Container>
      <h2 className="my-4">Wszystkie Wizyty</h2>
      <Row>
        {appointments.map((appointment, index) => (
          <Col key={index} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{appointment.patient}</Card.Title>
                <Card.Text>
                  Data: {appointment.visitDate}<br />
                  Godzina: {appointment.visitTime}<br />
                  Lekarz: {appointment.doctor}<br />
                  Cel: {appointment.purpose}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;