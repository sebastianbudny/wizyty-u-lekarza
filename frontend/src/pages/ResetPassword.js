import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Link do resetowania hasła został wysłany na podany adres email');
        setEmail('');
        setErrorMessage('');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Wystąpił błąd podczas wysyłania linku do resetowania hasła');
    }
  };

  return (
    <Container>
      <h2>Resetowanie Hasła</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Wprowadź email"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Resetuj Hasło
        </Button>
      </Form>
    </Container>
  );
};

export default ResetPassword;