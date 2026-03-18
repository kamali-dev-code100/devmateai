import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUIStore = create(
  persist(
    (set) => ({
      // ── Sidebar ──────────────────────────────────────
      sidebarOpen:   true,
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebar:    (val) => set({ sidebarOpen: val }),

      // ── Theme ────────────────────────────────────────
      theme:        'dark',                         // 'dark' | 'light'
      toggleTheme:  () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setTheme:     (t) => set({ theme: t }),

      // ── Accent color ─────────────────────────────────
      accentColor:     '#10b981',
      setAccentColor:  (c) => set({ accentColor: c }),
      setAccent:       (c) => set({ accentColor: c }), // alias
    }),
    {
      name: 'devmate-ui',           // localStorage key
      partialize: (s) => ({         // only persist theme + accent
        theme:       s.theme,
        accentColor: s.accentColor,
      }),
    }
  )
);

export default useUIStore;