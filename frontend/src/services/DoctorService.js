import axios from 'axios';
import { API_URL } from '../config';

const apiURLDoctors = `${API_URL}/doctors`;

//Zwraca token zalogowanego użytkownika
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

  const DoctorService = {
    viewAllDoctors: async () => {
      return axios.get(`${apiURLDoctors}/view-all-doctors`, {
        headers: authHeader()
      });
    },
  
    viewOneDoctor: async (id) => {
      return axios.get(`${apiURLDoctors}/view-one-doctor/${id}`, {
        headers: authHeader()
      });
    },
  
    addDoctor: async (doctorData) => {
      return axios.post(`${apiURLDoctors}/add-doctor`, doctorData, {
        headers: authHeader()
      });
    },
  
    updateDoctor: async (id, doctorData) => {
      return axios.put(`${apiURLDoctors}/update-doctor/${id}`, doctorData, {
        headers: authHeader()
      });
    },
  
    deleteDoctor: async (id) => {
      return axios.delete(`${apiURLDoctors}/delete_doctor/${id}`, {
        headers: authHeader()
      });
    }
  };
  
  export default DoctorService;