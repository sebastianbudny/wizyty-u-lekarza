import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert 
} from '@mui/material';
import AdminService from '../../services/AdminService';

const AdminDashboard = () => {
  const [registrars, setRegistrars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrars = async () => {
      try {
        setLoading(true);
        const response = await AdminService.viewAllRegistrars();
        setRegistrars(response.data);
      } catch (error) {
        console.error('Error fetching registrars:', error);
        setError('Nie udało się pobrać listy rejestratorów');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrars();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Lista rejestratorów
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nazwa użytkownika</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrars.map((registrar) => (
              <TableRow key={registrar._id}>
                <TableCell>{registrar.username}</TableCell>
                <TableCell>{registrar.email}</TableCell>
                <TableCell>{registrar.isActive ? 'Aktywny' : 'Zablokowany'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminDashboard;