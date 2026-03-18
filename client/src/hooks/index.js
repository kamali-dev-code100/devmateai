import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';

// ─── useAuth ──────────────────────────────────────────────────
export const useAuth = () => {
  const { user, token, isLoading, login, register, logout, fetchMe } = useAuthStore();
  return { user, token, isLoading, isAuthenticated: !!user, login, register, logout, fetchMe };
};

// ─── useTheme ─────────────────────────────────────────────────
export const useTheme = () => {
  const { theme, toggleTheme, setTheme, accentColor, setAccentColor } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    if (accentColor) {
      root.style.setProperty('--accent', accentColor);
    }
  }, [theme, accentColor]);

  return { theme, toggleTheme, setTheme, accentColor, setAccentColor };
};
