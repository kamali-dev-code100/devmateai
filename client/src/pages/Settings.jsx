import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../hooks';
import { userService } from '../services';
import { Icon, IC } from '../components/ui/Icons';
import toast from 'react-hot-toast';

// ── Theme hook ────────────────────────────────────────────────
function useT() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return {
    isDark,
    text1:      isDark ? '#ffffff'                       : '#0f1117',
    text2:      isDark ? 'rgba(255,255,255,0.62)'       : 'rgba(0,0,0,0.62)',
    text3:      isDark ? 'rgba(255,255,255,0.35)'       : 'rgba(0,0,0,0.42)',
    accentTxt:  isDark ? '#6ee7b7'                       : '#059669',
    border:     isDark ? 'rgba(255,255,255,0.08)'       : 'rgba(0,0,0,0.09)',
    cardBg:     isDark ? 'rgba(255,255,255,0.03)'       : 'rgba(255,255,255,0.85)',
    surface:    isDark ? 'rgba(255,255,255,0.05)'       : 'rgba(0,0,0,0.04)',
    inputBg:    isDark ? 'rgba(255,255,255,0.05)'       : 'rgba(255,255,255,0.9)',
    inputBrd:   isDark ? 'rgba(255,255,255,0.12)'       : 'rgba(0,0,0,0.12)',
    shadow:     isDark ? '0 2px 12px rgba(0,0,0,0.2)'  : '0 2px 12px rgba(0,0,0,0.06)',
    divider:    isDark ? 'rgba(255,255,255,0.06)'       : 'rgba(0,0,0,0.07)',
    trackBg:    isDark ? 'rgba(255,255,255,0.08)'       : 'rgba(0,0,0,0.08)',
    sidebarAct: isDark ? 'rgba(16,185,129,0.12)'        : 'rgba(16,185,129,0.08)',
    dangerBg:   isDark ? 'rgba(239,68,68,0.08)'         : 'rgba(239,68,68,0.06)',
    dangerBrd:  isDark ? 'rgba(239,68,68,0.2)'          : 'rgba(239,68,68,0.2)',
  };
}

// ── Toggle switch ─────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)}
      style={{ width: 44, height: 24, borderRadius: 12, background: checked ? 'linear-gradient(135deg,#10b981,#0891b2)' : 'rgba(128,128,128,0.2)', cursor: 'pointer', position: 'relative', transition: 'background 0.22s', flexShrink: 0, boxShadow: checked ? '0 0 10px rgba(16,185,129,0.3)' : 'none' }}>
      <div style={{ position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.22s cubic-bezier(0.4,0,0.2,1)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </div>
  );
}

// ── Toggle row ────────────────────────────────────────────────
function ToggleRow({ label, description, checked, onChange, T, last = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '14px 0', borderBottom: last ? 'none' : `1px solid ${T.divider}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 500, color: T.text1, fontFamily: 'DM Sans, sans-serif' }}>{label}</div>
        {description && <div style={{ fontSize: '12px', color: T.text3, marginTop: '2px', lineHeight: 1.4, fontFamily: 'DM Sans, sans-serif' }}>{description}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────
function SectionTitle({ iconKey, children, T }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
      {iconKey && <Icon d={IC[iconKey]} size={13} color={T.text3} />}
      <div style={{ fontSize: '10px', fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Sans, sans-serif' }}>{children}</div>
    </div>
  );
}

// ── Save button ───────────────────────────────────────────────
function SaveBtn({ children, onClick, loading, color = '#10b981', shadowColor = 'rgba(16,185,129,0.32)' }) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: loading ? 'rgba(128,128,128,0.12)' : `linear-gradient(135deg,${color},${color === '#10b981' ? '#0891b2' : color})`, color: loading ? 'rgba(128,128,128,0.5)' : '#fff', fontSize: '13px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif', cursor: loading ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px', transition: 'all 0.18s', minHeight: 40, boxShadow: loading ? 'none' : `0 2px 12px ${shadowColor}`, flexShrink: 0 }}
      onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${shadowColor.replace('0.32', '0.5')}`; }}}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = loading ? 'none' : `0 2px 12px ${shadowColor}`; }}>
      {loading
        ? <><span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'st-spin 0.7s linear infinite', display: 'inline-block' }} />Saving...</>
        : <>{children}</>
      }
    </button>
  );
}

// ── Settings sidebar nav items ────────────────────────────────
const SECTIONS = [
  { id: 'security',      label: 'Security',      iconKey: 'lock'      },
  { id: 'notifications', label: 'Notifications', iconKey: 'bell'      },
  { id: 'integrations',  label: 'Integrations',  iconKey: 'link'      },
  { id: 'account',       label: 'Account',       iconKey: 'user'      },
];

export default function Settings() {
  const T        = useT();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [active, setActive]   = useState('notifications');
  const [saving, setSaving]   = useState(false);

  // ── Security state ──
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw]       = useState({ current: false, next: false, confirm: false });
  const [twoFA, setTwoFA]         = useState(false);

  // ── Notification state ──
  const [emailNotifs, setEmailNotifs] = useState({ analysisComplete: true, interviewReminders: true, weeklyReport: true, productUpdates: false });
  const [appNotifs,   setAppNotifs]   = useState({ aiSuggestions: true, creditWarnings: true, sessionReminders: false });

  // ── Integration state ──
  const [integrations, setIntegrations] = useState({ github: false, vscode: false, slack: false });

  // ── Account / appearance ──
  const [appearance, setAppearance] = useState({ theme: theme, language: 'English', dateFormat: 'MM/DD/YYYY' });

  const handleSave = async (section) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    toast.success(`${section} settings saved!`);
    setSaving(false);
  };

  const handleDeleteAccount = () => toast.error('Account deletion requires email confirmation.');

  const inputStyle = { width: '100%', padding: '10px 13px', background: T.inputBg, border: `1px solid ${T.inputBrd}`, borderRadius: '9px', color: T.text1, fontSize: '13px', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', minHeight: 44 };
  const onFocus = e => e.target.style.borderColor = '#10b981';
  const onBlur  = e => e.target.style.borderColor = T.inputBrd;

  return (
    <>
      <style>{`
        @keyframes st-spin    { to { transform: rotate(360deg); } }
        @keyframes st-fadeup  { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none} }
        .st-anim { animation: st-fadeup 0.35s ease both; }
        .st-nav-item { transition: all 0.14s ease; cursor: pointer; border-radius: 9px; }
        .st-nav-item:hover { background: ${T.surface} !important; }
        .st-int-card { transition: all 0.2s; }
        .st-int-card:hover { border-color: rgba(16,185,129,0.4) !important; }

        /* Responsive settings layout */
        .st-layout { display: grid; grid-template-columns: 200px 1fr; gap: 20px; align-items: start; }
        @media(max-width: 768px) { .st-layout { grid-template-columns: 1fr; } .st-sidebar { display: flex; flex-wrap: wrap; flex-direction: row !important; gap: 6px !important; padding: clamp(12px,2vw,14px) !important; } .st-sidebar .st-nav-item { flex: 1; min-width: 120px; } }
      `}</style>

      <div className="st-anim">
        {/* ── Page header ── */}
        <div style={{ marginBottom: 'clamp(16px,3vw,24px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <div style={{ width: 38, height: 38, borderRadius: '11px', background: 'rgba(100,116,139,0.15)', border: '1px solid rgba(100,116,139,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon d={IC.settings} size={18} color="#64748b" />
            </div>
            <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(20px,3vw,26px)', color: T.text1, fontWeight: 400, margin: 0 }}>Settings</h1>
          </div>
          <p style={{ fontSize: 'clamp(12px,1.5vw,13px)', color: T.text3, marginLeft: '48px', fontFamily: 'DM Sans, sans-serif' }}>Preferences & configuration</p>
        </div>

        <div className="st-layout">

          {/* ── Sidebar nav ── */}
          <div className="st-sidebar" style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '8px', backdropFilter: 'blur(16px)', boxShadow: T.shadow, display: 'flex', flexDirection: 'column', gap: '2px', position: 'sticky', top: '76px' }}>
            {SECTIONS.map(s => (
              <div key={s.id} className="st-nav-item"
                onClick={() => setActive(s.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: active === s.id ? T.sidebarAct : 'transparent', color: active === s.id ? '#10b981' : T.text2 }}>
                <Icon d={IC[s.iconKey]} size={15} color={active === s.id ? '#10b981' : T.text3} />
                <span style={{ fontSize: '13px', fontWeight: active === s.id ? 600 : 400, fontFamily: 'DM Sans, sans-serif' }}>{s.label}</span>
                {active === s.id && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: '#10b981' }} />}
              </div>
            ))}
          </div>

          {/* ── Content panel ── */}
          <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: '14px', backdropFilter: 'blur(16px)', boxShadow: T.shadow, overflow: 'hidden' }}>

            {/* ════ SECURITY ════ */}
            {active === 'security' && (
              <div>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.divider}` }}>
                  <SectionTitle iconKey="lock" T={T}>Change Password</SectionTitle>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  {['current','next','confirm'].map((field, i) => (
                    <div key={field} style={{ marginBottom: i < 2 ? '14px' : '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>
                        {field === 'current' ? 'Current Password' : field === 'next' ? 'New Password' : 'Confirm New Password'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPw[field] ? 'text' : 'password'}
                          value={passwords[field]}
                          onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))}
                          placeholder="••••••••"
                          style={{ ...inputStyle, paddingRight: '44px' }}
                          onFocus={onFocus} onBlur={onBlur} />
                        <button type="button" onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
                          style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.text3, display: 'flex', padding: 0, transition: 'color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.color = T.text1}
                          onMouseLeave={e => e.currentTarget.style.color = T.text3}>
                          <Icon d={showPw[field] ? IC.eyeOff : IC.eye} size={15} color="currentColor" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SaveBtn onClick={() => handleSave('Password')} loading={saving} color="#10b981">
                      <Icon d={IC.lock} size={13} color="#fff" /> Update Password
                    </SaveBtn>
                  </div>
                </div>

                <div style={{ padding: '18px 24px', borderTop: `1px solid ${T.divider}`, borderBottom: `1px solid ${T.divider}` }}>
                  <SectionTitle iconKey="shield" T={T}>Two-Factor Authentication</SectionTitle>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <ToggleRow label="Enable 2FA" description="Add an extra layer of security to your account using an authenticator app." checked={twoFA} onChange={setTwoFA} T={T} last />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <SaveBtn onClick={() => handleSave('Security')} loading={saving} color="#10b981">
                      <Icon d={IC.check} size={13} color="#fff" /> Save Security Settings
                    </SaveBtn>
                  </div>
                </div>
              </div>
            )}

            {/* ════ NOTIFICATIONS ════ */}
            {active === 'notifications' && (
              <div>
                {/* Email notifications */}
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.divider}` }}>
                  <SectionTitle iconKey="mail" T={T}>Email Notifications</SectionTitle>
                </div>
                <div style={{ padding: '0 24px' }}>
                  <ToggleRow label="Analysis complete"     description="When a resume or code review finishes"         checked={emailNotifs.analysisComplete}    onChange={v => setEmailNotifs(p=>({...p,analysisComplete:v}))}    T={T} />
                  <ToggleRow label="Interview reminders"   description="Daily practice session reminders"             checked={emailNotifs.interviewReminders}  onChange={v => setEmailNotifs(p=>({...p,interviewReminders:v}))}  T={T} />
                  <ToggleRow label="Weekly progress report" description="Your weekly AI usage summary"                checked={emailNotifs.weeklyReport}        onChange={v => setEmailNotifs(p=>({...p,weeklyReport:v}))}        T={T} />
                  <ToggleRow label="Product updates"       description="New features and announcements"               checked={emailNotifs.productUpdates}      onChange={v => setEmailNotifs(p=>({...p,productUpdates:v}))}      T={T} last />
                </div>

                {/* In-app notifications */}
                <div style={{ padding: '18px 24px', borderTop: `1px solid ${T.divider}`, borderBottom: `1px solid ${T.divider}` }}>
                  <SectionTitle iconKey="bell" T={T}>In-App Notifications</SectionTitle>
                </div>
                <div style={{ padding: '0 24px' }}>
                  <ToggleRow label="AI suggestions"    description="Proactive tips based on your activity"     checked={appNotifs.aiSuggestions}    onChange={v => setAppNotifs(p=>({...p,aiSuggestions:v}))}    T={T} />
                  <ToggleRow label="Credit warnings"   description="Alert when credits fall below 20%"         checked={appNotifs.creditWarnings}   onChange={v => setAppNotifs(p=>({...p,creditWarnings:v}))}   T={T} />
                  <ToggleRow label="Session reminders" description="Remind me to practice every 3 days"        checked={appNotifs.sessionReminders} onChange={v => setAppNotifs(p=>({...p,sessionReminders:v}))} T={T} last />
                </div>

                {/* ── Save button — right-aligned in its own row ── */}
                <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.divider}`, display: 'flex', justifyContent: 'flex-end' }}>
                  <SaveBtn onClick={() => handleSave('Notification')} loading={saving} color="#10b981">
                    <Icon d={IC.check} size={13} color="#fff" /> Save Notification Settings
                  </SaveBtn>
                </div>
              </div>
            )}

            {/* ════ INTEGRATIONS ════ */}
            {active === 'integrations' && (
              <div>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.divider}` }}>
                  <SectionTitle iconKey="link" T={T}>Connected Services</SectionTitle>
                </div>
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { key: 'github', label: 'GitHub',       desc: 'Connect to analyze repos and review PRs.',    color: '#333', darkColor: '#fff',    iconKey: 'git'      },
                    { key: 'vscode', label: 'VS Code',      desc: 'DevMate AI extension for real-time hints.',   color: '#0078d4', darkColor: '#0078d4', iconKey: 'code'  },
                    { key: 'slack',  label: 'Slack',        desc: 'Get AI insights delivered to your channel.',  color: '#4a154b', darkColor: '#e01e5a', iconKey: 'bell'  },
                  ].map(int => (
                    <div key={int.key} className="st-int-card"
                      style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '12px', border: `1px solid ${integrations[int.key] ? 'rgba(16,185,129,0.35)' : T.border}`, background: integrations[int.key] ? T.sidebarAct : T.surface, transition: 'all 0.18s' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '10px', background: `${integrations[int.key] ? '#10b981' : T.inputBg}`, border: `1px solid ${integrations[int.key] ? 'rgba(16,185,129,0.3)' : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                        <Icon d={IC[int.iconKey]} size={18} color={integrations[int.key] ? '#fff' : T.text3} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: T.text1, fontFamily: 'DM Sans, sans-serif' }}>{int.label}</div>
                        <div style={{ fontSize: '12px', color: T.text3, fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>{int.desc}</div>
                      </div>
                      <Toggle checked={integrations[int.key]} onChange={v => setIntegrations(p => ({ ...p, [int.key]: v }))} />
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.divider}`, display: 'flex', justifyContent: 'flex-end' }}>
                  <SaveBtn onClick={() => handleSave('Integration')} loading={saving} color="#10b981">
                    <Icon d={IC.check} size={13} color="#fff" /> Save Integrations
                  </SaveBtn>
                </div>
              </div>
            )}

            {/* ════ ACCOUNT ════ */}
            {active === 'account' && (
              <div>
                {/* Appearance */}
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.divider}` }}>
                  <SectionTitle iconKey="sun" T={T}>Appearance</SectionTitle>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>Theme</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['dark','light'].map(t => (
                        <div key={t} onClick={() => { if (theme !== t) toggleTheme(); }}
                          style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: `1px solid ${theme===t?'#10b981':T.border}`, background: theme===t?'rgba(16,185,129,0.1)':'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.15s' }}>
                          <Icon d={t==='dark'?IC.moon:IC.sun} size={15} color={theme===t?'#10b981':T.text3} />
                          <span style={{ fontSize: '13px', fontWeight: theme===t?600:400, color: theme===t?'#10b981':T.text2, fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize' }}>{t}</span>
                          {theme===t && <Icon d={IC.check} size={12} color="#10b981" style={{ marginLeft: 'auto' }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Language</label>
                    <select value={appearance.language} onChange={e => setAppearance(p => ({...p, language: e.target.value}))}
                      style={{ ...inputStyle, cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}>
                      {['English','Spanish','French','German','Japanese','Chinese'].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                {/* Danger zone */}
                <div style={{ padding: '18px 24px', borderTop: `1px solid ${T.divider}`, borderBottom: `1px solid ${T.divider}` }}>
                  <SectionTitle iconKey="alert" T={T}>Danger Zone</SectionTitle>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ padding: '16px', borderRadius: '11px', background: T.dangerBg, border: `1px solid ${T.dangerBrd}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#ef4444', marginBottom: '4px', fontFamily: 'DM Sans, sans-serif' }}>Delete Account</div>
                        <div style={{ fontSize: '12px', color: T.text3, lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>Permanently delete your account and all data. This cannot be undone.</div>
                      </div>
                      <button onClick={handleDeleteAccount}
                        style={{ padding: '8px 16px', borderRadius: '9px', border: `1px solid rgba(239,68,68,0.4)`, background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s', minHeight: 40, flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}>
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <button onClick={() => { logout(); navigate('/'); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '9px', border: `1px solid ${T.border}`, background: 'transparent', color: T.text2, fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s', minHeight: 40 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text2; }}>
                    <Icon d={IC.logout} size={14} color="currentColor" /> Sign out
                  </button>
                  <SaveBtn onClick={() => handleSave('Account')} loading={saving} color="#10b981">
                    <Icon d={IC.check} size={13} color="#fff" /> Save Changes
                  </SaveBtn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}