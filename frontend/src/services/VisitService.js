import axios from 'axios';
import { API_URL } from '../config';
import UserService from './UserService';

const apiURLVisits = `${API_URL}/visits`;

// zwraca token zalogowanego użytkownika
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

const VisitService = {
  viewAllVisits: async () => {
    try {
      return await axios.get(`${apiURLVisits}/view-all-visits`, { headers: authHeader() });
    } catch (error) {
      return errorHandler(error);
    }
  },

  viewOneVisit: async (id) => {
    try {
      return await axios.get(`${apiURLVisits}/view-one-visit/${id}`, { headers: authHeader() });
    } catch (error) {
      return errorHandler(error);
    }
  },

  addVisit: async (visitData) => {
    try {
      return await axios.post(`${apiURLVisits}/add-visit`, visitData, { headers: authHeader() });
    } catch (error) {
      return errorHandler(error);
    }
  },

  updateVisit: async (id, visitData) => {
    try {
      return await axios.put(`${apiURLVisits}/update-visit/${id}`, visitData, { headers: authHeader() });
    } catch (error) {
      return errorHandler(error);
    }
  },

  deleteVisit: async (id) => {
    try {
      return await axios.delete(`${apiURLVisits}/delete-visit/${id}`, { headers: authHeader() });
    } catch (error) {
      return errorHandler(error);
    }
  }
};

export default VisitService;