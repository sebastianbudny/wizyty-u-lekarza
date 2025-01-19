import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Box,
  Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, Alert, Snackbar 
} from '@mui/material';
import VisitService from '../../../services/VisitService';
import DoctorService from '../../../services/DoctorService';
import UpdateVisit from './UpdateVisit';

const ManageVisits = () => {
  const [visits, setVisits] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, visitId: null });
  const [updateDialog, setUpdateDialog] = useState({ open: false, visit: null });
  const [alert, setAlert] = useState({ open: false, message: '', type: 'success' });

  const fetchDoctors = async () => {
    try {
      const response = await DoctorService.viewAllDoctors();
      const doctorsMap = {};
      response.data.forEach(doctor => {
        doctorsMap[doctor._id] = doctor;
      });
      setDoctors(doctorsMap);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchVisits = async () => {
    try {
      const response = await VisitService.viewAllVisits();
      setVisits(response.data);
    } catch (error) {
      console.error('Error fetching visits:', error);
      setAlert({
        open: true,
        message: 'Błąd podczas pobierania listy wizyt',
        type: 'error'
      });
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchVisits();
  }, []);

  const handleDeleteClick = (visitId) => {
    setDeleteDialog({ open: true, visitId });
  };

  const handleUpdateClick = (visit) => {
    setUpdateDialog({ open: true, visit });
  };

  const handleDeleteConfirm = async () => {
    try {
      await VisitService.deleteVisit(deleteDialog.visitId);
      setAlert({
        open: true,
        message: 'Pomyślnie usunięto wizytę',
        type: 'success'
      });
      fetchVisits();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Błąd podczas usuwania wizyty',
        type: 'error'
      });
    }
    setDeleteDialog({ open: false, visitId: null });
  };

  const handleUpdateVisit = async (id, updatedData) => {
    try {
      await VisitService.updateVisit(id, updatedData);
      setAlert({
        open: true,
        message: 'Pomyślnie zaktualizowano wizytę',
        type: 'success'
      });
      fetchVisits();
      setUpdateDialog({ open: false, visit: null });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Błąd podczas aktualizacji wizyty',
        type: 'error'
      });
    }
  };

  const getDoctorInfo = (doctorId) => {
    const doctor = doctors[doctorId];
    return doctor ? `${doctor.doctorName} - ${doctor.specialization}` : 'Ładowanie...';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Zarządzanie wizytami
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Akcje</TableCell>
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
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleUpdateClick(visit)}
                    >
                      Aktualizuj
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      className = "delete-btn"
                      size="small"
                      onClick={() => handleDeleteClick(visit._id)}
                    >
                      Usuń
                    </Button>
                  </Box>
                </TableCell>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, visitId: null })}
      >
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć tę wizytę? Tej operacji nie można cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, visitId: null })}>
            Anuluj
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Usuń
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Visit Dialog */}
      <UpdateVisit
        open={updateDialog.open}
        visit={updateDialog.visit}
        doctors={doctors}
        onClose={() => setUpdateDialog({ open: false, visit: null })}
        onUpdate={handleUpdateVisit}
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

export default ManageVisits;