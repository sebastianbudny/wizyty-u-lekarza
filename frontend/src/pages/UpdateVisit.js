import React from 'react';
import { Container } from 'react-bootstrap';
import VisitForm from '../components/VisitForm';

const UpdateVisit = () => {
  const handleUpdate = (visit) => {
    // Send PUT request to backend to update visit
    fetch(`http://localhost:5555/api/visits/${visit._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visit),
    }).then(response => response.json())
      .then(data => console.log(data));
  };

  return (
    <Container>
      <h2>Aktualizacja Wizyty</h2>
      <VisitForm onSubmit={handleUpdate} />
    </Container>
  );
};

export default UpdateVisit;