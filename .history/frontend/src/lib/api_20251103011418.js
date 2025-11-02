import axios from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearTokens } from './auth';

// Use environment variable for API URL
// In development: http://localhost:3000
// In production: set VITE_API_URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let subscribers = [];

function onRefreshed(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function addSubscriber(cb) {
  subscribers.push(cb);
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (!error.response || error.response.status !== 401) return Promise.reject(error);
    if (original._retry) return Promise.reject(error);
    original._retry = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addSubscriber((token) => {
          if (!token) return reject(error);
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    try {
      // Use a raw axios call to avoid interceptor loop
      const resp = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
      const newAccess = resp.data.accessToken;
      setAccessToken(newAccess);
      onRefreshed(newAccess);
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (e) {
      clearTokens();
      onRefreshed(null);
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);

export const authService = {
  register: async (data) => {
    // Ensure we send a flat payload { email, password } to match backend DTO
    const body = { email: data?.email, password: data?.password };
    // eslint-disable-next-line no-console
    console.debug('[api] register payload', body);
    const response = await api.post('/user/register', body);
    return response.data;
  },
  login: async (data) => {
    const body = { email: data?.email, password: data?.password };
    // eslint-disable-next-line no-console
    console.debug('[api] login payload', body);
    const response = await api.post('/auth/login', body);
    return response.data;
  },
  refresh: async (refreshToken) => {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    return response.data;
  },
  me: async () => {
    const response = await api.get('/me');
    return response.data;
  },
};

export { setAccessToken, setRefreshToken, clearTokens };
