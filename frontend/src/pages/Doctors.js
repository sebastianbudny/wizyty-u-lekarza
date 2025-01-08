import React, { useState, useEffect } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
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
      setErrorMessage('Wystąpił błąd podczas pobierania listy lekarzy');
    }
  };

  return (
    <Container>
      <h2>Lista Lekarzy</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Imię i Nazwisko</th>
            <th>Specjalizacja</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id}>
              <td>{doctor.doctorName}</td>
              <td>{doctor.specialization}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Doctors;