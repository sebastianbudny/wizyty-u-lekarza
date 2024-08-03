import React, { useEffect, useState } from 'react';
import { Table, Form, Row, Col } from 'react-bootstrap';
import axios from '../axiosConfig';
import moment from 'moment';

const Home = () => {
  const [visits, setVisits] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    time: '',
    doctor: '',
    patient: ''
  });

  useEffect(() => {
    axios.get('/api/visits')
      .then(response => {
        console.log(response.data.data); // Log response to verify
        setVisits(response.data.data); // Set visits from data array
      })
      .catch(error => console.error('Error fetching visits:', error));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const filteredVisits = Array.isArray(visits) ? visits.filter(visit => {
    const formattedDate = moment(visit.visitDate).format('YYYY.MM.DD');
    return (
      (filters.date === '' || formattedDate.includes(filters.date)) &&
      (filters.time === '' || visit.visitTime.includes(filters.time)) &&
      (filters.doctor === '' || visit.doctor.includes(filters.doctor)) &&
      (filters.patient === '' || visit.patient.includes(filters.patient))
    );
  }) : [];

  return (
    <div>
      <h2>Wszystkie Wizyty</h2>
      <Form>
        <Row>
          <Col>
            <Form.Group controlId="filterDate">
              <Form.Label>Data wizyty</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="filterTime">
              <Form.Label>Godzina wizyty</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={filters.time}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="filterDoctor">
              <Form.Label>Lekarz</Form.Label>
              <Form.Control
                type="text"
                name="doctor"
                value={filters.doctor}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="filterPatient">
              <Form.Label>Pacjent</Form.Label>
              <Form.Control
                type="text"
                name="patient"
                value={filters.patient}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Data wizyty</th>
            <th>Godzina wizyty</th>
            <th>Cel wizyty</th>
            <th>Pacjent</th>
            <th>Lekarz</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisits.map((visit, index) => (
            <tr key={index}>
              <td>{moment(visit.visitDate).format('YYYY.MM.DD')}</td>
              <td>{visit.visitTime}</td>
              <td>{visit.purpose}</td>
              <td>{visit.patient}</td>
              <td>{visit.doctor}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Home;
