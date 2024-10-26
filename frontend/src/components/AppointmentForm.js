import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const AppointmentForm = ({ onSubmit, initialData = {} }) => {
  const [appointment, setAppointment] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment({ ...appointment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(appointment);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formAppointmentDate">
          <Form.Label>Data</Form.Label>
          <Form.Control
            type="date"
            name="visitDate"
            value={appointment.visitDate || ''}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formAppointmentTime">
          <Form.Label>Godzina</Form.Label>
          <Form.Control
            type="time"
            name="visitTime"
            value={appointment.visitTime || ''}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formAppointmentDoctor">
          <Form.Label>Lekarz</Form.Label>
          <Form.Control
            type="text"
            name="idDoctor"
            value={appointment.idDoctor || ''}
            onChange={handleChange}
            placeholder="Wprowadź ID lekarza"
          />
        </Form.Group>
        <Form.Group controlId="formAppointmentPurpose">
          <Form.Label>Cel wizyty</Form.Label>
          <Form.Control
            type="text"
            name="purpose"
            value={appointment.purpose || ''}
            onChange={handleChange}
            placeholder="Wprowadź cel wizyty"
          />
        </Form.Group>
        <Form.Group controlId="formAppointmentPatient">
          <Form.Label>Pacjent</Form.Label>
          <Form.Control
            type="text"
            name="patient"
            value={appointment.patient || ''}
            onChange={handleChange}
            placeholder="Wprowadź imię i nazwisko pacjenta"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Zapisz
        </Button>
      </Form>
    </Container>
  );
};

export default AppointmentForm;