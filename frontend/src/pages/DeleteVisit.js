import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const DeleteVisit = () => {
  const [visits, setVisits] = useState([]);
  const [selectedVisitId, setSelectedVisitId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await fetch('/api/visits');
      const data = await response.json();
      setVisits(data.data || []);
    } catch (error) {
      console.error('Error fetching visits:', error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/visits/${selectedVisitId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSuccessMessage('Wizyta została pomyślnie usunięta');
        setSelectedVisitId('');
        fetchVisits(); // Refresh the list of visits
      } else {
        const errorData = await response.json();
        setErrorMessage(`Błąd: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting visit:', error);
      setErrorMessage('Wystąpił błąd podczas usuwania wizyty');
    }
  };

  return (
    <Container>
      <h2>Usuń Wizytę</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleDelete}>
        <Form.Group controlId="formVisitId">
          <Form.Label>Wybierz Wizytę</Form.Label>
          <Form.Control
            as="select"
            value={selectedVisitId}
            onChange={(e) => setSelectedVisitId(e.target.value)}
            required
          >
            <option value="">Wybierz wizytę</option>
            {visits.map((visit) => (
              <option key={visit._id} value={visit._id}>
                {new Date(visit.visitDate).toLocaleDateString()} - {visit.visitTime} - {visit.patient}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="danger" type="submit">
          Usuń Wizytę
        </Button>
      </Form>
    </Container>
  );
};

export default DeleteVisit;