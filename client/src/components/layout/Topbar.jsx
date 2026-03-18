import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks';
import useUIStore from '../../store/uiStore';

const PAGE_TITLES = {
  '/dashboard':   { title: 'Dashboard',        sub: 'Your AI developer hub' },
  '/resume':      { title: 'Resume Analyzer',  sub: 'ATS optimization & AI feedback' },
  '/interview':   { title: 'Interview Trainer',sub: 'Mock interviews with AI scoring' },
  '/code-review': { title: 'Code Reviewer',    sub: 'Instant AI code review' },
  '/learning':    { title: 'Learning Paths',   sub: 'Personalized AI roadmaps' },
  '/bug-fix':     { title: 'Bug Fix AI',       sub: 'AI diagnosis & repair' },
  '/profile':     { title: 'Profile',          sub: 'Manage your account' },
  '/settings':    { title: 'Settings',         sub: 'Preferences & configuration' },
};

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();
  const page = PAGE_TITLES[location.pathname] || { title: 'DevMate AI', sub: '' };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '60px',
        background: theme === 'dark'
          ? 'rgba(10,10,11,0.88)'
          : 'rgba(250,250,248,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 50,
        transition: 'background 0.3s',
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={toggleSidebar}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: '18px', padding: '4px' }}
        >
          ☰
        </button>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          <div
            style={{
              width: '28px', height: '28px',
              background: 'var(--accent)',
              borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--bg)">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: '17px', color: 'var(--text)' }}>
            DevMate AI
          </span>
        </div>
        <span style={{ color: 'var(--border2)', fontSize: '16px' }}>/</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>{page.title}</div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={toggleTheme}
          style={{
            width: '32px', height: '32px',
            borderRadius: '7px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            color: 'var(--text2)',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
        <button
          onClick={() => navigate('/settings')}
          style={{
            padding: '6px 12px',
            borderRadius: '7px',
            background: 'transparent',
            border: '1px solid var(--border2)',
            color: 'var(--text2)',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          ⚙ Settings
        </button>
      </div>
    </header>
  );
}
