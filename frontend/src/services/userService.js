import axios from 'axios';

const API_URL = 'http://localhost:5555/api/users';

const userService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    return axios.post(`${API_URL}/register`, userData);
  },

  forgotPassword: async (email) => {
    return axios.post(`${API_URL}/forgot-password`, { email });
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  requestAdmin: async (values) => {
    return axios.post(`${API_URL}/request-admin`, values);
  }
};

export default userService;