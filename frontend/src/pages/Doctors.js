import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch doctors from backend
    fetch('http://localhost:5555/api/doctors')
      .then(response => response.json())
      .then(data => setDoctors(data.data));
  }, []);

  return (
    <Container>
      <h2 className="my-4">Wszyscy Lekarze</h2>
      <Row>
        {doctors.map((doctor, index) => (
          <Col key={index} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{doctor.doctorName}</Card.Title>
                <Card.Text>
                  Specjalizacja: {doctor.specialization}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Doctors;