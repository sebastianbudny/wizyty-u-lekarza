import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from '../axiosConfig';

const DeleteDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');

  useEffect(() => {
    axios.get('/api/doctors')
      .then(response => setDoctors(response.data.data)) // Poprawione tutaj
      .catch(error => console.error('Error fetching doctors:', error));
  }, []);

  const handleSelectChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.delete(`/api/doctors/${selectedDoctor}`)
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h2>Usuń Lekarza</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="selectDoctor">
          <Form.Label>Wybierz Lekarza</Form.Label>
          <Form.Control as="select" value={selectedDoctor} onChange={handleSelectChange}>
            <option value="">Wybierz...</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.doctorName} - {doctor.specialization} {/* Dopasowane do twoich danych */}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="danger" type="submit">
          Usuń Lekarza
        </Button>
      </Form>
    </div>
  );
};

export default DeleteDoctor;