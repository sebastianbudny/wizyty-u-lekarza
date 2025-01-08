import React, { useState, useEffect } from 'react';
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

const UpdateDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');
      const data = await response.json();
      setDoctors(data.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleDoctorSelect = (doctorId) => {
    const doctor = doctors.find(d => d._id === doctorId);
    setSelectedDoctorId(doctorId);
    setDoctorName(doctor.doctorName);
    setSpecialization(doctor.specialization);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/doctors/${selectedDoctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorName, specialization }),
      });
      if (response.ok) {
        setSuccessMessage('Dane lekarza zostały pomyślnie zaktualizowane');
        fetchDoctors(); // Refresh the list of doctors
      } else {
        const errorData = await response.json();
        setErrorMessage(`Błąd: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      setErrorMessage('Wystąpił błąd podczas aktualizacji danych lekarza');
    }
  };

  return (
    <Container>
      <h2>Aktualizacja Danych Lekarza</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleUpdate}>
        <Form.Group controlId="formDoctorId">
          <Form.Label>Wybierz Lekarza</Form.Label>
          <Form.Control
            as="select"
            value={selectedDoctorId}
            onChange={(e) => handleDoctorSelect(e.target.value)}
            required
          >
            <option value="">Wybierz lekarza</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.doctorName}, Spec: {doctor.specialization}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
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
          Zaktualizuj Dane Lekarza
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateDoctor;