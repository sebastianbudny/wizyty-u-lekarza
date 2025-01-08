import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

// Godziny zdefiniowane w visitModel.js
const validHours = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

const UpdateVisit = () => {
  const [visits, setVisits] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [updatedVisit, setUpdatedVisit] = useState({
    visitDate: '',
    visitTime: '',
    purpose: '',
    patient: '',
    doctor: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchVisits();
    fetchDoctors();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await fetch('/api/visits');
      const data = await response.json();
      if (Array.isArray(data.data)) {
        const sortedVisits = data.data.sort((a, b) => {
          const dateA = new Date(`${a.visitDate}T${a.visitTime}`);
          const dateB = new Date(`${b.visitDate}T${b.visitTime}`);
          return dateB - dateA;
        });
        setVisits(sortedVisits);
      } else {
        setVisits([]);
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
      setVisits([]);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');
      const data = await response.json();
      const doctorsMap = {};
      data.data.forEach((doctor) => {
        doctorsMap[doctor._id] = doctor;
      });
      setDoctors(doctorsMap);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors({});
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/visits/${selectedVisit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVisit),
      });
      if (response.ok) {
        setSuccessMessage('Wizyta została pomyślnie zaktualizowana');
        fetchVisits(); // Refresh the visits list
      } else {
        const errorData = await response.json();
        alert(`Błąd: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating visit:', error);
      alert('Wystąpił błąd podczas aktualizacji wizyty');
    }
  };

  const handleVisitSelect = (visitId) => {
    const visit = visits.find(v => v._id === visitId);
    setSelectedVisit(visit);
    setUpdatedVisit({
      visitDate: visit.visitDate,
      visitTime: visit.visitTime,
      purpose: visit.purpose,
      patient: visit.patient,
      doctor: visit.doctor
    });
  };

  return (
    <Container>
      <h2>Aktualizacja Wizyty</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form>
        <Form.Group controlId="formVisitId">
          <Form.Label>Wybierz Wizytę</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => handleVisitSelect(e.target.value)}
            required
          >
            <option value="">Wybierz wizytę</option>
            {visits.map((visit) => {
              const doctor = doctors[visit.doctor];
              return (
                <option key={visit._id} value={visit._id}>
                  {new Date(visit.visitDate).toLocaleDateString()} - {visit.visitTime} - {doctor ? `${doctor.doctorName}, Spec: ${doctor.specialization}` : 'Ładowanie...'}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
        {selectedVisit && (
          <Row>
            <Col>
              <h3>Aktualne Dane</h3>
              <Form.Group controlId="formCurrentVisitDate">
                <Form.Label>Data Wizyty</Form.Label>
                <Form.Control type="text" value={new Date(selectedVisit.visitDate).toLocaleDateString()} readOnly />
              </Form.Group>
              <Form.Group controlId="formCurrentVisitTime">
                <Form.Label>Godzina Wizyty</Form.Label>
                <Form.Control type="text" value={selectedVisit.visitTime} readOnly />
              </Form.Group>
              <Form.Group controlId="formCurrentVisitPurpose">
                <Form.Label>Cel Wizyty</Form.Label>
                <Form.Control type="text" value={selectedVisit.purpose} readOnly />
              </Form.Group>
              <Form.Group controlId="formCurrentPatient">
                <Form.Label>Pacjent</Form.Label>
                <Form.Control type="text" value={selectedVisit.patient} readOnly />
              </Form.Group>
              <Form.Group controlId="formCurrentDoctor">
                <Form.Label>Lekarz</Form.Label>
                <Form.Control type="text" value={doctors[selectedVisit.doctor] ? `${doctors[selectedVisit.doctor].doctorName}, Spec: ${doctors[selectedVisit.doctor].specialization}` : 'Ładowanie...'} readOnly />
              </Form.Group>
            </Col>
            <Col>
              <h3>Nowe Dane</h3>
              <Form onSubmit={handleUpdate}>
                <Form.Group controlId="formVisitDate">
                  <Form.Label>Data Wizyty</Form.Label>
                  <Form.Control
                    type="date"
                    value={updatedVisit.visitDate}
                    onChange={(e) => setUpdatedVisit({ ...updatedVisit, visitDate: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formVisitTime">
                  <Form.Label>Godzina Wizyty</Form.Label>
                  <Form.Control
                    as="select"
                    value={updatedVisit.visitTime}
                    onChange={(e) => setUpdatedVisit({ ...updatedVisit, visitTime: e.target.value })}
                    required
                  >
                    <option value="">Wybierz godzinę</option>
                    {validHours.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formVisitPurpose">
                  <Form.Label>Cel Wizyty</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedVisit.purpose}
                    onChange={(e) => setUpdatedVisit({ ...updatedVisit, purpose: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPatient">
                  <Form.Label>Pacjent</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedVisit.patient}
                    onChange={(e) => setUpdatedVisit({ ...updatedVisit, patient: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formDoctor">
                  <Form.Label>Lekarz</Form.Label>
                  <Form.Control
                    as="select"
                    value={updatedVisit.doctor}
                    onChange={(e) => setUpdatedVisit({ ...updatedVisit, doctor: e.target.value })}
                    required
                  >
                    <option value="">Wybierz lekarza</option>
                    {Object.values(doctors).map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.doctorName}, Spec: {doctor.specialization}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Zaktualizuj Wizytę
                </Button>
              </Form>
            </Col>
          </Row>
        )}
      </Form>
    </Container>
  );
};

export default UpdateVisit;