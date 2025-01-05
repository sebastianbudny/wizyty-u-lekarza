import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';

const Home = () => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await fetch('/api/visits');
      const data = await response.json();
      if (Array.isArray(data)) {
        setVisits(data);
      } else {
        setVisits([]);
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
      setVisits([]);
    }
  };

  return (
    <Container>
      <h2>Wszystkie Wizyty</h2>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Data</th>
            <th>Godzina</th>
            <th>Lekarz</th>
            <th>Pacjent</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit._id}>
              <td>{new Date(visit.visitDate).toLocaleDateString()}</td>
              <td>{visit.visitTime}</td>
              <td>{visit.doctor.doctorName}</td>
              <td>{visit.patient}</td>
              <td>{visit.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Home;