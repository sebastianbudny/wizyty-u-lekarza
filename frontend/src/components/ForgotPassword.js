import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import userService from '../services/userService';

const ForgotPassword = () => {
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await userService.forgotPassword(values.email);
      setStatus({
        type: 'success',
        message: 'Link do resetowania hasła został wysłany na podany adres email'
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Wystąpił błąd'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" className="form-title">
          Resetowanie hasła
        </Typography>

        {status.message && (
          <Alert severity={status.type} sx={{ mt: 2, width: '100%' }}>
            {status.message}
          </Alert>
        )}

        <Formik
          initialValues={{ email: '' }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={{ width: '100%', marginTop: '1rem' }}>
              <Field
                name="email"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Email"
                type="email"
                autoFocus
              />

              <Button
                className = "btn-primary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                Wyślij link resetujący
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link to="/login">
                  Powrót do logowania
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default ForgotPassword;