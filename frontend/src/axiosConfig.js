import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5555', // Ustawienie domyślnego URL-a backendu
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;