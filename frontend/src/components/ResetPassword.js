import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { resetPasswordSchema } from '../utils/ValidationSchemas.js';
import UserService from '../services/UserService.js';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await UserService.resetPassword(token, values.password);
      setStatus({
        type: 'success',
        message: 'Pomyślnie zresetowano hasło'
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Wystąpił błąd podczas resetowania hasła'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" className="form-title">
          Ustaw nowe hasło
        </Typography>

        {status.message && (
          <Alert severity={status.type} sx={{ mt: 2, width: '100%' }}>
            {status.message}
          </Alert>
        )}

        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={resetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form style={{ width: '100%', marginTop: '1rem' }}>
              <Field
                name="password"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Nowe hasło"
                type="password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <Field
                name="confirmPassword"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Potwierdź nowe hasło"
                type="password"
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                Zapisz nowe hasło
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default ResetPassword;