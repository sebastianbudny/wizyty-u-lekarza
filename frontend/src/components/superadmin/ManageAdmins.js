import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Alert, Snackbar,
  CircularProgress, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle 
} from '@mui/material';
import SuperAdminService from '../../services/SuperAdminService';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ 
    open: false, 
    adminId: null,
    isActive: null 
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await SuperAdminService.viewAllAdmins();
      setAdmins(response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: 'Błąd podczas pobierania listy administratorów',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleToggleBlockClick = (adminId, isActive) => {
    setConfirmDialog({ open: true, adminId, isActive });
  };

  const handleConfirmToggle = async () => {
    try {
      if (confirmDialog.isActive) {
        await SuperAdminService.blockAdmin(confirmDialog.adminId);
      } else {
        await SuperAdminService.unblockAdmin(confirmDialog.adminId);
      }
      
      setAlert({
        open: true,
        message: `Pomyślnie ${confirmDialog.isActive ? 'zablokowano' : 'odblokowano'} administratora`,
        type: 'success'
      });
      fetchAdmins();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Wystąpił błąd podczas wykonywania operacji',
        type: 'error'
      });
    }
    setConfirmDialog({ open: false, adminId: null, isActive: null });
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
        Zarządzanie administratorami
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
            {admins.map((admin) => (
              <TableRow key={admin._id}>
                <TableCell>{admin.username}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.isActive ? 'Aktywny' : 'Zablokowany'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={admin.isActive ? "error" : "primary"}
                    onClick={() => handleToggleBlockClick(admin._id, admin.isActive)}
                  >
                    {admin.isActive ? 'Zablokuj' : 'Odblokuj'}
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
        onClose={() => setConfirmDialog({ open: false, adminId: null, isActive: null })}
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
          <Button onClick={() => setConfirmDialog({ open: false, adminId: null, isActive: null })}>
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

export default ManageAdmins;