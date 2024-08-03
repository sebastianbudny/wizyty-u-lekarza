import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from '../axiosConfig';

const AddDoctor = () => {
  const [doctorData, setDoctorData] = useState({
    doctorName: '',
    specialization: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({
      ...doctorData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/doctors', doctorData)
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h2>Dodaj Lekarza</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="doctorName">
          <Form.Label>Imię i Nazwisko</Form.Label>
          <Form.Control
            type="text"
            name="doctorName"
            value={doctorData.doctorName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="specialization">
          <Form.Label>Specjalizacja</Form.Label>
          <Form.Control
            type="text"
            name="specialization"
            value={doctorData.specialization}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Dodaj Lekarza
        </Button>
      </Form>
    </div>
  );
};

export default AddDoctor;