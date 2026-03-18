import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../../hooks';
import useUIStore from '../../store/uiStore';

const IC = {
  dashboard: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z','M9 22V12h6v10'],
  resume:    ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8'],
  interview: ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 6v6l4 2'],
  code:      ['M16 18l6-6-6-6','M8 6l-6 6 6 6'],
  learning:  ['M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z','M2 12h20','M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'],
  bug:       ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  profile:   ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  settings:  ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z','M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'],
  logout:    ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4','M16 17l5-5-5-5','M21 12H9'],
  bolt:      ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  x:         ['M18 6L6 18M6 6l12 12'],
};

function SvgIcon({ paths, size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block' }}>
      {(Array.isArray(paths) ? paths : [paths]).map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

const NAV = [
  { section: 'Overview', items: [
    { to: '/dashboard', label: 'Dashboard', key: 'dashboard' },
  ]},
  { section: 'AI Tools', items: [
    { to: '/resume',      label: 'Resume Analyzer',  key: 'resume',    badge: 'New', color: '#1d4ed8' },
    { to: '/interview',   label: 'Interview Trainer', key: 'interview',              color: '#059669' },
    { to: '/code-review', label: 'Code Reviewer',     key: 'code',                   color: '#d97706' },
    { to: '/learning',    label: 'Learning Paths',    key: 'learning',               color: '#7c3aed' },
    { to: '/bug-fix',     label: 'Bug Fix AI',        key: 'bug',                    color: '#dc2626' },
  ]},
  { section: 'Account', items: [
    { to: '/profile',  label: 'Profile',  key: 'profile',  color: '#6366f1' },
    { to: '/settings', label: 'Settings', key: 'settings', color: '#64748b' },
  ]},
];

export default function Sidebar() {
  const { user, logout }               = useAuth();
  const { theme }                      = useTheme();
  const { sidebarOpen, setSidebar }    = useUIStore();
  const navigate                       = useNavigate();
  const isDark                         = theme === 'dark';

  const T = {
    bg:         isDark ? 'rgba(8,10,20,0.98)'       : 'rgba(255,255,255,0.98)',
    border:     isDark ? 'rgba(255,255,255,0.07)'   : 'rgba(0,0,0,0.08)',
    text1:      isDark ? '#ffffff'                   : '#0f1117',
    text2:      isDark ? 'rgba(255,255,255,0.65)'   : 'rgba(0,0,0,0.65)',
    text3:      isDark ? 'rgba(255,255,255,0.35)'   : 'rgba(0,0,0,0.4)',
    sectionLbl: isDark ? 'rgba(255,255,255,0.28)'   : 'rgba(0,0,0,0.35)',
    hoverBg:    isDark ? 'rgba(255,255,255,0.06)'   : 'rgba(0,0,0,0.04)',
    badgeBg:    isDark ? 'rgba(16,185,129,0.15)'    : 'rgba(16,185,129,0.1)',
    badgeC:     isDark ? '#6ee7b7'                   : '#059669',
    upgradeBg:  isDark ? 'rgba(16,185,129,0.08)'    : 'rgba(16,185,129,0.07)',
    upgradeBrd: isDark ? 'rgba(16,185,129,0.2)'     : 'rgba(16,185,129,0.22)',
    upgradeAcc: isDark ? '#6ee7b7'                   : '#059669',
  };

  const handleLogout = async () => { await logout(); navigate('/'); };
  const handleNav    = () => { if (window.innerWidth < 1024) setSidebar(false); };

  return (
    <>
      <style>{`
        .snav-link { transition: all 0.15s ease; text-decoration: none; }
        .snav-link:hover { background: ${T.hoverBg} !important; transform: translateX(2px); }
        .slogout:hover { background: rgba(239,68,68,0.08) !important; color: #ef4444 !important; }
        .slogout { transition: all 0.15s; }
        .supgrade { transition: all 0.2s; }
        .supgrade:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(16,185,129,0.18); }
        .suser-row { transition: background 0.15s; border-radius: 10px; cursor: pointer; }
        .suser-row:hover { background: ${T.hoverBg}; }

        /* Sidebar positioning */
        .sidebar-panel {
          position: fixed;
          top: 60px; left: 0; bottom: 0;
          width: 240px;
          z-index: 40;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          background: ${T.bg};
          border-right: 1px solid ${T.border};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          /* Slide animation */
          transform: translateX(${sidebarOpen ? '0' : '-100%'});
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
          /* Prevent body scroll on iOS when sidebar open */
          -webkit-overflow-scrolling: touch;
        }

        /* Mobile backdrop */
        .sidebar-backdrop {
          display: none;
        }
        @media (max-width: 1023px) {
          .sidebar-backdrop {
            display: ${sidebarOpen ? 'block' : 'none'};
            position: fixed;
            inset: 0;
            top: 60px;
            z-index: 35;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
          }
        }
      `}</style>

      {/* Mobile backdrop */}
      <div className="sidebar-backdrop" onClick={() => setSidebar(false)} />

      {/* Sidebar panel */}
      <aside className="sidebar-panel">

        {/* Mobile close button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 0', marginBottom: '-4px' }}
          className="sidebar-mobile-header">
          <style>{`.sidebar-mobile-header { display: none; } @media(max-width:1023px){.sidebar-mobile-header{display:flex!important;}}`}</style>
          <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: '15px', color: T.text1 }}>DevMate AI</span>
          <button onClick={() => setSidebar(false)}
            style={{ width: 32, height: 32, borderRadius: '8px', background: T.hoverBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.text3, flexShrink: 0 }}>
            <SvgIcon paths={IC.x} size={14} color="currentColor" />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '12px 10px 0', overflowY: 'auto' }}>
          {NAV.map(({ section, items }) => (
            <div key={section} style={{ marginBottom: '4px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: T.sectionLbl, textTransform: 'uppercase', letterSpacing: '0.09em', padding: '12px 10px 5px' }}>
                {section}
              </div>
              {items.map(({ to, label, key, badge, color }) => (
                <NavLink key={to} to={to} onClick={handleNav} className="snav-link"
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 10px', // larger tap target
                    borderRadius: '9px',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? (color || '#10b981') : T.text2,
                    background: isActive ? `${color || '#10b981'}18` : 'transparent',
                    marginBottom: '1px',
                    position: 'relative',
                  })}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3px', borderRadius: '0 3px 3px 0', background: color || '#10b981', marginLeft: '-10px' }} />
                      )}
                      <span style={{ opacity: isActive ? 1 : 0.65, display: 'flex', transition: 'opacity 0.15s', flexShrink: 0 }}>
                        <SvgIcon paths={IC[key]} size={15} color={isActive ? (color || '#10b981') : T.text2} />
                      </span>
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
                      {badge && (
                        <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '5px', background: T.badgeBg, color: T.badgeC, letterSpacing: '0.03em', flexShrink: 0 }}>{badge}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Upgrade banner */}
        <div style={{ padding: '10px' }}>
          <div className="supgrade" onClick={() => { navigate('/settings'); handleNav(); }}
            style={{ padding: '12px', borderRadius: '12px', background: T.upgradeBg, border: `1px solid ${T.upgradeBrd}`, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
              <div style={{ width: 26, height: 26, borderRadius: '7px', background: 'linear-gradient(135deg,#10b981,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <SvgIcon paths={IC.bolt} size={13} color="#fff" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: T.text1 }}>Upgrade to Pro</span>
            </div>
            <div style={{ fontSize: '11px', color: T.text3, lineHeight: 1.45 }}>Unlock GPT-4o + unlimited credits</div>
            <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 600, color: T.upgradeAcc }}>$19/mo — Start free trial →</div>
          </div>
        </div>

        {/* User footer */}
        <div style={{ padding: '10px', borderTop: `1px solid ${T.border}` }}>
          <div className="suser-row" style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '8px 10px' }}
            onClick={() => { navigate('/profile'); handleNav(); }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: T.text1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '10px', color: T.text3, textTransform: 'capitalize' }}>
                {user?.plan || 'free'} · {user?.credits ?? 0} credits
              </div>
            </div>
            <button className="slogout"
              onClick={e => { e.stopPropagation(); handleLogout(); }}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '7px', display: 'flex', alignItems: 'center', color: T.text3, minWidth: 32, minHeight: 32, justifyContent: 'center' }}
              title="Logout" aria-label="Logout">
              <SvgIcon paths={IC.logout} size={14} color="currentColor" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}