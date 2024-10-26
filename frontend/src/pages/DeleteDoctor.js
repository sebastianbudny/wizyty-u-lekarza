import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const DeleteDoctor = () => {
  const [doctorId, setDoctorId] = useState('');

  const handleDelete = () => {
    // Send DELETE request to backend to delete doctor
    fetch(`http://localhost:5555/api/doctors/${doctorId}`, {
      method: 'DELETE',
    }).then(response => response.json())
      .then(data => console.log(data));
  };

  return (
    <Container>
      <h2>Usunięcie Lekarza</h2>
      <Form onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
        <Form.Group controlId="formDoctorId">
          <Form.Label>ID Lekarza</Form.Label>
          <Form.Control
            type="text"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            placeholder="Wprowadź ID lekarza"
          />
        </Form.Group>
        <Button variant="danger" type="submit">
          Usuń
        </Button>
      </Form>
    </Container>
  );
};

export default DeleteDoctor;