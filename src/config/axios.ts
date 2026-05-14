import axios from 'axios';
import { env } from './env';

/**
 * Configured Axios instance.
 * AI uses `apiClient` for ALL HTTP requests.
 * NEVER create a new instance — use this one.
 */
export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'API-KEY',
    ...(env.X_API_KEY && { 'x-api-key': env.X_API_KEY }),
  },
});

// ── Request interceptor ──────────────────────────────────────
// apiClient.interceptors.request.use(
//   (config) => {
//     // Read token from Zustand store — single source of truth
//     const { token } = useAuthStore.getState();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// ── Response interceptor ─────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Import after export to avoid circular dependency issues
import { useAuthStore } from '@/store/auth.store';

export default apiClient;
