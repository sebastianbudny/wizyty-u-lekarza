import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { registerSchema } from '../utils/ValidationSchemas';
import UserService from '../services/UserService';

const Register = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: '', message: '' }); // Changed from error to status

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await UserService.register(values);
      setStatus({
        type: 'success',
        message: 'Pomyślnie zarejestrowano. Zaloguj się, aby kontynuować.'
      });
      
      //Automatyczne otwarcie maila w ethereal w nowej karcie
      if (response.data.previewUrl) {
        setTimeout(() => {
          window.open(response.data.previewUrl, '_blank');
        }, 3000);
      }

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Błąd rejestracji'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" className="form-title">
          Rejestracja
        </Typography>

        {status.message && (
          <Alert severity={status.type} sx={{ mt: 2, width: '100%' }}>
            {status.message}
          </Alert>
        )}

        <Formik
          initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form style={{ width: '100%', marginTop: '1rem' }}>
              <Field
                name="username"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Nazwa użytkownika"
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />

              <Field
                name="email"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Email"
                type="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <Field
                name="password"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Hasło"
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
                label="Powtórz hasło"
                type="password"
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />

              <Button
                className="btn-primary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                Zarejestruj się
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link to="/login">
                  Masz już konto? Zaloguj się
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Register;