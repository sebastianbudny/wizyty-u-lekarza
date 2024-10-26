import React from 'react';
import { Container } from 'react-bootstrap';
import DoctorForm from '../components/DoctorForm';

const RegisterDoctor = () => {
  const handleRegister = (doctor) => {
    // Send POST request to backend to register doctor
    fetch('http://localhost:5555/api/doctors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctor),
    }).then(response => response.json())
      .then(data => console.log(data));
  };

  return (
    <Container>
      <h2>Rejestracja Lekarza</h2>
      <DoctorForm onSubmit={handleRegister} />
    </Container>
  );
};

export default RegisterDoctor;