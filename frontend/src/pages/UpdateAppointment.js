import React from 'react';
import { Container } from 'react-bootstrap';
import AppointmentForm from '../components/AppointmentForm';

const UpdateAppointment = () => {
  const handleUpdate = (appointment) => {
    // Send PUT request to backend to update appointment
    fetch(`http://localhost:5555/api/visits/${appointment.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointment),
    }).then(response => response.json())
      .then(data => console.log(data));
  };

  return (
    <Container>
      <h2>Aktualizacja Wizyty</h2>
      <AppointmentForm onSubmit={handleUpdate} />
    </Container>
  );
};

export default UpdateAppointment;