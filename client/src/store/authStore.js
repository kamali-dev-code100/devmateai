import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
     setToken: (token) => {
  set({ token });
  // Also fetch user data immediately
  if (token) {
    api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(({ data }) => {
      set({ user: data.data });
    }).catch(() => {
      set({ token: null, user: null });
    });
  }
},

   login: async (email, password) => {
  set({ isLoading: true });
  try {
    const { data } = await api.post('/auth/login', { email, password });
    set({ user: data.data.user, token: data.data.accessToken, isLoading: false });
    return { success: true };
  } catch (err) {
    set({ isLoading: false, user: null, token: null });
    const message = err.response?.data?.message || 'Invalid email or password';
    return { success: false, message };
  }
},

      register: async (payload) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', payload);
          set({ user: data.data.user, token: data.data.accessToken, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
      },

      logout: async () => {
        try { await api.post('/auth/logout'); } catch {}
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.data });
        } catch {
          set({ user: null, token: null });
        }
      },
    }),
    { name: 'devmate-auth', partialize: (s) => ({ token: s.token }) }
  )
);

export default useAuthStore;
