import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Container, Typography, Box, Alert, MenuItem } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import pl from 'date-fns/locale/pl';
import VisitService from '../../../services/VisitService';
import DoctorService from '../../../services/DoctorService';

const AddVisit = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await DoctorService.viewAllDoctors();
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await VisitService.addVisit(values);
      setStatus({
        type: 'success',
        message: 'Pomyślnie dodano wizytę'
      });
      setTimeout(() => navigate('/visits'), 2000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Błąd dodawania wizyty'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Dodaj wizytę
          </Typography>

          {status.message && (
            <Alert severity={status.type} sx={{ mt: 2, width: '100%', mb: 2 }}>
              {status.message}
            </Alert>
          )}

          <Formik
            initialValues={{
              visitDate: null,
              visitTime: null,
              doctor: '',
              patient: '',
              purpose: ''
            }}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <DatePicker
                  label="Data wizyty"
                  value={values.visitDate}
                  onChange={(date) => setFieldValue('visitDate', date)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" required />
                  )}
                  minDate={new Date()}
                />
                
                <TimePicker
                  label="Godzina wizyty"
                  value={values.visitTime}
                  onChange={(time) => setFieldValue('visitTime', time)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" required />
                  )}
                />

                <Field
                  name="doctor"
                  as={TextField}
                  select
                  margin="normal"
                  required
                  fullWidth
                  label="Lekarz"
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor._id} value={doctor._id}>
                      {doctor.doctorName} - {doctor.specialization}
                    </MenuItem>
                  ))}
                </Field>

                <Field
                  name="patient"
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  label="Pacjent"
                />

                <Field
                  name="purpose"
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  label="Cel wizyty"
                  multiline
                  rows={4}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3 }}
                  disabled={isSubmitting}
                >
                  Dodaj wizytę
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default AddVisit;