import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import DoctorService from '../../../services/DoctorService.js';

const UpdateDoctor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await DoctorService.getDoctor(id);
        setDoctor(response.data);
      } catch (error) {
        setStatus({
          type: 'error',
          message: 'Nie udało się pobrać danych lekarza'
        });
      }
    };
    fetchDoctor();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await userService.updateDoctor(id, values);
      setStatus({
        type: 'success',
        message: 'Pomyślnie zaktualizowano dane lekarza'
      });
      setTimeout(() => navigate('/doctors'), 2000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Błąd aktualizacji danych'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!doctor) {
    return <Alert severity="info">Ładowanie danych...</Alert>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Aktualizuj dane lekarza
        </Typography>

        {status.message && (
          <Alert severity={status.type} sx={{ mt: 2, width: '100%', mb: 2 }}>
            {status.message}
          </Alert>
        )}

        <Formik
          initialValues={{
            name: doctor.name,
            specialization: doctor.specialization,
            email: doctor.email,
            phone: doctor.phone
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <Field
                name="name"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Imię i Nazwisko"
              />
              <Field
                name="specialization"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Specjalizacja"
              />
              <Field
                name="email"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Email"
                type="email"
              />
              <Field
                name="phone"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Telefon"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={isSubmitting}
              >
                Aktualizuj dane
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default UpdateDoctor;