// ─── PageHeader ───────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
      <div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '26px', color: 'var(--text)', marginBottom: '4px' }}>
          {title}
        </h1>
        {subtitle && <p style={{ fontSize: '14px', color: 'var(--text2)' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────
export function StatCard({ label, value, delta, deltaColor }) {
  return (
    <div style={{ background: 'var(--bg3)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', fontFamily: 'Instrument Serif, serif', lineHeight: 1 }}>
        {value}
      </div>
      {delta && (
        <div style={{ fontSize: '11px', color: deltaColor || 'var(--accent)', marginTop: '4px' }}>
          {delta}
        </div>
      )}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────
export function Card({ children, style, onClick, hover = true }) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined, ...style }}
    >
      {children}
    </div>
  );
}

// ─── SectionTitle ─────────────────────────────────────────────
export function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: sub ? '4px' : '20px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>{children}</h2>
      {sub && <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '20px', marginTop: '2px' }}>{sub}</p>}
    </div>
  );
}

// ─── FormGroup ────────────────────────────────────────────────
export function FormGroup({ label, children, hint }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      {label && <label className="form-label">{label}</label>}
      {children}
      {hint && <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>{hint}</div>}
    </div>
  );
}

// ─── Toggle Row ───────────────────────────────────────────────
export function ToggleRow({ name, description, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>{name}</div>
        {description && <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>{description}</div>}
      </div>
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <div className="toggle-track" />
        <div className="toggle-thumb" />
      </label>
    </div>
  );
}

// ─── RadioGroup ───────────────────────────────────────────────
export function RadioGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {options.map((opt) => (
        <div
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 14px',
            border: `1px solid ${value === opt.value ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            color: value === opt.value ? 'var(--accent)' : 'var(--text2)',
            background: value === opt.value ? 'var(--accentDim)' : 'transparent',
            transition: 'all 0.15s',
          }}
        >
          {opt.icon && <span>{opt.icon}</span>}
          {opt.label}
        </div>
      ))}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────
export function Spinner({ size = 18 }) {
  return (
    <span
      className="spinner"
      style={{ width: size, height: size }}
    />
  );
}

// ─── Empty State ──────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
      <div style={{ fontSize: '40px', marginBottom: '14px' }}>{icon}</div>
      <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text2)', marginBottom: '6px' }}>{title}</div>
      <div style={{ fontSize: '13px', marginBottom: '20px' }}>{description}</div>
      {action}
    </div>
  );
}

// ─── ActivityItem ─────────────────────────────────────────────
export function ActivityItem({ color, label, time, detail }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', color: 'var(--text2)' }} dangerouslySetInnerHTML={{ __html: label }} />
        {detail && <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '1px' }}>{detail}</div>}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text3)', flexShrink: 0 }}>{time}</div>
    </div>
  );
}
