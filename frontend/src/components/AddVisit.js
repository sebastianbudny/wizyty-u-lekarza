import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const AddVisit = () => {
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [patient, setPatient] = useState('');
  const [doctor, setDoctor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newVisit = {
      visitDate: moment(visitDate, 'YYYY.MM.DD').toISOString(),
      visitTime,
      purpose,
      patient,
      doctor,
    };

    axios.post('/api/visits', newVisit)
      .then(response => {
        console.log('Visit added:', response.data);
      })
      .catch(error => {
        console.error('There was an error adding the visit!', error);
      });
  };

  return (
    <div>
      <h2>Dodaj Wizytę</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="visitDate">Data wizyty</label>
          <input
            type="text"
            className="form-control"
            id="visitDate"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            placeholder="rrrr.mm.dd"
          />
        </div>
        <div className="form-group">
          <label htmlFor="visitTime">Godzina wizyty</label>
          <input
            type="text"
            className="form-control"
            id="visitTime"
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="purpose">Cel wizyty</label>
          <input
            type="text"
            className="form-control"
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="patient">Pacjent</label>
          <input
            type="text"
            className="form-control"
            id="patient"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="doctor">Lekarz</label>
          <input
            type="text"
            className="form-control"
            id="doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Dodaj Wizytę</button>
      </form>
    </div>
  );
};

export default AddVisit;
