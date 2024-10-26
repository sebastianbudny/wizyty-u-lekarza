import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import DoctorForm from '../components/DoctorForm';

const UpdateDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    // Fetch doctors from backend
    fetch('http://localhost:5555/api/doctors')
      .then(response => response.json())
      .then(data => setDoctors(data.data));
  }, []);

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const doctor = doctors.find(doc => doc._id === doctorId);
    setSelectedDoctor(doctor);
  };

  const handleUpdate = (doctor) => {
    // Send PUT request to backend to update doctor
    fetch(`http://localhost:5555/api/doctors/${doctor._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctor),
    }).then(response => response.json())
      .then(data => console.log(data));
  };

  return (
    <Container>
      <h2>Aktualizacja Lekarza</h2>
      <Form.Group controlId="formDoctorSelect">
        <Form.Label>Wybierz Lekarza</Form.Label>
        <Form.Control as="select" onChange={handleDoctorChange}>
          <option value="">Wybierz lekarza</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.doctorName}, {doctor.specialization}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {selectedDoctor && (
        <DoctorForm
          onSubmit={handleUpdate}
          initialData={selectedDoctor}
        />
      )}
    </Container>
  );
};

export default UpdateDoctor;