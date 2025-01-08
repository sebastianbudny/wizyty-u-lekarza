import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';

// Godziny zdefiniowane w visitModel.js
const validHours = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

const AddVisit = () => {
  const [idDoctor, setIdDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [patient, setPatient] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');
      const result = await response.json();
      setDoctors(result.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visitDate, visitTime, purpose, idDoctor, patient }),
      });
      if (response.ok) {
        setSuccessMessage('Wizyta została pomyślnie dodana');
        setIdDoctor('');
        setPatient('');
        setVisitDate('');
        setVisitTime('');
        setPurpose('');
      } else {
        const errorData = await response.json();
        alert(`Błąd: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Wystąpił błąd podczas dodawania wizyty');
    }
  };

  return (
    <Container>
      <h2>Dodaj Wizytę</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formDoctorId">
          <Form.Label>Wybierz Lekarza</Form.Label>
          <Form.Control
            as="select"
            value={idDoctor}
            onChange={(e) => setIdDoctor(e.target.value)}
            required
          >
            <option value="">Wybierz lekarza</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.doctorName}, Spec: {doctor.specialization}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formPatientName">
          <Form.Label>Imię i Nazwisko Pacjenta</Form.Label>
          <Form.Control
            type="text"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            placeholder="Wprowadź imię i nazwisko pacjenta"
            required
          />
        </Form.Group>
        <Form.Group controlId="formVisitDate">
          <Form.Label>Data Wizyty</Form.Label>
          <Form.Control
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formVisitTime">
          <Form.Label>Godzina Wizyty</Form.Label>
          <Form.Control
            as="select"
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
            required
          >
            <option value="">Wybierz godzinę</option>
            {validHours.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formVisitPurpose">
          <Form.Label>Cel Wizyty</Form.Label>
          <Form.Control
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Wprowadź cel wizyty"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Dodaj Wizytę
        </Button>
      </Form>
    </Container>
  );
};

export default AddVisit;