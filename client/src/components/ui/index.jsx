import { useTheme } from '../../hooks';

// ── Shared theme hook ─────────────────────────────────────────
function useT() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return {
    isDark,
    text1:      isDark ? '#ffffff'                       : '#0f1117',
    text2:      isDark ? 'rgba(255,255,255,0.65)'       : 'rgba(0,0,0,0.65)',
    text3:      isDark ? 'rgba(255,255,255,0.35)'       : 'rgba(0,0,0,0.4)',
    accent:                                                '#10b981',
    accentDim:  isDark ? 'rgba(16,185,129,0.12)'        : 'rgba(16,185,129,0.09)',
    accentTxt:  isDark ? '#6ee7b7'                       : '#059669',
    border:     isDark ? 'rgba(255,255,255,0.08)'       : 'rgba(0,0,0,0.09)',
    cardBg:     isDark ? 'rgba(255,255,255,0.03)'       : 'rgba(255,255,255,0.85)',
    surface:    isDark ? 'rgba(255,255,255,0.05)'       : 'rgba(0,0,0,0.03)',
    inputBg:    isDark ? 'rgba(255,255,255,0.05)'       : 'rgba(255,255,255,0.9)',
    inputBrd:   isDark ? 'rgba(255,255,255,0.12)'       : 'rgba(0,0,0,0.12)',
    shadow:     isDark ? '0 2px 12px rgba(0,0,0,0.2)'  : '0 2px 12px rgba(0,0,0,0.06)',
    divider:    isDark ? 'rgba(255,255,255,0.06)'       : 'rgba(0,0,0,0.07)',
    trackBg:    isDark ? 'rgba(255,255,255,0.08)'       : 'rgba(0,0,0,0.08)',
    toggleOff:  isDark ? 'rgba(255,255,255,0.12)'       : 'rgba(0,0,0,0.12)',
  };
}

// ── PageHeader ────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  const T = useT();
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px',
      marginBottom: 'clamp(16px,3vw,28px)',
    }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(20px,3vw,26px)',
          color: T.text1, marginBottom: '4px', fontWeight: 400,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 'clamp(12px,1.5vw,14px)', color: T.text3, margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────
export function StatCard({ label, value, delta, deltaColor, iconColor }) {
  const T = useT();
  return (
    <div style={{
      background: T.cardBg,
      borderRadius: '12px',
      padding: 'clamp(12px,2vw,16px)',
      border: `1px solid ${T.border}`,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: T.shadow,
    }}>
      <div style={{
        fontSize: '10px', color: T.text3, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 'clamp(20px,3vw,24px)', fontWeight: 700,
        color: T.text1, fontFamily: 'Instrument Serif, serif', lineHeight: 1,
      }}>
        {value}
      </div>
      {delta && (
        <div style={{
          fontSize: '11px',
          color: deltaColor || iconColor || T.accentTxt,
          marginTop: '5px',
        }}>
          {delta}
        </div>
      )}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────
export function Card({ children, style = {}, onClick }) {
  const T = useT();
  return (
    <div onClick={onClick} style={{
      background: T.cardBg,
      border: `1px solid ${T.border}`,
      borderRadius: '14px',
      padding: 'clamp(14px,2.5vw,20px)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: T.shadow,
      cursor: onClick ? 'pointer' : undefined,
      transition: onClick ? 'all 0.18s' : undefined,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── SectionTitle ──────────────────────────────────────────────
export function SectionTitle({ children, sub }) {
  const T = useT();
  return (
    <div style={{ marginBottom: sub ? '4px' : '20px' }}>
      <h2 style={{ fontSize: 'clamp(16px,2.5vw,18px)', fontWeight: 600, color: T.text1 }}>
        {children}
      </h2>
      {sub && (
        <p style={{ fontSize: '13px', color: T.text3, marginBottom: '20px', marginTop: '2px' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ── FormGroup ─────────────────────────────────────────────────
export function FormGroup({ label, children, hint }) {
  const T = useT();
  return (
    <div style={{ marginBottom: 'clamp(14px,2vw,18px)' }}>
      {label && (
        <label style={{
          display: 'block', fontSize: '11px', fontWeight: 700,
          color: T.text3, textTransform: 'uppercase',
          letterSpacing: '0.06em', marginBottom: '6px',
        }}>
          {label}
        </label>
      )}
      {children}
      {hint && (
        <div style={{ fontSize: '11px', color: T.text3, marginTop: '5px' }}>{hint}</div>
      )}
    </div>
  );
}

// ── FormInput ─────────────────────────────────────────────────
export function FormInput({ value, onChange, placeholder, type = 'text', style = {}, ...props }) {
  const T = useT();
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        width: '100%', padding: '10px 13px',
        background: T.inputBg, border: `1px solid ${T.inputBrd}`,
        borderRadius: '9px', color: T.text1, fontSize: '13px',
        outline: 'none', transition: 'border-color 0.15s',
        boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif',
        minHeight: '44px', WebkitAppearance: 'none',
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = '#10b981'}
      onBlur={e => e.target.style.borderColor = T.inputBrd}
      {...props}
    />
  );
}

// ── FormTextarea ──────────────────────────────────────────────
export function FormTextarea({ value, onChange, placeholder, rows = 4, style = {}, ...props }) {
  const T = useT();
  return (
    <textarea
      value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{
        width: '100%', padding: '10px 13px',
        background: T.inputBg, border: `1px solid ${T.inputBrd}`,
        borderRadius: '9px', color: T.text1, fontSize: '13px',
        outline: 'none', transition: 'border-color 0.15s',
        boxSizing: 'border-box', resize: 'vertical',
        fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6,
        WebkitAppearance: 'none',
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = '#10b981'}
      onBlur={e => e.target.style.borderColor = T.inputBrd}
      {...props}
    />
  );
}

// ── ToggleRow ─────────────────────────────────────────────────
export function ToggleRow({ name, description, checked, onChange }) {
  const T = useT();
  return (
    <>
      <style>{`
        .toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
        .toggle-track {
          width: 40px; height: 22px; border-radius: 11px;
          background: ${checked ? '#10b981' : T.toggleOff};
          transition: background 0.2s; flex-shrink: 0;
          display: flex; align-items: center; padding: 0 3px;
          cursor: pointer; position: relative;
        }
        .toggle-thumb {
          width: 16px; height: 16px; border-radius: 50%; background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          transform: translateX(${checked ? '18px' : '0'});
          transition: transform 0.2s;
          position: absolute; top: 3px;
          left: ${checked ? 'auto' : '3px'};
          right: ${checked ? '3px' : 'auto'};
        }
      `}</style>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'clamp(10px,1.5vw,14px) 0',
        borderBottom: `1px solid ${T.divider}`,
        gap: '16px',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 'clamp(13px,1.5vw,14px)', fontWeight: 500, color: T.text1 }}>{name}</div>
          {description && (
            <div style={{ fontSize: '12px', color: T.text3, marginTop: '2px', lineHeight: 1.4 }}>{description}</div>
          )}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <input type="checkbox" checked={checked} onChange={onChange} className="toggle-input" />
          <div className="toggle-track">
            <div className="toggle-thumb" />
          </div>
        </label>
      </div>
    </>
  );
}

// ── RadioGroup ────────────────────────────────────────────────
export function RadioGroup({ options, value, onChange, color = '#10b981' }) {
  const T = useT();
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {options.map((opt) => (
        <div key={opt.value} onClick={() => onChange(opt.value)} style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '8px 14px', minHeight: '40px',
          border: `1px solid ${value === opt.value ? color : T.border}`,
          borderRadius: '9px', cursor: 'pointer', fontSize: '13px',
          color: value === opt.value ? color : T.text2,
          background: value === opt.value ? `${color}15` : 'transparent',
          transition: 'all 0.15s', userSelect: 'none',
        }}>
          {opt.icon && <span style={{ fontSize: '14px' }}>{opt.icon}</span>}
          {opt.label}
        </div>
      ))}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 18, color = '#10b981' }) {
  return (
    <>
      <style>{`@keyframes ui-spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{
        display: 'inline-block', width: size, height: size,
        border: `2px solid rgba(128,128,128,0.2)`,
        borderTopColor: color, borderRadius: '50%',
        animation: 'ui-spin 0.7s linear infinite',
        flexShrink: 0,
      }} />
    </>
  );
}

// ── EmptyState ────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  const T = useT();
  return (
    <div style={{
      textAlign: 'center',
      padding: 'clamp(32px,6vw,60px) 20px',
      color: T.text3,
    }}>
      <div style={{ fontSize: '40px', marginBottom: '14px' }}>{icon}</div>
      <div style={{ fontSize: 'clamp(14px,1.8vw,16px)', fontWeight: 500, color: T.text2, marginBottom: '6px' }}>
        {title}
      </div>
      <div style={{ fontSize: '13px', marginBottom: '20px', lineHeight: 1.6 }}>{description}</div>
      {action}
    </div>
  );
}

// ── ActivityItem ──────────────────────────────────────────────
export function ActivityItem({ color, label, time, detail }) {
  const T = useT();
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      padding: '9px 0', borderBottom: `1px solid ${T.divider}`,
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%', background: color,
        flexShrink: 0, marginTop: 4,
        boxShadow: `0 0 6px ${color}60`,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', color: T.text2, lineHeight: 1.4 }}
          dangerouslySetInnerHTML={{ __html: label }} />
        {detail && (
          <div style={{ fontSize: '11px', color: T.text3, marginTop: '1px' }}>{detail}</div>
        )}
      </div>
      <div style={{ fontSize: '11px', color: T.text3, flexShrink: 0, whiteSpace: 'nowrap' }}>
        {time}
      </div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────
const BADGE_STYLES = {
  green:  { bg: 'rgba(16,185,129,0.12)',  color: '#059669',  border: 'rgba(16,185,129,0.2)'  },
  blue:   { bg: 'rgba(59,130,246,0.12)',  color: '#2563eb',  border: 'rgba(59,130,246,0.2)'  },
  amber:  { bg: 'rgba(245,158,11,0.12)',  color: '#d97706',  border: 'rgba(245,158,11,0.2)'  },
  red:    { bg: 'rgba(239,68,68,0.12)',   color: '#dc2626',  border: 'rgba(239,68,68,0.2)'   },
  purple: { bg: 'rgba(124,58,237,0.12)',  color: '#7c3aed',  border: 'rgba(124,58,237,0.2)'  },
  gray:   { bg: 'rgba(100,116,139,0.12)', color: '#64748b',  border: 'rgba(100,116,139,0.2)' },
};

export function Badge({ children, variant = 'green', style = {} }) {
  const bs = BADGE_STYLES[variant] || BADGE_STYLES.green;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 700,
      background: bs.bg, color: bs.color, border: `1px solid ${bs.border}`,
      ...style,
    }}>
      {children}
    </span>
  );
}

// ── PrimaryButton ─────────────────────────────────────────────
export function PrimaryButton({ children, onClick, disabled, loading: isLoading, style = {} }) {
  return (
    <>
      <style>{`@keyframes pb-spin { to { transform: rotate(360deg); } }`}</style>
      <button onClick={onClick} disabled={disabled || isLoading}
        style={{
          padding: '10px 20px', borderRadius: '10px', border: 'none',
          background: (disabled || isLoading) ? 'rgba(0,0,0,0.06)' : 'linear-gradient(135deg,#10b981,#0891b2)',
          color: (disabled || isLoading) ? 'rgba(128,128,128,0.6)' : '#fff',
          fontSize: '13px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
          cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          transition: 'all 0.18s', minHeight: '44px',
          boxShadow: (disabled || isLoading) ? 'none' : '0 2px 12px rgba(16,185,129,0.3)',
          ...style,
        }}
        onMouseEnter={e => { if (!disabled && !isLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.4)'; }}}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = (disabled || isLoading) ? 'none' : '0 2px 12px rgba(16,185,129,0.3)'; }}>
        {isLoading && <span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'pb-spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0 }} />}
        {children}
      </button>
    </>
  );
}

// ── GhostButton ───────────────────────────────────────────────
export function GhostButton({ children, onClick, disabled, style = {} }) {
  const T = useT();
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        padding: '8px 16px', borderRadius: '9px', minHeight: '40px',
        border: `1px solid ${T.border}`, background: 'transparent',
        color: T.text2, fontSize: '13px', fontWeight: 500,
        fontFamily: 'DM Sans, sans-serif',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.15s', opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = '#10b981'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}>
      {children}
    </button>
  );
}

// ── ProgressBar ───────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = '#10b981' }) {
  const T = useT();
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ height: 5, background: T.trackBg, borderRadius: 3, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`, background: color,
        borderRadius: 3, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────
export function Divider({ style = {} }) {
  const T = useT();
  return <div style={{ height: 1, background: T.divider, margin: '16px 0', ...style }} />;
}

// ── SectionLabel ──────────────────────────────────────────────
export function SectionLabel({ children }) {
  const T = useT();
  return (
    <div style={{
      fontSize: '10px', fontWeight: 700, color: T.text3,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: '10px', marginTop: '4px',
    }}>
      {children}
    </div>
  );
}