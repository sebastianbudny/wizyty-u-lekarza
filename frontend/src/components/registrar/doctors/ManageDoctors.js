import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Box,
  Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, Alert, Snackbar 
} from '@mui/material';
import DoctorService from '../../../services/DoctorService';
import UpdateDoctor from './UpdateDoctor';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, doctorId: null });
  const [updateDialog, setUpdateDialog] = useState({ open: false, doctor: null });
  const [alert, setAlert] = useState({ open: false, message: '', type: 'success' });

  const fetchDoctors = async () => {
    try {
      const response = await DoctorService.viewAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setAlert({
        open: true,
        message: 'Błąd podczas pobierania listy lekarzy',
        type: 'error'
      });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDeleteClick = (doctorId) => {
    setDeleteDialog({ open: true, doctorId });
  };

  const handleUpdateClick = (doctor) => {
    setUpdateDialog({ open: true, doctor });
  };

  const handleDeleteConfirm = async () => {
    try {
      await DoctorService.deleteDoctor(deleteDialog.doctorId);
      setAlert({
        open: true,
        message: 'Pomyślnie usunięto lekarza',
        type: 'success'
      });
      fetchDoctors();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Błąd podczas usuwania lekarza',
        type: 'error'
      });
    }
    setDeleteDialog({ open: false, doctorId: null });
  };

  const handleUpdateDoctor = async (id, updatedData) => {
    try {
      await DoctorService.updateDoctor(id, updatedData);
      setAlert({
        open: true,
        message: 'Pomyślnie zaktualizowano lekarza',
        type: 'success'
      });
      fetchDoctors();
      setUpdateDialog({ open: false, doctor: null });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Błąd podczas aktualizacji lekarza',
        type: 'error'
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Zarządzanie lekarzami
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Akcje</TableCell>
              <TableCell>Imię i Nazwisko</TableCell>
              <TableCell>Specjalizacja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleUpdateClick(doctor)}
                    >
                      Aktualizuj
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      className = "delete-btn"
                      size="small"
                      onClick={() => handleDeleteClick(doctor._id)}
                    >
                      Usuń
                    </Button>
                  </Box>
                </TableCell>
                <TableCell>{doctor.doctorName}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, doctorId: null })}
      >
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć tego lekarza? Tej operacji nie można cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, doctorId: null })}>
            Anuluj
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Usuń
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Doctor Dialog */}
      <UpdateDoctor
        open={updateDialog.open}
        doctor={updateDialog.doctor}
        onClose={() => setUpdateDialog({ open: false, doctor: null })}
        onUpdate={handleUpdateDoctor}
      />

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.type} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageDoctors;