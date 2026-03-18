import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 60000, // 60s for AI calls
});

// ─── Request interceptor: attach token ───────────────────────
api.interceptors.request.use((config) => {
  // Get token from zustand persisted storage
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
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        return api(original);
      } catch {
        localStorage.removeItem('devmate-auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
