// src/utils/axiosInstance.js
import axios from 'axios';

const baseURL = 'http://localhost:8888'; // đổi nếu backend bạn khác

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Gửi access token nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('access_token');
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token nếu bị 401
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh_token')
    ) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(`${baseURL}/api/token/refresh/`, {
          refresh: localStorage.getItem('refresh_token'),
        });

        const newAccess = refreshRes.data.access;
        localStorage.setItem('access_token', newAccess);
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccess}`;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest); // retry request
      } catch (err) {
        console.error('Refresh token expired. Redirect to login.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
