import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Container, Typography, Box, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DoctorService from '../../../services/DoctorService';

export const allowedSpecializations = [
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
  "Transfuzjologia kliniczna", "Transplantologia kliniczna", "Urologia", "Urologia dziecięca", "Zdrowie publiczne"];

const AddDoctor = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await DoctorService.addDoctor(values);
      setStatus({
        type: 'success',
        message: 'Pomyślnie dodano lekarza'
      });
      setTimeout(() => navigate('/doctors'), 2000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Błąd dodawania lekarza'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Dodaj lekarza
        </Typography>

        {status.message && (
          <Alert severity={status.type} sx={{ mt: 2, width: '100%', mb: 2 }}>
            {status.message}
          </Alert>
        )}

        <Formik
          initialValues={{ doctorName: '', specialization: '' }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form style={{ width: '100%' }}>
              <Field
                name="doctorName"
                as={TextField}
                margin="normal"
                required
                fullWidth
                label="Imię i Nazwisko"
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="specialization-label">Specjalizacja</InputLabel>
                <Select
                  labelId="specialization-label"
                  value={values.specialization}
                  label="Specjalizacja"
                  onChange={(e) => setFieldValue('specialization', e.target.value)}
                  required
                  sx={{ textAlign: 'left', '& .MuiSelect-select': { textAlign: 'left' } }}
                >
                  {allowedSpecializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={isSubmitting}
              >
                Dodaj lekarza
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default AddDoctor;