import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Alert, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select 
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import pl from 'date-fns/locale/pl';
import moment from 'moment';
import VisitService from '../../../services/VisitService';
import DoctorService from '../../../services/DoctorService';

const validHours = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

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
      const formattedValues = {
        ...values,
        visitDate: values.visitDate ? moment(values.visitDate).format('YYYY-MM-DD') : null
      };

      await VisitService.addVisit(formattedValues);
      setStatus({
        type: 'success',
        message: 'Pomyślnie dodano wizytę'
      });
      setTimeout(() => navigate('/registrar-dashboard'), 2000);
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
              visitTime: '',
              idDoctor: '',
              patient: '',
              purpose: ''
            }}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <FormControl fullWidth margin="normal">
                  <DatePicker
                    label="Data wizyty"
                    value={values.visitDate}
                    onChange={(date) => setFieldValue('visitDate', date)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth
                        required
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            width: '100%' 
                          }
                        }}
                      />
                    )}
                  />
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="time-label">Godzina wizyty</InputLabel>
                  <Select
                    labelId="time-label"
                    value={values.visitTime}
                    label="Godzina wizyty"
                    onChange={(e) => setFieldValue('visitTime', e.target.value)}
                    required
                    sx={{ textAlign: 'left', '& .MuiSelect-select': { textAlign: 'left' } }}
                  >
                    {validHours.map((hour) => (
                      <MenuItem key={hour} value={hour}>
                        {hour}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="doctor-label">Lekarz</InputLabel>
                  <Select
                    labelId="doctor-label"
                    value={values.doctor}
                    label="Lekarz"
                    onChange={(e) => setFieldValue('idDoctor', e.target.value)}
                    required
                    sx={{ textAlign: 'left', '& .MuiSelect-select': { textAlign: 'left' } }}
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor._id} value={doctor._id}>
                        {doctor.doctorName} - {doctor.specialization}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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