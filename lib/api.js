import axios from 'axios';

const api = axios.create({
    baseURL: process.env.SERVER_URL || 'http://localhost:5050',
    // baseURL: process.env.SERVER_URL || 'https://iamabhi0619.serveo.net',
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

export default api;
