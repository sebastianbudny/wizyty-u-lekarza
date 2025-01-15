import axios from 'axios';
import { API_URL } from '../config.js';

const apiURLVisits = `${API_URL}/visits`;

// zwraca token zalogowanego użytkownika
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

const VisitService = {
  getAllVisits: async () => {
    return axios.get(`${apiURLVisits}/all-visits`, { headers: authHeader() });
  },
  
  getVisit: async (id) => {
    return axios.get(`${apiURLVisits}/view-visit/${id}`, { headers: authHeader() });
  },

  addVisit: async (visitData) => {
    return axios.post(`${apiURLVisits}/add-visit`, visitData, { headers: authHeader() });
  },

  updateVisit: async (id, visitData) => {
    return axios.put(`${apiURLVisits}/update-visit/${id}`, visitData, { headers: authHeader() });
  },

  deleteVisit: async (id) => {
    return axios.delete(`${apiURLVisits}/delete-visit/${id}`, { headers: authHeader() });
  }
};

export default VisitService;