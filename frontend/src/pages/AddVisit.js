import React from 'react';
import { Container } from 'react-bootstrap';
import VisitForm from '../components/VisitForm';

const AddVisit = () => {
  const handleAdd = (visit) => {
    // Send POST request to backend to add visit
    fetch('http://localhost:5555/api/visits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visit),
    }).then(response => response.json())
      .then(data => console.log(data));
  };

  return (
    <Container>
      <h2>Dodanie Wizyty</h2>
      <VisitForm onSubmit={handleAdd} />
    </Container>
  );
};

export default AddVisit;