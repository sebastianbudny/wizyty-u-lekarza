import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, Grid, TextField, 
  Button, DialogActions, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { Formik, Form } from 'formik';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import pl from 'date-fns/locale/pl';
import moment from 'moment';

const validHours = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

const UpdateVisit = ({ open, onClose, visit, doctors, onUpdate }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Aktualizacja wizyty</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Left side - current data */}
          <Grid item xs={6}>
            <h3>Aktualne dane:</h3>
            <p><strong>Data:</strong> {moment(visit?.visitDate).format('DD-MM-YYYY')}</p>
            <p><strong>Godzina:</strong> {visit?.visitTime}</p>
            <p><strong>Pacjent:</strong> {visit?.patient}</p>
            <p><strong>Lekarz:</strong> {doctors[visit?.doctor]?.doctorName} - {doctors[visit?.doctor]?.specialization}</p>
            <p><strong>Cel wizyty:</strong> {visit?.purpose}</p>
          </Grid>

          {/* Right side - update form */}
          <Grid item xs={6}>
            <h3>Nowe dane:</h3>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
              <Formik
                initialValues={{
                  visitDate: visit?.visitDate ? new Date(visit.visitDate) : null,
                  visitTime: visit?.visitTime || '',
                  idDoctor: visit?.doctor || '',
                  patient: visit?.patient || '',
                  purpose: visit?.purpose || ''
                }}
                onSubmit={(values) => {
                  const formattedValues = {
                    ...values,
                    visitDate: moment(values.visitDate).format('YYYY-MM-DD')
                  };
                  onUpdate(visit._id, formattedValues);
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <FormControl fullWidth margin="normal">
                      <DatePicker
                        label="Data wizyty"
                        value={values.visitDate}
                        onChange={(date) => setFieldValue('visitDate', date)}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth required />
                        )}
                      />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                      <InputLabel>Godzina wizyty</InputLabel>
                      <Select
                        value={values.visitTime}
                        label="Godzina wizyty"
                        onChange={(e) => setFieldValue('visitTime', e.target.value)}
                        required
                      >
                        {validHours.map((hour) => (
                          <MenuItem key={hour} value={hour}>
                            {hour}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                      <InputLabel>Lekarz</InputLabel>
                      <Select
                        value={values.idDoctor}
                        label="Lekarz"
                        onChange={(e) => setFieldValue('idDoctor', e.target.value)}
                        required
                      >
                        {Object.values(doctors).map((doctor) => (
                          <MenuItem key={doctor._id} value={doctor._id}>
                            {doctor.doctorName} - {doctor.specialization}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      margin="normal"
                      label="Pacjent"
                      value={values.patient}
                      onChange={(e) => setFieldValue('patient', e.target.value)}
                      required
                    />

                    <TextField
                      fullWidth
                      margin="normal"
                      label="Cel wizyty"
                      value={values.purpose}
                      onChange={(e) => setFieldValue('purpose', e.target.value)}
                      multiline
                      rows={4}
                      required
                    />

                    <DialogActions>
                      <Button onClick={onClose}>Anuluj</Button>
                      <Button type="submit" variant="contained" color="primary">
                        Zapisz zmiany
                      </Button>
                    </DialogActions>
                  </Form>
                )}
              </Formik>
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateVisit;