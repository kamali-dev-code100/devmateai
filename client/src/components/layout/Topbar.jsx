import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useTheme } from '../../hooks';
import useUIStore from '../../store/uiStore';

// ── Icon renderer ─────────────────────────────────────────────
const Icon = ({ d, size = 16, color = 'currentColor', sw = 1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

export const ICONS = {
  menu:     ['M3 6h18M3 12h18M3 18h18'],
  settings: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z','M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'],
  bell:     ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0'],
  sun:      ['M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z','M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'],
  moon:     ['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'],
  user:     ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  check:    ['M20 6L9 17l-5-5'],
  chevronR: ['M9 18l6-6-6-6'],
  bolt:     ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  resume:   ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6'],
  code:     ['M16 18l6-6-6-6','M8 6l-6 6 6 6'],
  clock:    ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 6v6l4 2'],
  star:     ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  info:     ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 8h.01','M12 12v4'],
  logout:   ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4','M16 17l5-5-5-5','M21 12H9'],
  bug:      ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
};

const PAGE_TITLES = {
  '/dashboard':   { title: 'Dashboard',        sub: 'Your AI developer hub'           },
  '/resume':      { title: 'Resume Analyzer',  sub: 'ATS optimization & AI feedback'  },
  '/interview':   { title: 'Interview Trainer', sub: 'Mock interviews with AI scoring' },
  '/code-review': { title: 'Code Reviewer',     sub: 'Instant AI code review'          },
  '/learning':    { title: 'Learning Paths',    sub: 'Personalized AI roadmaps'        },
  '/bug-fix':     { title: 'Bug Fix AI',        sub: 'AI diagnosis & repair'           },
  '/profile':     { title: 'Profile',           sub: 'Manage your account'             },
  '/settings':    { title: 'Settings',          sub: 'Preferences & configuration'     },
};

// ── Sample notifications ──────────────────────────────────────
const SAMPLE_NOTIFICATIONS = [
  {
    id: 1, unread: true,
    iconKey: 'resume', iconColor: '#2563eb',
    title: 'Resume analyzed',
    body: 'Your resume scored 82/100 — 3 improvements suggested.',
    time: '2 min ago',
    action: '/resume',
  },
  {
    id: 2, unread: true,
    iconKey: 'star', iconColor: '#f59e0b',
    title: 'Interview session complete',
    body: 'System design score: 78/100. Great job on scalability!',
    time: '1 hour ago',
    action: '/interview',
  },
  {
    id: 3, unread: true,
    iconKey: 'bolt', iconColor: '#7c3aed',
    title: 'Credits running low',
    body: 'You have 95 credits left. Upgrade to Pro for unlimited.',
    time: '3 hours ago',
    action: '/settings',
  },
  {
    id: 4, unread: false,
    iconKey: 'code', iconColor: '#d97706',
    title: 'Code review complete',
    body: 'Found 2 critical issues in your React component.',
    time: 'Yesterday',
    action: '/code-review',
  },
  {
    id: 5, unread: false,
    iconKey: 'info', iconColor: '#10b981',
    title: 'New feature: Bug Fix AI',
    body: 'Instantly diagnose and fix bugs with our new AI tool.',
    time: '2 days ago',
    action: '/bug-fix',
  },
];

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar }      = useUIStore();
  const { user }               = useAuth();
  const location               = useLocation();
  const navigate               = useNavigate();
  const isDark                 = theme === 'dark';
  const page = PAGE_TITLES[location.pathname] || { title: 'DevMate AI', sub: '' };

  // Notification state
  const [notifOpen, setNotifOpen]   = useState(false);
  const [notifs, setNotifs]         = useState(SAMPLE_NOTIFICATIONS);
  const notifRef                    = useRef(null);
  const unreadCount                 = notifs.filter(n => n.unread).length;

  // Close on outside click
  useEffect(() => {
    const h = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const markAllRead  = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  const markRead     = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const handleNotifClick = (notif) => { markRead(notif.id); navigate(notif.action); setNotifOpen(false); };

  // ── Theme tokens ──────────────────────────────────────────
  const T = {
    bg:         isDark ? 'rgba(8,10,20,0.95)'         : 'rgba(255,255,255,0.95)',
    border:     isDark ? 'rgba(255,255,255,0.07)'     : 'rgba(0,0,0,0.08)',
    text1:      isDark ? '#ffffff'                     : '#0f1117',
    text2:      isDark ? 'rgba(255,255,255,0.55)'     : 'rgba(0,0,0,0.55)',
    text3:      isDark ? 'rgba(255,255,255,0.3)'      : 'rgba(0,0,0,0.35)',
    btnBg:      isDark ? 'rgba(255,255,255,0.06)'     : 'rgba(0,0,0,0.04)',
    btnBrd:     isDark ? 'rgba(255,255,255,0.1)'      : 'rgba(0,0,0,0.1)',
    btnHov:     isDark ? 'rgba(255,255,255,0.1)'      : 'rgba(0,0,0,0.07)',
    notifDot:   isDark ? 'rgba(8,10,20,1)'            : 'rgba(255,255,255,1)',
    divider:    isDark ? 'rgba(255,255,255,0.12)'     : 'rgba(0,0,0,0.15)',
    panelBg:    isDark ? 'rgba(10,12,24,0.98)'        : 'rgba(255,255,255,0.98)',
    panelBrd:   isDark ? 'rgba(255,255,255,0.1)'      : 'rgba(0,0,0,0.1)',
    hoverBg:    isDark ? 'rgba(255,255,255,0.04)'     : 'rgba(0,0,0,0.03)',
    unreadBg:   isDark ? 'rgba(16,185,129,0.06)'      : 'rgba(16,185,129,0.04)',
    itemBrd:    isDark ? 'rgba(255,255,255,0.05)'     : 'rgba(0,0,0,0.06)',
  };

  const iconBtn = (extra = {}) => ({
    width: 36, height: 36, borderRadius: '10px',
    background: T.btnBg, border: `1px solid ${T.btnBrd}`,
    color: T.text2, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s', outline: 'none', flexShrink: 0,
    ...extra,
  });

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <>
      <style>{`
        .tb-icon-btn:hover { background: ${T.btnHov} !important; color: ${T.text1} !important; border-color: ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.16)'} !important; }
        .tb-icon-btn:active { transform: scale(0.94); }
        .tb-avatar:hover    { box-shadow: 0 0 0 2px #10b981 !important; }
        .tb-notif-item:hover { background: ${T.hoverBg} !important; }
        .tb-notif-item      { transition: background 0.15s; cursor: pointer; }
        .tb-mark-all:hover  { color: #10b981 !important; }
        .tb-mark-all        { transition: color 0.15s; cursor: pointer; }
        @media (min-width: 481px) {
          .tb-notif-panel { left: auto !important; right: 12px !important; width: 360px !important; }
        }

        .tb-page-sub    { display: none; }
        .tb-logo-text   { display: none; }
        .tb-divider-sep { display: none; }
        .tb-page-info   { display: none; }
        @media (min-width: 640px) { .tb-page-sub    { display: block; } }
        @media (min-width: 480px) { .tb-logo-text   { display: block; } }
        @media (min-width: 768px) { .tb-divider-sep { display: block; } .tb-page-info { display: flex; } }

        /* Notification panel slide-in */
        @keyframes tb-notif-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .tb-notif-panel { animation: tb-notif-in 0.2s cubic-bezier(0.22,1,0.36,1) both; }

        /* Unread pulse dot */
        @keyframes tb-pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
      `}</style>

      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '60px', zIndex: 50,
        background: T.bg,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(12px,2.5vw,20px)', gap: '8px',
        transition: 'background 0.3s',
      }}>

        {/* ── LEFT ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          <button className="tb-icon-btn" style={iconBtn()} onClick={toggleSidebar} title="Toggle sidebar" aria-label="Toggle sidebar">
            <Icon d={ICONS.menu} size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/dashboard')}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#10b981,#0891b2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="tb-logo-text" style={{ fontFamily: 'Instrument Serif, serif', fontSize: '16px', color: T.text1, fontWeight: 400, whiteSpace: 'nowrap' }}>DevMate AI</span>
          </div>

          <span className="tb-divider-sep" style={{ color: T.divider, fontSize: '18px', fontWeight: 100, lineHeight: 1, userSelect: 'none' }}>/</span>
          <div className="tb-page-info" style={{ alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: T.text1, whiteSpace: 'nowrap' }}>{page.title}</span>
            {page.sub && (
              <>
                <span className="tb-page-sub" style={{ color: T.text3, fontSize: '12px', flexShrink: 0 }}>·</span>
                <span className="tb-page-sub" style={{ fontSize: '12px', color: T.text3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{page.sub}</span>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>

          {/* ── Notification Bell + Dropdown ── */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button className="tb-icon-btn" style={iconBtn({ position: 'relative' })}
              onClick={() => setNotifOpen(p => !p)} title="Notifications" aria-label="Notifications">
              <Icon d={ICONS.bell} size={16} />
              {/* Unread count badge */}
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: 5, right: 5,
                  minWidth: 16, height: 16, borderRadius: '8px',
                  background: '#ef4444',
                  border: `2px solid ${T.notifDot}`,
                  fontSize: '9px', fontWeight: 800,
                  color: '#fff', fontFamily: 'DM Sans, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1, padding: unreadCount > 9 ? '0 3px' : '0',
                  boxShadow: '0 0 6px rgba(239,68,68,0.5)',
                  animation: 'tb-pulse 2s ease-in-out infinite',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* ── Notification Panel ── */}
            {notifOpen && (
              <div className="tb-notif-panel" style={{
                position: 'fixed',
                top: '70px',
                right: '8px',
                left: '8px',
                width: 'auto',
                background: T.panelBg,
                border: `1px solid ${T.panelBrd}`,
                borderRadius: '16px',
                boxShadow: isDark
                  ? '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)'
                  : '0 24px 60px rgba(0,0,0,0.12)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                overflow: 'hidden',
                zIndex: 100,
              }}>

                {/* Panel header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 12px', borderBottom: `1px solid ${T.itemBrd}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: T.text1, fontFamily: 'DM Sans, sans-serif' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', fontFamily: 'DM Sans, sans-serif' }}>
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <span className="tb-mark-all" onClick={markAllRead}
                      style={{ fontSize: '11px', fontWeight: 600, color: T.text3, fontFamily: 'DM Sans, sans-serif', userSelect: 'none' }}>
                      Mark all read
                    </span>
                  )}
                </div>

                {/* Notification list */}
                <div style={{ maxHeight: 'min(340px, calc(100dvh - 180px))', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  {notifs.map((n, i) => (
                    <div key={n.id} className="tb-notif-item"
                      onClick={() => handleNotifClick(n)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '11px',
                        padding: '12px 16px',
                        background: n.unread ? T.unreadBg : 'transparent',
                        borderBottom: i < notifs.length - 1 ? `1px solid ${T.itemBrd}` : 'none',
                        position: 'relative',
                      }}>

                      {/* Icon tile */}
                      <div style={{ width: 34, height: 34, borderRadius: '10px', background: `${n.iconColor}18`, border: `1px solid ${n.iconColor}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Icon d={ICONS[n.iconKey] || ICONS.info} size={15} color={n.iconColor} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: n.unread ? 700 : 500, color: T.text1, fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                            {n.title}
                          </span>
                          {n.unread && (
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', flexShrink: 0, boxShadow: '0 0 5px rgba(16,185,129,0.6)' }} />
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: T.text2, lineHeight: 1.45, fontFamily: 'DM Sans, sans-serif', marginBottom: '4px' }}>
                          {n.body}
                        </div>
                        <div style={{ fontSize: '11px', color: T.text3, fontFamily: 'DM Sans, sans-serif' }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Panel footer */}
                <div style={{ padding: '10px 16px', borderTop: `1px solid ${T.itemBrd}` }}>
                  <button onClick={() => { navigate('/settings'); setNotifOpen(false); }}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'transparent', border: `1px solid ${T.itemBrd}`, color: T.text3, fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.itemBrd; e.currentTarget.style.color = T.text3; }}>
                    <Icon d={ICONS.settings} size={12} color="currentColor" />
                    Notification settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button className="tb-icon-btn" style={iconBtn()} onClick={toggleTheme}
            title={isDark ? 'Switch to light' : 'Switch to dark'} aria-label="Toggle theme">
            <Icon d={isDark ? ICONS.sun : ICONS.moon} size={16} />
          </button>

          {/* Settings */}
          <button className="tb-icon-btn" style={iconBtn()} onClick={() => navigate('/settings')}
            title="Settings" aria-label="Settings">
            <Icon d={ICONS.settings} size={16} />
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 22, background: T.border, flexShrink: 0 }} />

          {/* Avatar */}
          <button className="tb-avatar" onClick={() => navigate('/profile')}
            title={user?.name || 'Profile'} aria-label="Profile"
            style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: `2px solid ${T.btnBrd}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0, outline: 'none', transition: 'box-shadow 0.2s, border-color 0.2s', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.03em', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
            {initials}
          </button>
        </div>
      </header>
    </>
  );
}