import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import useUIStore from '../../store/uiStore';

const NAV = [
  {
    section: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
    ],
  },
  {
    section: 'AI Tools',
    items: [
      { to: '/resume',      label: 'Resume Analyzer',  icon: '📄', badge: 'New' },
      { to: '/interview',   label: 'Interview Trainer', icon: '🎯' },
      { to: '/code-review', label: 'Code Reviewer',    icon: '⚡' },
      { to: '/learning',    label: 'Learning Paths',   icon: '🗺️' },
      { to: '/bug-fix',     label: 'Bug Fix AI',       icon: '🔍' },
    ],
  },
  {
    section: 'Account',
    items: [
      { to: '/profile',  label: 'Profile',  icon: '👤' },
      { to: '/settings', label: 'Settings', icon: '⚙️' },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { sidebarOpen } = useUIStore();
  const navigate = useNavigate();

  if (!sidebarOpen) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside
      style={{
        width: '230px',
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        padding: '16px 10px',
        position: 'fixed',
        top: '60px',
        left: 0,
        bottom: 0,
        overflowY: 'auto',
        flexShrink: 0,
        zIndex: 40,
        transition: 'background 0.3s',
      }}
    >
      {NAV.map(({ section, items }) => (
        <div key={section}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '10px 10px 4px',
            }}
          >
            {section}
          </div>
          {items.map(({ to, label, icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--accent)' : 'var(--text2)',
                background: isActive ? 'var(--accentDim)' : 'transparent',
                textDecoration: 'none',
                marginBottom: '1px',
                transition: 'all 0.15s',
              })}
            >
              <span style={{ fontSize: '15px' }}>{icon}</span>
              <span style={{ flex: 1 }}>{label}</span>
              {badge && (
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 600,
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: 'var(--accentDim)',
                    color: 'var(--accent)',
                  }}
                >
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      ))}

      {/* User footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 10px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg2)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 8px',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 600,
              color: 'white',
              flexShrink: 0,
            }}
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'capitalize' }}>
              {user?.plan || 'free'} plan · {user?.credits ?? 0} credits
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: 'var(--text3)',
              padding: '2px',
            }}
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
