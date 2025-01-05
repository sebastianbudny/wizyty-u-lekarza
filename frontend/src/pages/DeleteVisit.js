import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const DeleteVisit = () => {
  const [visitId, setVisitId] = useState('');

  const handleDelete = () => {
    // Send DELETE request to backend to delete visit
    fetch(`http://localhost:5555/api/visits/${visitId}`, {
      method: 'DELETE',
    }).then(response => response.json())
      .then(data => console.log(data));
  };

  return (
    <Container>
      <h2>Usunięcie Wizyty</h2>
      <Form onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
        <Form.Group controlId="formVisitId">
          <Form.Label>ID Wizyty</Form.Label>
          <Form.Control
            type="text"
            value={visitId}
            onChange={(e) => setVisitId(e.target.value)}
            placeholder="Wprowadź ID wizyty"
          />
        </Form.Group>
        <Button variant="danger" type="submit">
          Usuń
        </Button>
      </Form>
    </Container>
  );
};

export default DeleteVisit;