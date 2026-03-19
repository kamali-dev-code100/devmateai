import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';

// ─── useAuth ──────────────────────────────────────────────────
export const useAuth = () => {
  const { user, token, isLoading, login, register, logout, fetchMe, setToken, setUser } = useAuthStore();
  return { user, token, isLoading, isAuthenticated: !!user, login, register, logout, fetchMe, setToken, setUser };
};
// ─── useTheme ─────────────────────────────────────────────────
export const useTheme = () => {
  const { theme, toggleTheme, setTheme, accentColor, setAccentColor } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const isDark = theme === 'dark';

    // ── 1. Toggle class on <html> (for any Tailwind dark: classes) ──
    root.classList.toggle('dark',  isDark);
    root.classList.toggle('light', !isDark);

    // ── 2. Apply CSS variables so legacy var(--text) still works ──
    if (isDark) {
      root.style.setProperty('--bg',         '#05060f');
      root.style.setProperty('--bg2',        'rgba(8,10,20,0.97)');
      root.style.setProperty('--bg3',        'rgba(255,255,255,0.04)');
      root.style.setProperty('--bg4',        'rgba(255,255,255,0.08)');
      root.style.setProperty('--text',       '#ffffff');
      root.style.setProperty('--text2',      'rgba(255,255,255,0.65)');
      root.style.setProperty('--text3',      'rgba(255,255,255,0.35)');
      root.style.setProperty('--border',     'rgba(255,255,255,0.08)');
      root.style.setProperty('--border2',    'rgba(255,255,255,0.15)');
      root.style.setProperty('--accentDim',  'rgba(16,185,129,0.12)');
      root.style.setProperty('--amber',      '#f59e0b');
      root.style.setProperty('--red',        '#ef4444');
      root.style.setProperty('--blue',       '#3b82f6');
      root.style.setProperty('--purple',     '#8b5cf6');
    } else {
      root.style.setProperty('--bg',         '#f0f9ff');
      root.style.setProperty('--bg2',        'rgba(255,255,255,0.97)');
      root.style.setProperty('--bg3',        'rgba(0,0,0,0.03)');
      root.style.setProperty('--bg4',        'rgba(0,0,0,0.06)');
      root.style.setProperty('--text',       '#0f1117');
      root.style.setProperty('--text2',      'rgba(0,0,0,0.65)');
      root.style.setProperty('--text3',      'rgba(0,0,0,0.4)');
      root.style.setProperty('--border',     'rgba(0,0,0,0.09)');
      root.style.setProperty('--border2',    'rgba(0,0,0,0.18)');
      root.style.setProperty('--accentDim',  'rgba(16,185,129,0.09)');
      root.style.setProperty('--amber',      '#d97706');
      root.style.setProperty('--red',        '#dc2626');
      root.style.setProperty('--blue',       '#2563eb');
      root.style.setProperty('--purple',     '#7c3aed');
    }

    // ── 3. Accent color (always) ──
    const ac = accentColor || '#10b981';
    root.style.setProperty('--accent', ac);

    // ── 4. Body background — critical so page bg changes ──
    body.style.background    = isDark ? '#05060f' : '#f0f9ff';
    body.style.color         = isDark ? '#ffffff'  : '#0f1117';
    body.style.transition    = 'background 0.3s, color 0.3s';

    // ── 5. Meta theme-color for mobile browser chrome ──
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = isDark ? '#05060f' : '#f0f9ff';

  }, [theme, accentColor]);

  return { theme, toggleTheme, setTheme, accentColor, setAccentColor };
};