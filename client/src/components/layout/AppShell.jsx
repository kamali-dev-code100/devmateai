import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import useUIStore from '../../store/uiStore';
import { useTheme } from '../../hooks';

export default function AppShell() {
  const { sidebarOpen, setSidebar } = useUIStore();
  const { theme }   = useTheme();
  const location    = useLocation();
  const isDark      = theme === 'dark';
  const bg          = isDark ? '#05060f' : '#f0f9ff';

  // Responsive sidebar: open on desktop, closed on mobile by default
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setSidebar(mq.matches);
    const handler = e => setSidebar(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-close on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebar(false);
  }, [location.pathname]);

  return (
    <div style={{ minHeight: '100vh', background: bg }}>
      <Topbar />

      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebar(false)}
          style={{
            display: 'none',
            position: 'fixed', inset: 0, zIndex: 35,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
          }}
          className="mobile-overlay"
        />
      )}

      <Sidebar />

      <main className="app-main" style={{
        marginTop:  '60px',
        minHeight:  'calc(100vh - 60px)',
        background:  bg,
        boxSizing:  'border-box',
        overflowX:  'hidden',
        transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        /* Desktop: push main right when sidebar open */
        @media (min-width: 1024px) {
          .app-main {
            margin-left: ${sidebarOpen ? '240px' : '0'};
            padding: 28px 32px;
          }
        }
        /* Tablet */
        @media (min-width: 640px) and (max-width: 1023px) {
          .app-main {
            margin-left: 0 !important;
            padding: 20px 24px;
          }
          .mobile-overlay { display: block !important; }
        }
        /* Mobile */
        @media (max-width: 639px) {
          .app-main {
            margin-left: 0 !important;
            padding: 16px;
          }
          .mobile-overlay { display: block !important; }
        }
      `}</style>
    </div>
  );
}