import axios from 'axios';
import { API_URL } from '../config';

const apiURLAdmins = `${API_URL}/users`;

//Zwraca token zalogowanego użytkownika
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const AdminService = {
    viewAllRegistrars: async () => {
        return axios.get(`${apiURLAdmins}/view-all-registrars`, {
            headers: authHeader()
        });
    },

    viewOneRegistrar: async (id) => {
        return axios.get(`${apiURLAdmins}/view-one-registrar/${id}`, {
            headers: authHeader()
        });
    },

    blockRegistrar: async (id) => {
        return axios.put(`${apiURLAdmins}/block-registrar/${id}`, {}, {
            headers: authHeader()
        });
    },

    unblockRegistrar: async (id) => {
        return axios.put(`${apiURLAdmins}/unblock-registrar/${id}`, {}, {
            headers: authHeader()
        });
    }
};

export default AdminService;