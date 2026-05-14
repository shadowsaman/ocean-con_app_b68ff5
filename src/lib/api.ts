import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Authorization': 'API-KEY',
    'X-API-KEY': import.meta.env.VITE_X_API_KEY,
  },
});

export default apiClient;
