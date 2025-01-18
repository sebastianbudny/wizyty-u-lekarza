import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { requestAdminSchema } from '../utils/ValidationSchemas';
import UserService from '../services/UserService';

const RequestAdmin = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await UserService.requestAdmin(values);
      setStatus({
        type: 'success',
        message: 'Wniosek został wysłany. Po weryfikacji otrzymasz email z dalszymi instrukcjami.'
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
        message: err.response?.data?.message || 'Wystąpił błąd podczas wysyłania wniosku'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" className="form-title">
          Wniosek o uprawnienia administratora
        </Typography>

        {status.message && (
          <Alert severity={status.type} sx={{ mt: 2, width: '100%' }}>
            {status.message}
          </Alert>
        )}

        <Formik
          initialValues={{ username: '', email: '', reasonForAdmin: '' }}
          validationSchema={requestAdminSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={{ width: '100%', marginTop: '1rem' }}>
              <Field
                name="username"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Nazwa użytkownika"
                autoFocus
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
                name="reasonForAdmin"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Powód ubiegania się o uprawnienia administratora"
                multiline
                rows={4}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                Wyślij wniosek
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

export default RequestAdmin;