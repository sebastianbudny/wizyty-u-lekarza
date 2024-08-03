import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from '../axiosConfig';
import moment from 'moment';

const UpdateVisit = () => {
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [visitData, setVisitData] = useState({
    visitDate: '',
    visitTime: '',
    patient: '',
    purpose: '',
    doctor: ''
  });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get('/api/visits')
      .then(response => setVisits(response.data.data))
      .catch(error => console.error('Error fetching visits:', error));

    axios.get('/api/doctors')
      .then(response => setDoctors(response.data.data))
      .catch(error => console.error('Error fetching doctors:', error));
  }, []);

  const handleVisitChange = (e) => {
    const visitId = e.target.value;
    const visit = visits.find(v => v._id === visitId);
    setSelectedVisit(visitId);
    setVisitData({
      ...visit,
      visitDate: moment(visit.visitDate).format('YYYY-MM-DD')
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVisitData({
      ...visitData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedVisitData = {
      ...visitData,
      visitDate: moment(visitData.visitDate, 'YYYY-MM-DD').format('YYYY.MM.DD')
    };
    axios.put(`/api/visits/${selectedVisit}`, updatedVisitData)
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h2>Aktualizuj Wizytę</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="selectVisit">
          <Form.Label>Wybierz Wizytę</Form.Label>
          <Form.Control as="select" value={selectedVisit} onChange={handleVisitChange}>
            <option value="">Wybierz...</option>
            {visits.map((visit) => (
              <option key={visit._id} value={visit._id}>
                {visit.patient} - {moment(visit.visitDate).format('YYYY-MM-DD')}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="visitDate">
          <Form.Label>Data Wizyty</Form.Label>
          <Form.Control
            type="date"
            name="visitDate"
            value={visitData.visitDate}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="visitTime">
          <Form.Label>Godzina Wizyty</Form.Label>
          <Form.Control
            type="time"
            name="visitTime"
            value={visitData.visitTime}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="patient">
          <Form.Label>Pacjent</Form.Label>
          <Form.Control
            type="text"
            name="patient"
            value={visitData.patient}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="purpose">
          <Form.Label>Cel Wizyty</Form.Label>
          <Form.Control
            type="text"
            name="purpose"
            value={visitData.purpose}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="doctor">
          <Form.Label>Lekarz</Form.Label>
          <Form.Control as="select" name="doctor" value={visitData.doctor} onChange={handleChange}>
            <option value="">Wybierz...</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.doctorName} - {doctor.specialization}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          Aktualizuj Wizytę
        </Button>
      </Form>
    </div>
  );
};

export default UpdateVisit;
