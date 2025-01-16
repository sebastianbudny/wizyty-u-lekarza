import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import DoctorService from '../../../services/DoctorService';

const AddDoctor = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await DoctorService.addDoctor(values);
      setStatus({
        type: 'success',
        message: 'Pomyślnie dodano lekarza'
      });
      setTimeout(() => navigate('/doctors'), 2000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Błąd dodawania lekarza'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Dodaj lekarza
        </Typography>

        {status.message && (
          <Alert severity={status.type} sx={{ mt: 2, width: '100%', mb: 2 }}>
            {status.message}
          </Alert>
        )}

        <Formik
          initialValues={{ doctorName: '', specialization: '' }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <Field
                name="doctorName"
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={isSubmitting}
              >
                Dodaj lekarza
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default AddDoctor;