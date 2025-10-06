import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
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
