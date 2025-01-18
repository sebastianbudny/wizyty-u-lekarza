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

const SuperAdminService = {
    approveAdminRequest: async (id) => {
        try {
            return await axios.post(`${apiURLAdmins}/admin-request-approve/${id}`, {}, { headers: authHeader() });
        } catch (error) {
            return errorHandler(error);
        }
    },

    viewAllAdminRequests: async () => {
        try {
          return await axios.get(`${apiURLAdmins}/view-all-admin-requests`, { headers: authHeader() });
        } catch (error) {
          return errorHandler(error);
        }
    },
    
    viewOneAdminRequest: async (id) => {
        try {
          return await axios.get(`${apiURLAdmins}/view-one-admin-request/${id}`, { headers: authHeader() });
        } catch (error) {
          return errorHandler(error);
        }
    },

    viewAllAdmins: async () => {
        try {
          return await axios.get(`${apiURLAdmins}/view-all-admins`, { headers: authHeader() });
        } catch (error) {
          return errorHandler(error);
        }
    },
    
    viewOneAdmin: async (id) => {
        try {
          return await axios.get(`${apiURLAdmins}/view-one-admin/${id}`, { headers: authHeader() });
        } catch (error) {
          return errorHandler(error);
        }
    },
    
    blockAdmin: async (id) => {
        try {
            return await axios.put(`${apiURLAdmins}/block-admin/${id}`, {}, { headers: authHeader() });
        } catch (error) {
            return errorHandler(error);
        }
    },

    unblockAdmin: async (id) => {
        try {
            return await axios.put(`${apiURLAdmins}/unblock-admin/${id}`, {}, { headers: authHeader() });
        } catch (error) {
            return errorHandler(error);
        }
    },
};

export default SuperAdminService;