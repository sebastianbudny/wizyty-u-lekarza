import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow } from '@mui/material';
import VisitService from '../../services/VisitService';
import DoctorService from '../../services/DoctorService';

const RegistrarDashboard = () => {
  const [visits, setVisits] = useState([]);
  const [doctors, setDoctors] = useState({});

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await VisitService.viewAllVisits();
        setVisits(response.data);
        
        // Fetch doctor details for each visit
        const doctorsData = {};
        for (const visit of response.data) {
          if (visit.doctor && !doctorsData[visit.doctor]) {
            const doctorResponse = await DoctorService.viewOneDoctor(visit.doctor);
            doctorsData[visit.doctor] = doctorResponse.data;
          }
        }
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchVisits();
  }, []);

  const getDoctorInfo = (doctorId) => {
    const doctor = doctors[doctorId];
    return doctor ? `${doctor.doctorName} - ${doctor.specialization}` : 'Ładowanie...';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Lista wszystkich wizyt
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Godzina</TableCell>
              <TableCell>Pacjent</TableCell>
              <TableCell>Lekarz</TableCell>
              <TableCell>Cel wizyty</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit._id}>
                <TableCell>{new Date(visit.visitDate).toLocaleDateString()}</TableCell>
                <TableCell>{visit.visitTime}</TableCell>
                <TableCell>{visit.patient}</TableCell>
                <TableCell>{getDoctorInfo(visit.doctor)}</TableCell>
                <TableCell>{visit.purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RegistrarDashboard;