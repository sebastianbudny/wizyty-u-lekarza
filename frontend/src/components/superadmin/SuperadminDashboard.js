import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert 
} from '@mui/material';
import SuperAdminService from '../../services/SuperAdminService';

const SuperadminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await SuperAdminService.viewAllAdmins();
        setAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setError('Nie udało się pobrać listy administratorów');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
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
        Lista administratorów
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
            {admins.map((admin) => (
              <TableRow key={admin._id}>
                <TableCell>{admin.username}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.isActive ? 'Aktywny' : 'Zablokowany'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SuperadminDashboard;