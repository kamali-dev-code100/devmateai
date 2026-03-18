import { useState } from 'react';
import { useAuth } from '../hooks';
import { useTheme } from '../hooks';
import { PageHeader, Card, FormGroup, ToggleRow } from '../components/ui';
import { userService } from '../services';
import toast from 'react-hot-toast';

const ACCENT_COLORS = [
  { label: 'Emerald', value: '#6ee7b7' },
  { label: 'Violet',  value: '#a78bfa' },
  { label: 'Blue',    value: '#60a5fa' },
  { label: 'Amber',   value: '#fbbf24' },
  { label: 'Rose',    value: '#f87171' },
  { label: 'Cyan',    value: '#67e8f9' },
];

const SECTIONS = ['Appearance', 'AI Preferences', 'Security', 'Notifications', 'Integrations', 'Account'];

export default function Settings() {
  const { user, fetchMe } = useAuth();
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const [active, setActive] = useState('Appearance');
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const [notifs, setNotifs] = useState({
    emailAnalysis:    user?.settings?.notifications?.emailAnalysis    ?? true,
    emailInterview:   user?.settings?.notifications?.emailInterview   ?? true,
    weeklyReport:     user?.settings?.notifications?.weeklyReport     ?? false,
    productUpdates:   user?.settings?.notifications?.productUpdates   ?? true,
    inAppSuggestions: user?.settings?.notifications?.inAppSuggestions ?? true,
    creditWarnings:   user?.settings?.notifications?.creditWarnings   ?? true,
  });

  const [aiPrefs, setAiPrefs] = useState({
    responseLength:       user?.settings?.aiResponseLength || 'medium',
    aiPersonality:        user?.settings?.aiPersonality    || 'mentor',
    defaultInterviewRole: user?.settings?.defaultInterviewRole || 'Senior Software Engineer',
  });

  const saveSettings = async (settings) => {
    setSaving(true);
    try {
      await userService.updateSettings(settings);
      await fetchMe();
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) return toast.error('Please fill all fields');
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    if (pwForm.newPassword.length < 8) return toast.error('New password must be at least 8 characters');
    setSaving(true);
    try {
      await userService.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your preferences, security, and account" />
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>

        {/* Sidebar nav */}
        <div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            {SECTIONS.map(s => (
              <div key={s} onClick={() => setActive(s)}
                style={{ padding: '11px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: active === s ? 500 : 400, color: active === s ? 'var(--accent)' : 'var(--text2)', background: active === s ? 'var(--accentDim)' : 'transparent', borderBottom: '1px solid var(--border)', transition: 'all 0.15s' }}>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Content panels */}
        <div>

          {/* ── Appearance ─────────────────────────────────── */}
          {active === 'Appearance' && (
            <Card>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text)', marginBottom: '20px' }}>Appearance</div>

              <FormGroup label="Theme">
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  {[['dark', '🌙 Dark'], ['light', '☀ Light'], ['system', '💻 System']].map(([v, l]) => (
                    <div key={v} onClick={() => { setTheme(v); saveSettings({ theme: v }); }}
                      style={{ flex: 1, padding: '10px', border: `1px solid ${theme === v ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '10px', textAlign: 'center', cursor: 'pointer', fontSize: '13px', color: theme === v ? 'var(--accent)' : 'var(--text2)', background: theme === v ? 'var(--accentDim)' : 'transparent' }}>
                      {l}
                    </div>
                  ))}
                </div>
              </FormGroup>

              <FormGroup label="Accent Color">
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                  {ACCENT_COLORS.map(c => (
                    <div key={c.value} onClick={() => { setAccentColor(c.value); saveSettings({ accentColor: c.value }); }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%', background: c.value,
                        border: accentColor === c.value ? `3px solid var(--text)` : '3px solid transparent',
                        boxShadow: accentColor === c.value ? `0 0 0 2px var(--bg), 0 0 0 4px ${c.value}` : 'none',
                        transition: 'all 0.15s',
                      }} />
                      <span style={{ fontSize: '10px', color: 'var(--text3)' }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </FormGroup>

              <FormGroup label="UI Density">
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  {[['compact', 'Compact'], ['comfortable', 'Comfortable'], ['spacious', 'Spacious']].map(([v, l]) => (
                    <div key={v}
                      style={{ flex: 1, padding: '10px', border: `1px solid ${v === 'comfortable' ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '10px', textAlign: 'center', cursor: 'pointer', fontSize: '13px', color: v === 'comfortable' ? 'var(--accent)' : 'var(--text2)', background: v === 'comfortable' ? 'var(--accentDim)' : 'transparent' }}>
                      {l}
                    </div>
                  ))}
                </div>
              </FormGroup>
            </Card>
          )}

          {/* ── AI Preferences ──────────────────────────────── */}
          {active === 'AI Preferences' && (
            <Card>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text)', marginBottom: '20px' }}>AI Preferences</div>
              <FormGroup label="Response Length">
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  {[['short', 'Short'], ['medium', 'Balanced'], ['detailed', 'Detailed']].map(([v, l]) => (
                    <div key={v} onClick={() => setAiPrefs(p => ({ ...p, responseLength: v }))}
                      style={{ flex: 1, padding: '9px', border: `1px solid ${aiPrefs.responseLength === v ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '8px', textAlign: 'center', cursor: 'pointer', fontSize: '13px', color: aiPrefs.responseLength === v ? 'var(--accent)' : 'var(--text2)', background: aiPrefs.responseLength === v ? 'var(--accentDim)' : 'transparent' }}>
                      {l}
                    </div>
                  ))}
                </div>
              </FormGroup>
              <FormGroup label="AI Personality">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '4px' }}>
                  {[['mentor', '🎓', 'Mentor', 'Friendly and educational'], ['interviewer', '🎯', 'Interviewer', 'Professional and rigorous'], ['reviewer', '⚡', 'Reviewer', 'Direct and critical']].map(([v, icon, l, d]) => (
                    <div key={v} onClick={() => setAiPrefs(p => ({ ...p, aiPersonality: v }))}
                      style={{ padding: '12px', border: `1px solid ${aiPrefs.aiPersonality === v ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '10px', cursor: 'pointer', background: aiPrefs.aiPersonality === v ? 'var(--accentDim)' : 'transparent', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', marginBottom: '6px' }}>{icon}</div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: aiPrefs.aiPersonality === v ? 'var(--accent)' : 'var(--text)' }}>{l}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>{d}</div>
                    </div>
                  ))}
                </div>
              </FormGroup>
              <FormGroup label="Default Interview Role">
                <input className="form-input" value={aiPrefs.defaultInterviewRole} onChange={e => setAiPrefs(p => ({ ...p, defaultInterviewRole: e.target.value }))} />
              </FormGroup>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => saveSettings({ aiResponseLength: aiPrefs.responseLength, aiPersonality: aiPrefs.aiPersonality, defaultInterviewRole: aiPrefs.defaultInterviewRole })} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </Card>
          )}

          {/* ── Security ────────────────────────────────────── */}
          {active === 'Security' && (
            <Card>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text)', marginBottom: '20px' }}>Security</div>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '14px' }}>Change Password</div>
                <FormGroup label="Current Password">
                  <input className="form-input" type="password" placeholder="••••••••" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} />
                </FormGroup>
                <FormGroup label="New Password">
                  <input className="form-input" type="password" placeholder="Min 8 characters" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} />
                </FormGroup>
                <FormGroup label="Confirm New Password">
                  <input className="form-input" type="password" placeholder="Repeat new password" value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} />
                </FormGroup>
                <button className="btn btn-primary btn-sm" onClick={handlePasswordChange} disabled={saving}>
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <ToggleRow name="Two-Factor Authentication" description="Secure your account with 2FA" checked={false} onChange={() => toast('2FA coming soon!')} />
                <ToggleRow name="Login Notifications" description="Get emailed on new logins" checked={true} onChange={() => {}} />
              </div>
              <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg3)', borderRadius: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', marginBottom: '10px' }}>Active Sessions</div>
                {[{ device: 'Chrome on macOS', location: 'San Francisco, CA', current: true }, { device: 'Safari on iPhone', location: 'San Francisco, CA', current: false }].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--text)' }}>{s.device} {s.current && <span className="badge badge-green" style={{ marginLeft: '6px' }}>current</span>}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{s.location}</div>
                    </div>
                    {!s.current && <button className="btn btn-ghost btn-sm">Revoke</button>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ── Notifications ────────────────────────────────── */}
          {active === 'Notifications' && (
            <Card>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>Notifications</div>
              <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '20px' }}>Choose what emails and in-app alerts you receive.</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Email Notifications</div>
              <ToggleRow name="Analysis complete" description="When a resume or code review finishes" checked={notifs.emailAnalysis} onChange={e => setNotifs(p => ({ ...p, emailAnalysis: e.target.checked }))} />
              <ToggleRow name="Interview reminders" description="Daily practice session reminders" checked={notifs.emailInterview} onChange={e => setNotifs(p => ({ ...p, emailInterview: e.target.checked }))} />
              <ToggleRow name="Weekly progress report" description="Your weekly AI usage summary" checked={notifs.weeklyReport} onChange={e => setNotifs(p => ({ ...p, weeklyReport: e.target.checked }))} />
              <ToggleRow name="Product updates" description="New features and announcements" checked={notifs.productUpdates} onChange={e => setNotifs(p => ({ ...p, productUpdates: e.target.checked }))} />
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '16px 0 8px' }}>In-App Notifications</div>
              <ToggleRow name="AI suggestions" description="Proactive tips based on your activity" checked={notifs.inAppSuggestions} onChange={e => setNotifs(p => ({ ...p, inAppSuggestions: e.target.checked }))} />
              <ToggleRow name="Credit warnings" description="Alert when credits fall below 20%" checked={notifs.creditWarnings} onChange={e => setNotifs(p => ({ ...p, creditWarnings: e.target.checked }))} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button className="btn btn-primary" onClick={() => saveSettings({ notifications: notifs })} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Notification Settings'}
                </button>
              </div>
            </Card>
          )}

          {/* ── Integrations ─────────────────────────────────── */}
          {active === 'Integrations' && (
            <Card>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text)', marginBottom: '20px' }}>Integrations</div>
              {[
                { icon: '🐙', name: 'GitHub',   desc: 'Connect to import repos for code review',  connected: true,  username: 'yourusername' },
                { icon: '🔵', name: 'LinkedIn', desc: 'Import your profile to improve resume',     connected: false, username: null },
                { icon: '🦊', name: 'GitLab',   desc: 'Connect GitLab repositories',              connected: false, username: null },
              ].map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{item.connected ? `@${item.username}` : item.desc}</div>
                    </div>
                  </div>
                  {item.connected
                    ? <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', borderColor: 'rgba(248,113,113,0.2)' }}>Disconnect</button>
                    : <button className="btn btn-ghost btn-sm" onClick={() => toast('OAuth integration coming soon!')}>Connect</button>
                  }
                </div>
              ))}
            </Card>
          )}

          {/* ── Account ──────────────────────────────────────── */}
          {active === 'Account' && (
            <div>
              <Card style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text)', marginBottom: '6px' }}>Current Plan</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px' }}>
                  You are on the <strong style={{ color: 'var(--accent)', textTransform: 'capitalize' }}>{user?.plan || 'Free'}</strong> plan
                </div>
                <div style={{ background: 'var(--bg3)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', fontFamily: 'Instrument Serif, serif' }}>Pro — $19/month</div>
                      <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '3px' }}>1,000 credits/mo · Unlimited analyses · Priority AI</div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => toast('Billing integration coming soon!')}>Upgrade</button>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Credits reset on the 1st of each month.</div>
              </Card>
              <Card>
                <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text)', marginBottom: '16px' }}>Account Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={() => toast('Generating data export...')}>
                    📦 Export all my data
                  </button>
                  <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={() => toast('Signed out of all devices')}>
                    🔐 Sign out of all devices
                  </button>
                  <div style={{ height: '1px', background: 'var(--border)' }} />
                  <button className="btn btn-danger" style={{ justifyContent: 'flex-start' }} onClick={() => toast.error('Permanent deletion — are you sure? (Add confirmation dialog in production)')}>
                    🗑 Delete account permanently
                  </button>
                  <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Deleting your account is permanent and cannot be undone. All your data will be removed.</div>
                </div>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
