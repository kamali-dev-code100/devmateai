import axios from 'axios';

// ─── Base URL ─────────────────────────────────────────────────
// Uses VITE_API_URL in production, falls back to proxy in development
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 60000,
});

// ─── Request interceptor: attach token ───────────────────────
api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem('devmate-auth') || '{}');
    const token = stored?.state?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

// ─── Response interceptor: handle 401 ────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        return api(original);
      } catch {
        localStorage.removeItem('devmate-auth');
        window.location.href = '/auth?tab=login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;