import axios from 'axios';
import { API_URL } from '../config';

const apiURLAdmins = `${API_URL}/users`;

//Zwraca token zalogowanego użytkownika
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const SuperAdminService = {
    approveAdminRequest: async (id) => {
        return axios.post(`${apiURLAdmins}/admin-request-approve/${id}`, {}, {
            headers: authHeader()
        });
    },

    viewAllAdminRequests: async () => {
        return axios.get(`${apiURLAdmins}/view-all-admin-requests`, {
            headers: authHeader()
        });
    },

    viewOneAdminRequest: async (id) => {
        return axios.get(`${apiURLAdmins}/view-one-admin-request/${id}`, {
            headers: authHeader()
        });
    },

    viewAllAdmins: async () => {
        return axios.get(`${apiURLAdmins}/view-all-admins`, {
            headers: authHeader()
        });
    },

    viewOneAdmin: async (id) => {
        return axios.get(`${apiURLAdmins}/view-one-admin/${id}`, {
            headers: authHeader()
        });
    },

    blockAdmin: async (id) => {
        return axios.put(`${apiURLAdmins}/block-admin/${id}`, {}, {
            headers: authHeader()
        });
    },

    unblockAdmin: async (id) => {
        return axios.put(`${apiURLAdmins}/unblock-admin/${id}`, {}, {
            headers: authHeader()
        });
    }
};

export default SuperAdminService;