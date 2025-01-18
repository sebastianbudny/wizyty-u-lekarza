import axios from 'axios';
import { API_URL } from '../config';
import UserService from './UserService';

const apiURLAdmins = `${API_URL}/users`;

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

const AdminService = {
    viewAllRegistrars: async () => {
        try {
          return await axios.get(`${apiURLAdmins}/view-all-registrars`, { headers: authHeader() });
        } catch (error) {
          return errorHandler(error);
        }
    },
    
    viewOneRegistrar: async (id) => {
        try {
          return await axios.get(`${apiURLAdmins}/view-one-registrar/${id}`, { headers: authHeader() });
        } catch (error) {
          return errorHandler(error);
        }
    },
    
    blockRegistrar: async (id) => {
        try {
            return await axios.put(`${apiURLAdmins}/block-registrar/${id}`, {}, { headers: authHeader() });
        } catch (error) {
            return errorHandler(error);
        }
    },

     unblockRegistrar: async (id) => {
        try {
            return await axios.put(`${apiURLAdmins}/unblock-registrar/${id}`, {}, { headers: authHeader() });
        } catch (error) {
            return errorHandler(error);
        }
    },
};

export default AdminService;