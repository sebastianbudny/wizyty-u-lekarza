import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Nowe hasło i potwierdzenie hasła muszą być takie same');
      return;
    }
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (response.ok) {
        setSuccessMessage('Hasło zostało pomyślnie zmienione');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(`Błąd: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Wystąpił błąd podczas zmiany hasła');
    }
  };

  return (
    <Container>
      <h2>Zmień Hasło</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCurrentPassword">
          <Form.Label>Obecne Hasło</Form.Label>
          <Form.Control
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Wprowadź obecne hasło"
            required
          />
        </Form.Group>
        <Form.Group controlId="formNewPassword">
          <Form.Label>Nowe Hasło</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Wprowadź nowe hasło"
            required
          />
        </Form.Group>
        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Potwierdź Nowe Hasło</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Potwierdź nowe hasło"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Zmień Hasło
        </Button>
      </Form>
    </Container>
  );
};

export default ChangePassword;