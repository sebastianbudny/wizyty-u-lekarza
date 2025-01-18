import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Alert, Snackbar,
  CircularProgress, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle 
} from '@mui/material';
import SuperAdminService from '../../services/SuperAdminService';

const ManageAdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ 
    open: false, 
    requestId: null 
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await SuperAdminService.viewAllAdminRequests();
      setRequests(response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: 'Błąd podczas pobierania wniosków',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveClick = (requestId) => {
    setConfirmDialog({ open: true, requestId });
  };

  const handleConfirmApprove = async () => {
    try {
      const response = await SuperAdminService.approveAdminRequest(confirmDialog.requestId);
      setAlert({
        open: true,
        message: 'Pomyślnie zatwierdzono wniosek',
        type: 'success'
      });
      fetchRequests();

      if (response.data.previewUrl) {
        setTimeout(() => {
          window.open(response.data.previewUrl, '_blank');
        }, 3000);
      }

    } catch (error) {
      setAlert({
        open: true,
        message: 'Wystąpił błąd podczas zatwierdzania wniosku',
        type: 'error'
      });
    }
    setConfirmDialog({ open: false, requestId: null });
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
        Wnioski o uprawnienia administratora
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nazwa użytkownika</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Powód</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request.username}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>{request.reasonForAdmin}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleApproveClick(request._id)}
                  >
                    Zaakceptuj
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
        onClose={() => setConfirmDialog({ open: false, requestId: null })}
      >
        <DialogTitle>Potwierdź operację</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz zatwierdzić ten wniosek o uprawnienia administratora?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, requestId: null })}>
            Anuluj
          </Button>
          <Button onClick={handleConfirmApprove} color="primary">
            Zatwierdź
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

export default ManageAdminRequests;