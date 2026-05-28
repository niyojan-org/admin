import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5050';

type RetryAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export function createClientApi() {
  const api = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
  });

  api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const originalRequest = error.config as RetryAxiosRequestConfig;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const requestUrl = originalRequest.url || '';

      const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh');

      // avoid infinite refresh loop
      if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await axios.post(
            `${baseURL}/auth/refresh`,
            {},
            {
              withCredentials: true,
            },
          );

          const newAccessToken = refreshResponse.data?.data?.token;

          if (!newAccessToken) {
            return Promise.reject(error);
          }

          // set fresh token
          originalRequest.headers = new AxiosHeaders({
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          });
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
}
