import axios from 'axios';
import { API_BASE } from '../config/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor: user JWT or admin JWT (admin panel stores adminToken)
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      [
        'token',
        'refreshToken',
        'tokenExpiry',
        'user',
        'adminToken',
        'adminRefreshToken',
        'adminTokenExpiry',
        'isAdmin'
      ].forEach((k) => localStorage.removeItem(k));
    }
    return Promise.reject(error);
  }
);

export default api;
