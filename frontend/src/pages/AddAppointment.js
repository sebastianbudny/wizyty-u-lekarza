import React from 'react';
import { Container } from 'react-bootstrap';
import AppointmentForm from '../components/AppointmentForm';

const AddAppointment = () => {
  const handleAdd = (appointment) => {
    // Send POST request to backend to add appointment
    fetch('http://localhost:5555/api/visits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointment),
    }).then(response => response.json())
      .then(data => console.log(data));
  };

  return (
    <Container>
      <h2>Dodanie Wizyty</h2>
      <AppointmentForm onSubmit={handleAdd} />
    </Container>
  );
};

export default AddAppointment;