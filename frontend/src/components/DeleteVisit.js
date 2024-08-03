import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from '../axiosConfig';

const DeleteVisit = () => {
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);

  useEffect(() => {
    axios.get('/api/visits')
      .then(response => setVisits(response.data.data)) // Poprawione tutaj
      .catch(error => console.error('Error fetching visits:', error));
  }, []);

  const handleSelectChange = (e) => {
    setSelectedVisit(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.delete(`/api/visits/${selectedVisit}`)
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h2>Usuń Wizytę</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="selectVisit">
          <Form.Label>Wybierz Wizytę</Form.Label>
          <Form.Control as="select" value={selectedVisit} onChange={handleSelectChange}>
            <option value="">Wybierz...</option>
            {visits.map((visit) => (
              <option key={visit._id} value={visit._id}>
                {visit.visitDate} - {visit.visitTime} - {visit.patient}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          Usuń Wizytę
        </Button>
      </Form>
    </div>
  );
};

export default DeleteVisit;