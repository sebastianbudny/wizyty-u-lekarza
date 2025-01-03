// filepath: frontend/src/components/ChangePasswordForm.js
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('Nowe hasła nie są zgodne');
      return;
    }
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
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
        <Form.Group controlId="formOldPassword">
          <Form.Label>Stare Hasło</Form.Label>
          <Form.Control
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Wprowadź stare hasło"
          />
        </Form.Group>
        <Form.Group controlId="formNewPassword">
          <Form.Label>Nowe Hasło</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Wprowadź nowe hasło"
          />
        </Form.Group>
        <Form.Group controlId="formConfirmNewPassword">
          <Form.Label>Potwierdź Nowe Hasło</Form.Label>
          <Form.Control
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Potwierdź nowe hasło"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Zmień Hasło
        </Button>
      </Form>
    </Container>
  );
};

export default ChangePasswordForm;