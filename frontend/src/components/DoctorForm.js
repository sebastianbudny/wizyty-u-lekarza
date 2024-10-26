import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

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

const DoctorForm = ({ onSubmit, initialData = {} }) => {
  const [doctor, setDoctor] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(doctor);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formDoctorName">
          <Form.Label>Imię i nazwisko</Form.Label>
          <Form.Control
            type="text"
            name="doctorName"
            value={doctor.doctorName || ''}
            onChange={handleChange}
            placeholder="Wprowadź imię i nazwisko"
          />
        </Form.Group>
        <Form.Group controlId="formDoctorSpecialization">
          <Form.Label>Specjalizacja</Form.Label>
          <Form.Control
            as="select"
            name="specialization"
            value={doctor.specialization || ''}
            onChange={handleChange}
          >
            <option value="">Wybierz specjalizację</option>
            {allowedSpecializations.map((specialization, index) => (
              <option key={index} value={specialization}>
                {specialization}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          Zapisz
        </Button>
      </Form>
    </Container>
  );
};

export default DoctorForm;