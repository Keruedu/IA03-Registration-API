import axios from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from './auth';

// Use environment variable for API URL
// In development: http://localhost:3000
// In production: set VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

// Response interceptor to handle 401 and try refreshing access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response or not 401, just reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue the request until refresh finished
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((token) => {
          if (!token) return reject(error);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const resp = await api.post('/auth/refresh', { refreshToken });
      const newAccessToken = resp.data.accessToken;
      setAccessToken(newAccessToken);
      onRefreshed(newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearTokens();
      onRefreshed(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const authService = {
  register: async (data) => {
    const response = await api.post('/user/register', data);
    return response.data;
  },
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  refresh: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
  me: async () => {
    const response = await api.get('/me');
    return response.data;
  },
};

// In development, spin up a mock server that intercepts API calls so the app
// can be tested without a running backend. The mock server uses the same
// `api` axios instance so interceptors and refresh logic are exercised.
if (import.meta.env.DEV) {
  import('./mockServer').then((m) => m.setupMockServer(api));
}
