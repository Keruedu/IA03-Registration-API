import axios from 'axios';

// Use environment variable for API URL
// In development: http://localhost:3000
// In production: Your Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  register: async (data) => {
    const response = await api.post('/user/register', data);
    return response.data;
  },
};
