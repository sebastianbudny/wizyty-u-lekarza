import axios from 'axios';
import { API_URL } from '../config';

const apiURLVisits = `${API_URL}/visits`;

// zwraca token zalogowanego użytkownika
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

const VisitService = {
  viewAllVisits: async () => {
    return axios.get(`${apiURLVisits}/view-all-visits`, { headers: authHeader() });
  },
  
  viewOneVisit: async (id) => {
    return axios.get(`${apiURLVisits}/view-one-visit/${id}`, { headers: authHeader() });
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