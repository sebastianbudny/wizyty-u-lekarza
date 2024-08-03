import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from '../axiosConfig';

const UpdateDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorData, setDoctorData] = useState({
    doctorName: '',
    specialization: ''
  });

  useEffect(() => {
    axios.get('/api/doctors')
      .then(response => setDoctors(response.data.data)) // Upewnij się, że używasz response.data.data
      .catch(error => console.error('Error fetching doctors:', error));
  }, []);

  const handleSelectChange = (e) => {
    const doctorId = e.target.value;
    const doctor = doctors.find(d => d._id === doctorId);
    setSelectedDoctor(doctorId);
    setDoctorData(doctor);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({
      ...doctorData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/doctors/${selectedDoctor}`, doctorData)
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h2>Aktualizuj Lekarza</h2>
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
        <Form.Group controlId="doctorName">
          <Form.Label>Imię i Nazwisko</Form.Label>
          <Form.Control
            type="text"
            name="doctorName"
            value={doctorData.doctorName} // Dopasowane do twoich danych
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="specialization">
          <Form.Label>Specjalizacja</Form.Label>
          <Form.Control
            type="text"
            name="specialization"
            value={doctorData.specialization} // Dopasowane do twoich danych
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Aktualizuj Lekarza
        </Button>
      </Form>
    </div>
  );
};

export default UpdateDoctor;