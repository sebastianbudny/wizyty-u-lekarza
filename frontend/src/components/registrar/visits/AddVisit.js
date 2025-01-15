import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Container, Typography, Box, Alert, MenuItem } from '@mui/material';
import VisitService from '../../../services/VisitService.js';
import DoctorService from '../../../services/DoctorService.js';

const AddVisit = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await DoctorService.getAllDoctors();
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await VisitService.addVisit(values);
      setStatus({
        type: 'success',
        message: 'Pomyślnie dodano wizytę'
      });
      setTimeout(() => navigate('/visits'), 2000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Błąd dodawania wizyty'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Dodaj wizytę
        </Typography>

        {status.message && (
          <Alert severity={status.type} sx={{ mt: 2, width: '100%', mb: 2 }}>
            {status.message}
          </Alert>
        )}

        <Formik
          initialValues={{
            date: '',
            time: '',
            patient: '',
            doctor: '',
            purpose: ''
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <Field
                name="date"
                as={TextField}
                type="date"
                margin="normal"
                required
                fullWidth
                label="Data wizyty"
                InputLabelProps={{ shrink: true }}
              />
              <Field
                name="time"
                as={TextField}
                type="time"
                margin="normal"
                required
                fullWidth
                label="Godzina wizyty"
                InputLabelProps={{ shrink: true }}
              />
              <Field
                name="patient"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Pacjent"
              />
              <Field
                name="doctor"
                as={TextField}
                select
                margin="normal"
                required
                fullWidth
                label="Lekarz"
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialization}
                  </MenuItem>
                ))}
              </Field>
              <Field
                name="purpose"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Cel wizyty"
                multiline
                rows={4}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={isSubmitting}
              >
                Dodaj wizytę
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default AddVisit;