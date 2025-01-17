import axios from 'axios';
import { API_URL } from '../config';
import UserService from './UserService';

const apiURLDoctors = `${API_URL}/doctors`;

//Zwraca token zalogowanego użytkownika
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

const errorHandler = (error) => {
    if (error.response?.status === 401) {
      UserService.logout();
      window.location.href = '/login';
    }
    throw error;
};

const DoctorService = {
    viewAllDoctors: async () => {
        try {
          return await axios.get(`${apiURLDoctors}/view-all-doctors`, { headers: authHeader() });
        } catch (error) {
          return errorHandler(error);
        }
      },
    
      viewOneDoctor: async (id) => {
        try {
          return await axios.get(`${apiURLDoctors}/view-one-doctor/${id}`, { headers: authHeader() });
        } catch (error) {
          return errorHandler(error);
        }
      },
    
      addDoctor: async (doctorData) => {
        try {
          return await axios.post(`${apiURLDoctors}/add-doctor`, doctorData, { headers: authHeader() });
        } catch (error) {
          return errorHandler(error);
        }
      },
    
      updateDoctor: async (id, doctorData) => {
        try {
          return await axios.put(`${apiURLDoctors}/update-doctor/${id}`, doctorData, { headers: authHeader() });
        } catch (error) {
          return errorHandler(error);
        }
      },
    
      deleteDoctor: async (id) => {
        try {
          return await axios.delete(`${apiURLDoctors}/delete_doctor/${id}`, { headers: authHeader() });
        } catch (error) {
          return errorHandler(error);
        }
      }
};
  
export default DoctorService;