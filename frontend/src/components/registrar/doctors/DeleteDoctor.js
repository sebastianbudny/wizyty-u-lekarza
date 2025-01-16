import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, Button, Container, Alert } from '@mui/material';
import DoctorService from '../../../services/DoctorService';

const DeleteDoctor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleDelete = async () => {
    try {
      await DoctorService.deleteDoctor(id);
      setStatus({
        type: 'success',
        message: 'Pomyślnie usunięto lekarza'
      });
      setTimeout(() => navigate('/doctors'), 2000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Błąd usuwania lekarza'
      });
    }
  };

  return (
    <Container>
      {status.message && (
        <Alert severity={status.type} sx={{ mt: 2 }}>
          {status.message}
        </Alert>
      )}
      <Dialog open={open} onClose={() => navigate('/doctors')}>
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć tego lekarza? Tej operacji nie można cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/doctors')}>Anuluj</Button>
          <Button onClick={handleDelete} color="error">Usuń</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DeleteDoctor;