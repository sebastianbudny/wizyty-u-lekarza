import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const VisitForm = ({ onSubmit, initialData = {} }) => {
  const [visit, setVisit] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVisit({ ...visit, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(visit);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formVisitDate">
          <Form.Label>Data</Form.Label>
          <Form.Control
            type="date"
            name="visitDate"
            value={visit.visitDate || ''}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formVisitTime">
          <Form.Label>Godzina</Form.Label>
          <Form.Control
            type="time"
            name="visitTime"
            value={visit.visitTime || ''}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formVisitDoctor">
          <Form.Label>Lekarz</Form.Label>
          <Form.Control
            type="text"
            name="idDoctor"
            value={visit.idDoctor || ''}
            onChange={handleChange}
            placeholder="Wprowadź ID lekarza"
          />
        </Form.Group>
        <Form.Group controlId="formVisitPurpose">
          <Form.Label>Cel wizyty</Form.Label>
          <Form.Control
            type="text"
            name="purpose"
            value={visit.purpose || ''}
            onChange={handleChange}
            placeholder="Wprowadź cel wizyty"
          />
        </Form.Group>
        <Form.Group controlId="formVisitPatient">
          <Form.Label>Pacjent</Form.Label>
          <Form.Control
            type="text"
            name="patient"
            value={visit.patient || ''}
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

export default VisitForm;