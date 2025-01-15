import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow } from '@mui/material';
import VisitService from '../../../services/VisitService.js';

const VisitsList = () => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await VisitService.getAllVisits();
        setVisits(response.data);
      } catch (error) {
        console.error('Error fetching visits:', error);
      }
    };
    fetchVisits();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Lista wizyt
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
                <TableCell>{new Date(visit.date).toLocaleDateString()}</TableCell>
                <TableCell>{visit.time}</TableCell>
                <TableCell>{visit.patient}</TableCell>
                <TableCell>{visit.doctor}</TableCell>
                <TableCell>{visit.purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default VisitsList;