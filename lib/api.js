import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5050",
    timeout: 10000,
    withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

export const clearAccessToken = () => {
    accessToken = null;
};

api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

function onAccessTokenFetched(newToken) {
    refreshSubscribers.forEach((cb) => cb(newToken));
    refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
    refreshSubscribers.push(cb);
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip token refresh for auth endpoints
        const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/register') ||
            originalRequest.url?.includes('/auth/refresh');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((newToken) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(api(originalRequest));
                    });
                });
            }
            isRefreshing = true;
            try {
                const refreshUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5050"}/auth/refresh`;
                const { data } = await axios.post(
                    refreshUrl,
                    {},
                    { withCredentials: true }
                );
                const newAccessToken = data.data.token;
                setAccessToken(newAccessToken);
                isRefreshing = false;
                onAccessTokenFetched(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                clearAccessToken();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const fetcher = (url) => api.get(url).then(res => res.data).catch(err => { throw err; });

export default api;
