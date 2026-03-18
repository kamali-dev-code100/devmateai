// ── DevMate AI — Unified Icon System ─────────────────────────
// Single source of truth. Import Icon + IC everywhere.
// All icons: strokeWidth 1.75, round caps/joins, 24×24 viewBox.
// Usage: <Icon d={IC.resume} size={16} color="#10b981" />

export function Icon({ d, size = 16, color = 'currentColor', fill = 'none', sw = 1.75 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke={color}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}>
      {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

export const IC = {
  // ── Navigation ──────────────────────────────────────────────
  menu:       ['M3 6h18M3 12h18M3 18h18'],
  close:      ['M18 6L6 18M6 6l12 12'],
  chevronR:   ['M9 18l6-6-6-6'],
  chevronD:   ['M6 9l6 6 6-6'],
  chevronL:   ['M15 18l-6-6 6-6'],
  arrowR:     ['M5 12h14M12 5l7 7-7 7'],
  arrowLeft:  ['M19 12H5M12 5l-7 7 7 7'],
  externalLink:['M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6','M15 3h6v6','M10 14L21 3'],

  // ── Actions ─────────────────────────────────────────────────
  settings:   ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z','M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'],
  bell:       ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0'],
  sun:        ['M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z','M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'],
  moon:       ['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'],
  search:     ['M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0'],
  logout:     ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4','M16 17l5-5-5-5','M21 12H9'],
  edit:       ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash:      ['M3 6h18','M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6','M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
  copy:       ['M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z','M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'],
  check:      ['M20 6L9 17l-5-5'],
  plus:       ['M12 5v14M5 12h14'],
  send:       ['M22 2L11 13','M22 2L15 22l-4-9-9-4 20-7z'],
  refresh:    ['M23 4v6h-6','M1 20v-6h6','M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'],
  download:   ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3'],
  upload:     ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M17 8l-5-5-5 5','M12 3v12'],
  filter:     ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'],
  sort:       ['M3 6h18M6 12h12M9 18h6'],
  moreH:      ['M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'],
  eye:        ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  eyeOff:     ['M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24','M1 1l22 22'],

  // ── User / Account ──────────────────────────────────────────
  user:       ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  users:      ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M23 21v-2a4 4 0 0 0-3-3.87','M9 3a4 4 0 0 1 0 8','M16 3.13a4 4 0 0 1 0 7.75'],
  shield:     ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  key:        ['M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'],
  lock:       ['M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z','M7 11V7a5 5 0 0 1 10 0v4'],

  // ── AI Tools ────────────────────────────────────────────────
  resume:     ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8'],
  interview:  ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 6v6l4 2'],
  code:       ['M16 18l6-6-6-6','M8 6l-6 6 6 6'],
  learning:   ['M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z','M2 12h20','M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'],
  bug:        ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  bolt:       ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  dashboard:  ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z','M9 22V12h6v10'],
  brain:      ['M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4z'],
  cpu:        ['M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18'],
  terminal:   ['M4 17l6-6-6-6','M12 19h8'],
  git:        ['M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z','M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z','M6 21V9a9 9 0 0 0 9 9'],

  // ── Data & Stats ────────────────────────────────────────────
  star:       ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  trending:   ['M23 6l-9.5 9.5-5-5L1 18'],
  barChart:   ['M18 20V10','M12 20V4','M6 20v-6'],
  pieChart:   ['M21.21 15.89A10 10 0 1 1 8 2.83','M22 12A10 10 0 0 0 12 2v10z'],
  activity:   ['M22 12h-4l-3 9L9 3l-3 9H2'],
  zap:        ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  award:      ['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z','M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  target:     ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z','M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],

  // ── Misc ────────────────────────────────────────────────────
  info:       ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 8h.01','M12 12v4'],
  alert:      ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  checkCircle:['M22 11.08V12a10 10 0 1 1-5.93-9.14','M22 4L12 14.01l-3-3'],
  xCircle:    ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M15 9l-6 6M9 9l6 6'],
  clock:      ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 6v6l4 2'],
  calendar:   ['M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z','M3 10h18M8 3v4M16 3v4M3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9'],
  mail:       ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  link:       ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71','M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
  sparkles:   ['M12 3l1.09 3.26L16.5 7.5l-3.41 1.24L12 12l-1.09-3.26L7.5 7.5l3.41-1.24L12 3z','M5 17l.55 1.64L7.19 19.5l-1.64.86L5 22l-.55-1.64L2.81 19.5l1.64-.86L5 17z','M19 3l.55 1.64 1.64.86-1.64.86L19 8l-.55-1.64-1.64-.86 1.64-.86L19 3z'],
  layers:     ['M12 2L2 7l10 5 10-5-10-5z','M2 17l10 5 10-5','M2 12l10 5 10-5'],
  map:        ['M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z','M8 2v16','M16 6v16'],
  globe:      ['M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z','M2 12h20','M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'],
};

// ── Spinner (loading) ─────────────────────────────────────────
export function Spinner({ size = 14, color = '#fff' }) {
  return (
    <span style={{
      width: size, height: size, flexShrink: 0,
      border: `2px solid ${color}30`,
      borderTopColor: color,
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'devmate-spin 0.65s linear infinite',
    }} />
  );
}

// ── Primary Button ────────────────────────────────────────────
export function PrimaryBtn({ children, onClick, disabled, loading, icon, style = {} }) {
  return (
    <>
      <style>{`@keyframes devmate-spin { to { transform: rotate(360deg); } }`}</style>
      <button onClick={onClick} disabled={disabled || loading}
        style={{
          width: '100%', minHeight: 44,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '10px 18px', borderRadius: '11px', border: 'none',
          background: (disabled || loading)
            ? 'rgba(128,128,128,0.12)'
            : 'linear-gradient(135deg,#10b981,#0891b2)',
          color: (disabled || loading) ? 'rgba(128,128,128,0.5)' : '#fff',
          fontSize: '13px', fontWeight: 700,
          fontFamily: 'DM Sans, sans-serif',
          cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
          transition: 'all 0.18s',
          boxShadow: (disabled || loading) ? 'none' : '0 2px 14px rgba(16,185,129,0.32)',
          letterSpacing: '0.01em',
          ...style,
        }}
        onMouseEnter={e => { if (!disabled && !loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(16,185,129,0.45)'; }}}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = (disabled || loading) ? 'none' : '0 2px 14px rgba(16,185,129,0.32)'; }}>
        {loading ? <Spinner size={14} color="#fff" /> : icon}
        {children}
      </button>
    </>
  );
}

// ── Ghost Button ──────────────────────────────────────────────
export function GhostBtn({ children, onClick, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        minHeight: 36, padding: '7px 14px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        borderRadius: '9px', border: '1px solid rgba(128,128,128,0.2)',
        background: 'transparent', color: 'inherit',
        fontSize: '12px', fontWeight: 500,
        fontFamily: 'DM Sans, sans-serif',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s', opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = '#10b981'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(128,128,128,0.2)'; }}>
      {children}
    </button>
  );
}