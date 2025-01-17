import axios from 'axios';
import { API_URL } from '../config';

const apiURLUsers = `${API_URL}/users`;

const UserService = {
  login: async (credentials) => {
    const response = await axios.post(`${apiURLUsers}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  },

  setupToken: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      return true;
    }
    return false;
  },

  register: async (userData) => {
    return axios.post(`${apiURLUsers}/register`, userData);
  },

  forgotPassword: async (email) => {
    return axios.post(`${apiURLUsers}/forgot-password`, { email });
  },

  resetPassword: async (token, password) => {
    return axios.post(`${apiURLUsers}/reset-password/${token}`, { password });
  },

  requestAdmin: async (values) => {
    return axios.post(`${apiURLUsers}/request-admin`, values);
  }
};

export default UserService;