import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Alert, Snackbar,
  CircularProgress, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle 
} from '@mui/material';
import AdminService from '../../services/AdminService';

const ManageRegistrars = () => {
  const [registrars, setRegistrars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ 
    open: false, 
    registrarId: null,
    isActive: null 
  });

  const fetchRegistrars = async () => {
    try {
      setLoading(true);
      const response = await AdminService.viewAllRegistrars();
      setRegistrars(response.data);
    } catch (error) {
      console.error('Error fetching registrars:', error);
      setAlert({
        open: true,
        message: 'Błąd podczas pobierania listy rejestratorów',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrars();
  }, []);

  const handleToggleBlockClick = (registrarId, isActive) => {
    setConfirmDialog({ 
      open: true, 
      registrarId, 
      isActive 
    });
  };

  const handleConfirmToggle = async () => {
    try {
      if (confirmDialog.isActive) {
        await AdminService.blockRegistrar(confirmDialog.registrarId);
      } else {
        await AdminService.unblockRegistrar(confirmDialog.registrarId);
      }
      
      setAlert({
        open: true,
        message: `Pomyślnie ${confirmDialog.isActive ? 'zablokowano' : 'odblokowano'} rejestratora`,
        type: 'success'
      });
      fetchRegistrars();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Wystąpił błąd podczas wykonywania operacji',
        type: 'error'
      });
    }
    setConfirmDialog({ open: false, registrarId: null, isActive: null });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Zarządzanie rejestratorami
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nazwa użytkownika</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrars.map((registrar) => (
              <TableRow key={registrar._id}>
                <TableCell>{registrar.username}</TableCell>
                <TableCell>{registrar.email}</TableCell>
                <TableCell>{registrar.isActive ? 'Aktywny' : 'Zablokowany'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={registrar.isActive ? "error" : "primary"}
                    onClick={() => handleToggleBlockClick(registrar._id, registrar.isActive)}
                  >
                    {registrar.isActive ? 'Zablokuj' : 'Odblokuj'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, registrarId: null, isActive: null })}
      >
        <DialogTitle>Potwierdź operację</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.isActive 
              ? 'Czy na pewno chcesz zablokować to konto?' 
              : 'Czy na pewno chcesz odblokować to konto?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ open: false, registrarId: null, isActive: null })}
          >
            Anuluj
          </Button>
          <Button 
            onClick={handleConfirmToggle} 
            color={confirmDialog.isActive ? "error" : "primary"}
          >
            {confirmDialog.isActive ? 'Zablokuj' : 'Odblokuj'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default ManageRegistrars;