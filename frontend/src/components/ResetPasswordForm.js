// filepath: frontend/src/components/ResetPasswordForm.js
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');

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
      alert(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Wprowadź email"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Resetuj Hasło
        </Button>
      </Form>
    </Container>
  );
};

export default ResetPasswordForm;