import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUIStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      sidebarOpen: true,
      accentColor: '#6ee7b7',

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        const root = document.documentElement;
        root.classList.toggle('dark', next === 'dark');
        root.classList.toggle('light', next === 'light');
      },

      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        root.classList.toggle('light', theme === 'light');
      },

      setAccentColor: (color) => {
        set({ accentColor: color });
        document.documentElement.style.setProperty('--accent', color);
      },

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    { name: 'devmate-ui' }
  )
);

export default useUIStore;
