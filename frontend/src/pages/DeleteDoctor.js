import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const DeleteDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');
      const data = await response.json();
      setDoctors(data.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/doctors/${selectedDoctorId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSuccessMessage('Lekarz został pomyślnie usunięty');
        setSelectedDoctorId('');
        fetchDoctors(); // Refresh the list of doctors
      } else {
        const errorData = await response.json();
        setErrorMessage(`Błąd: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setErrorMessage('Wystąpił błąd podczas usuwania lekarza');
    }
  };

  return (
    <Container>
      <h2>Usuń Lekarza</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleDelete}>
        <Form.Group controlId="formDoctorId">
          <Form.Label>Wybierz Lekarza</Form.Label>
          <Form.Control
            as="select"
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
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
        <Button variant="danger" type="submit">
          Usuń Lekarza
        </Button>
      </Form>
    </Container>
  );
};

export default DeleteDoctor;