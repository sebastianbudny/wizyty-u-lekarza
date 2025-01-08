import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserHome = ({ user }) => {
  const [visits, setVisits] = useState([]);
  const [doctors, setDoctors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'rejestrator') {
      fetchVisits();
      fetchDoctors();
    }
  }, [user, navigate]);

  const fetchVisits = async () => {
    try {
      const response = await fetch('/api/visits');
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setVisits(data.data);
      } else {
        setVisits([]);
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
      setVisits([]);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');
      const data = await response.json();
      const doctorsMap = {};
      data.data.forEach((doctor) => {
        doctorsMap[doctor._id] = doctor;
      });
      setDoctors(doctorsMap);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors({});
    }
  };

  if (!user) {
    return null; // Return null to avoid rendering anything before redirect
  }

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
            <th>Cel wizyty</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => {
            const doctor = doctors[visit.doctor];
            return (
              <tr key={visit._id}>
                <td>{new Date(visit.visitDate).toLocaleDateString()}</td>
                <td>{visit.visitTime}</td>
                <td>{doctor ? `${doctor.doctorName}, Spec: ${doctor.specialization}` : 'Ładowanie...'}</td>
                <td>{visit.patient}</td>
                <td>{visit.purpose}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserHome;