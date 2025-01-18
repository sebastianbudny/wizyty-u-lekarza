import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import UserService from '../services/UserService';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      const response = await UserService.login({
        emailOrUsername: values.emailOrUsername,
        password: values.password
      });
      
      const user = response.data;
      
      switch (user.role) {
        case 'registrar':
          navigate('/registrar-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'superadmin':
          navigate('/superadmin-dashboard');
          break;
        default:
          setError('Brak uprawnień do systemu');
          setTimeout(() => setError(''), 10000);
          UserService.logout();
          break;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Błąd logowania');
      setTimeout(() => setError(''), 10000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" className="form-title">
          Logowanie
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ emailOrUsername: '', password: '' }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={{ width: '100%', marginTop: '1rem' }}>
              <Field
                name="emailOrUsername"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Email lub nazwa użytkownika"
                autoFocus
              />
              
              <Field
                name="password"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Hasło"
                type="password"
              />

              <Button
                className = "btn-primary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                Zaloguj się
              </Button>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/register">
                  Zarejestruj się
                </Link>
                <Link to="/forgot-password">
                  Zapomniał*ś hasła?
                </Link>
              </Box>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link to="/request-admin">
                  Złóż wniosek o uprawnienia administratora
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;