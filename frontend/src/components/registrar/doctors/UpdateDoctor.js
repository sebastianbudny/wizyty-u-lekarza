import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, Grid, TextField, 
  Button, DialogActions, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { Formik, Form } from 'formik';
import { allowedSpecializations } from './AddDoctor';

const UpdateDoctor = ({ open, onClose, doctor, onUpdate }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Aktualizacja danych lekarza</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Left side - current data */}
          <Grid item xs={6}>
            <h3>Aktualne dane:</h3>
            <p><strong>Imię i Nazwisko:</strong> {doctor?.doctorName}</p>
            <p><strong>Specjalizacja:</strong> {doctor?.specialization}</p>
          </Grid>

          {/* Right side - update form */}
          <Grid item xs={6}>
            <h3>Nowe dane:</h3>
            <Formik
              initialValues={{
                doctorName: doctor?.doctorName || '',
                specialization: doctor?.specialization || ''
              }}
              onSubmit={(values) => onUpdate(doctor._id, values)}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Imię i Nazwisko"
                    value={values.doctorName}
                    onChange={(e) => setFieldValue('doctorName', e.target.value)}
                  />

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Specjalizacja</InputLabel>
                    <Select
                      value={values.specialization}
                      label="Specjalizacja"
                      onChange={(e) => setFieldValue('specialization', e.target.value)}
                    >
                      {allowedSpecializations.map((spec) => (
                        <MenuItem key={spec} value={spec}>
                          {spec}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <DialogActions>
                    <Button onClick={onClose}>Anuluj</Button>
                    <Button type="submit" variant="contained" color="primary">
                      Zapisz zmiany
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDoctor;