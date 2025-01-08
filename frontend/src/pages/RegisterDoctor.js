import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const allowedSpecializations = [
  "Alergologia", "Anestezjologia i intensywna terapia", "Angiologia", "Audiologia i foniatria", "Balneologia i medycyna fizykalna", 
  "Chirurgia dziecięca", "Chirurgia klatki piersiowej", "Chirurgia naczyniowa", "Chirurgia ogólna", "Chirurgia onkologiczna", 
  "Chirurgia plastyczna", "Chirurgia szczękowo-twarzowa", "Choroby płuc", "Choroby płuc dzieci", "Choroby wewnętrzne", 
  "Choroby zakaźne", "Dermatologia i wenerologia", "Diabetologia", "Diagnostyka laboratoryjna", "Endokrynologia", 
  "Endokrynologia ginekologiczna i rozrodczość", "Endokrynologia i diabetologia dziecięca", "Epidemiologia", "Farmakologia kliniczna", 
  "Gastroenterologia", "Gastroenterologia dziecięca", "Genetyka kliniczna", "Geriatria", "Ginekologia onkologiczna", "Hematologia", 
  "Hipertensjologia", "Immunologia kliniczna", "Intensywna terapia", "Kardiochirurgia", "Kardiologia", "Kardiologia dziecięca", 
  "Medycyna lotnicza", "Medycyna morska i tropikalna", "Medycyna nuklearna", "Medycyna paliatywna", "Medycyna pracy", 
  "Medycyna ratunkowa", "Medycyna rodzinna", "Medycyna sądowa", "Medycyna sportowa", "Mikrobiologia lekarska", 
  "Nefrologia", "Nefrologia dziecięca", "Neonatologia", "Neurochirurgia", "Neurologia", "Neurologia dziecięca", 
  "Neuropatologia", "Okulistyka", "Onkologia i hematologia dziecięca", "Onkologia kliniczna", "Ortopedia i traumatologia narządu ruchu", 
  "Otorynolaryngologia", "Otorynolaryngologia dziecięca", "Patomorfologia", "Pediatria", "Pediatria metaboliczna", "Perinatologia", 
  "Położnictwo i ginekologia", "Psychiatria", "Psychiatria dzieci i młodzieży", "Radiologia i diagnostyka obrazowa", 
  "Radioterapia onkologiczna", "Rehabilitacja medyczna", "Reumatologia", "Seksuologia", "Toksykologia kliniczna", 
  "Transfuzjologia kliniczna", "Transplantologia kliniczna", "Urologia", "Urologia dziecięca", "Zdrowie publiczne"
];

const RegisterDoctor = () => {
  const [doctorName, setDoctorName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorName, specialization }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Lekarz został pomyślnie zarejestrowany');
        setDoctorName('');
        setSpecialization('');
        setErrorMessage('');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Wystąpił błąd podczas rejestracji lekarza');
    }
  };

  return (
    <Container>
      <h2>Rejestracja Lekarza</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formDoctorName">
          <Form.Label>Imię i Nazwisko Lekarza</Form.Label>
          <Form.Control
            type="text"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            placeholder="Wprowadź imię i nazwisko lekarza"
            required
          />
        </Form.Group>
        <Form.Group controlId="formSpecialization">
          <Form.Label>Specjalizacja</Form.Label>
          <Form.Control
            as="select"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          >
            <option value="">Wybierz specjalizację</option>
            {allowedSpecializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          Zarejestruj Lekarza
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterDoctor;