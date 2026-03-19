import { useState, useEffect } from 'react';
import { useAuth, useTheme } from '../hooks';
import { userService } from '../services';
import api from '../services/api';
import { Icon, IC, PrimaryBtn, GhostBtn } from '../components/ui/Icons';
import toast from 'react-hot-toast';

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
  };
}

const ROLES = [
  { value: 'frontend',  label: 'Frontend'   },
  { value: 'backend',   label: 'Backend'    },
  { value: 'fullstack', label: 'Full-stack' },
  { value: 'devops',    label: 'DevOps'     },
  { value: 'mobile',    label: 'Mobile'     },
];

const PLAN_COLORS = {
  pro:  { bg: 'rgba(16,185,129,0.12)', color: '#059669', border: 'rgba(16,185,129,0.2)' },
  team: { bg: 'rgba(124,58,237,0.12)', color: '#7c3aed', border: 'rgba(124,58,237,0.2)' },
  free: { bg: 'rgba(59,130,246,0.12)', color: '#2563eb', border: 'rgba(59,130,246,0.2)' },
};

const HISTORY = [
  { iconKey: 'resume',    label: 'Resume analyzed',   time: '2h ago',    color: '#6366f1' },
  { iconKey: 'code',      label: 'Code reviewed',     time: '5h ago',    color: '#10b981' },
  { iconKey: 'interview', label: 'Mock interview',    time: 'Yesterday', color: '#f59e0b' },
  { iconKey: 'bug',       label: 'Bug diagnosed',     time: '2d ago',    color: '#ef4444' },
];

function Card({ children, style = {} }) {
  const T = useT();
  return (
    <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: '14px', padding: 'clamp(14px,2.5vw,20px)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: T.shadow, ...style }}>
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  const T = useT();
  return <div style={{ fontSize: '11px', fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>{children}</div>;
}

function Input({ value, onChange, placeholder, onKeyDown, style = {} }) {
  const T = useT();
  return (
    <input value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown}
      style={{ width: '100%', padding: '10px 13px', background: T.inputBg, border: `1px solid ${T.inputBrd}`, borderRadius: '9px', color: T.text1, fontSize: '13px', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', minHeight: 44, ...style }}
      onFocus={e => e.target.style.borderColor = '#10b981'}
      onBlur={e => e.target.style.borderColor = T.inputBrd} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  const T = useT();
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{ width: '100%', padding: '10px 13px', background: T.inputBg, border: `1px solid ${T.inputBrd}`, borderRadius: '9px', color: T.text1, fontSize: '13px', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', resize: 'vertical', lineHeight: 1.6 }}
      onFocus={e => e.target.style.borderColor = '#10b981'}
      onBlur={e => e.target.style.borderColor = T.inputBrd} />
  );
}

function ProgressBar({ value, max = 100, color = '#10b981' }) {
  const T = useT();
  return (
    <div style={{ height: 5, background: T.trackBg, borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(100, Math.round((value / max) * 100))}%`, background: color, borderRadius: 3, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
    </div>
  );
}

export default function Profile() {
  const T = useT();
const { user, fetchMe } = useAuth();
const [stats, setStats] = useState({
  totalAnalyses: 0,
  avgResumeScore: 0,
  interviewsDone: 0,
});

useEffect(() => {
  const fetchStats = async () => {
    try {
      const [resumes, interviews] = await Promise.all([
        api.get('/resume'),
        api.get('/interview'),
      ]);

      const resumeList = resumes.data.data || [];
      const interviewList = interviews.data.data || [];

      const avgScore = resumeList.length
        ? Math.round(resumeList.reduce((sum, r) => sum + (r.analysis?.atsScore || 0), 0) / resumeList.length)
        : 0;

      setStats({
        totalAnalyses: resumeList.length,
        avgResumeScore: avgScore,
        interviewsDone: interviewList.length,
      });
    } catch {}
  };
  fetchStats();
}, []);
  const [form, setForm]    = useState({ name: '', bio: '', role: 'fullstack', skills: [] });
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name||'', bio: user.bio||'', role: user.role||'fullstack', skills: user.skills||[] });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try { await userService.updateProfile(form); await fetchMe(); toast.success('Profile updated!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
    finally { setSaving(false); }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !form.skills.includes(s)) { setForm(p => ({...p, skills:[...p.skills,s]})); setNewSkill(''); }
  };
  const removeSkill = s => setForm(p => ({...p, skills:p.skills.filter(x=>x!==s)}));

  const initials  = user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()||'U';
  const plan      = user?.plan || 'free';
  const planStyle = PLAN_COLORS[plan] || PLAN_COLORS.free;
  const credits   = user?.credits ?? 0;

  return (
    <>
      <style>{`
        @keyframes pf-fadeup { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none} }
        .pf-anim { animation: pf-fadeup 0.35s ease both; }
        .pf-stats  { display:grid; grid-template-columns:repeat(2,1fr); gap:clamp(8px,2vw,12px); margin-bottom:clamp(16px,3vw,24px); }
        .pf-grid   { display:grid; grid-template-columns:1fr; gap:clamp(12px,2vw,20px); align-items:start; }
        .pf-roles  { display:flex; flex-wrap:wrap; gap:8px; }
        @media(min-width:640px)  { .pf-stats { grid-template-columns:repeat(3,1fr); } }
        @media(min-width:1024px) { .pf-stats { grid-template-columns:repeat(4,1fr); } .pf-grid { grid-template-columns:minmax(0,1fr) minmax(0,1.4fr); } }
        .skill-tag { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:12px; background:rgba(16,185,129,0.1); color:#059669; border:1px solid rgba(16,185,129,0.2); font-family:'DM Sans',sans-serif; }
        .skill-rm  { cursor:pointer; opacity:0.6; display:flex; transition:opacity 0.15s; }
        .skill-rm:hover { opacity:1; }
        .role-chip { display:flex; align-items:center; gap:7px; padding:8px 14px; border-radius:9px; cursor:pointer; font-size:13px; transition:all 0.15s; user-select:none; min-height:40px; font-family:'DM Sans',sans-serif; }
      `}</style>

      <div className="pf-anim">
        {/* ── Page Header ── */}
        <div style={{ marginBottom: 'clamp(16px,3vw,28px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <div style={{ width: 38, height: 38, borderRadius: '11px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon d={IC.user} size={18} color="#6366f1" />
            </div>
            <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(20px,3vw,26px)', color: T.text1, fontWeight: 400, margin: 0 }}>Profile</h1>
          </div>
          <p style={{ fontSize: 'clamp(12px,1.5vw,13px)', color: T.text3, marginLeft: '48px', fontFamily: 'DM Sans, sans-serif' }}>Manage your account and personal information</p>
        </div>

        {/* ── Stats ── */}
        <div className="pf-stats">
          {[
           { iconKey:'resume',    label:'Total analyses',  value: stats.totalAnalyses, delta:'Since joining', color:'#2563eb' },
{ iconKey:'star',      label:'Avg resume score', value: stats.avgResumeScore || '—', delta: stats.avgResumeScore ? 'ATS score avg' : 'No analyses yet', color:'#059669' },
{ iconKey:'interview', label:'Interviews done',  value: stats.interviewsDone, delta: stats.interviewsDone > 0 ? `${stats.interviewsDone} sessions` : 'No sessions yet', color:'#d97706' },
          ].map(s => (
            <Card key={s.label} style={{ padding: 'clamp(12px,2vw,16px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '8px', background: `${s.color}15`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon d={IC[s.iconKey]} size={13} color={s.color} />
                </div>
                <div style={{ fontSize: '10px', color: T.text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
              </div>
              <div style={{ fontSize: 'clamp(20px,3vw,24px)', fontWeight: 700, color: T.text1, fontFamily: 'DM Sans, sans-serif', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: T.accentTxt, marginTop: '5px', fontFamily: 'DM Sans, sans-serif' }}>{s.delta}</div>
            </Card>
          ))}
          {/* Credits card */}
          <Card style={{ padding: 'clamp(12px,2vw,16px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d={IC.bolt} size={13} color="#7c3aed" />
              </div>
              <div style={{ fontSize: '10px', color: T.text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'DM Sans, sans-serif' }}>Credits remaining</div>
            </div>
            <div style={{ fontSize: 'clamp(20px,3vw,24px)', fontWeight: 700, color: T.text1, fontFamily: 'DM Sans, sans-serif', lineHeight: 1, marginBottom: '6px' }}>{credits}</div>
            <ProgressBar value={credits} max={1000} color="#7c3aed" />
            <div style={{ fontSize: '11px', color: T.text3, marginTop: '4px', textTransform: 'capitalize', fontFamily: 'DM Sans, sans-serif' }}>{plan} plan</div>
          </Card>
        </div>

        {/* ── Main grid ── */}
        <div className="pf-grid">

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px,2vw,16px)' }}>
            {/* Avatar card */}
            <Card style={{ textAlign: 'center' }}>
              <div style={{ width: 'clamp(64px,10vw,80px)', height: 'clamp(64px,10vw,80px)', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(22px,4vw,28px)', fontWeight: 700, color: '#fff', margin: '0 auto clamp(10px,2vw,14px)', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 8px 24px rgba(99,102,241,0.35)', letterSpacing: '0.03em' }}>
                {initials}
              </div>
              <div style={{ fontSize: 'clamp(16px,2.5vw,18px)', fontWeight: 600, color: T.text1, fontFamily: 'Instrument Serif, serif' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '13px', color: T.text3, marginTop: '3px', textTransform: 'capitalize', fontFamily: 'DM Sans, sans-serif' }}>
                {(user?.role || 'fullstack').replace('-',' ')} Developer
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize', background: planStyle.bg, color: planStyle.color, border: `1px solid ${planStyle.border}`, fontFamily: 'DM Sans, sans-serif' }}>
                  {plan} plan
                </span>
              </div>
              {/* Credits bar */}
              <div style={{ marginTop: '16px', padding: 'clamp(8px,1.5vw,10px)', background: T.surface, borderRadius: '9px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: T.text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'DM Sans, sans-serif' }}>
                    <Icon d={IC.bolt} size={11} color={T.text3} /> Credits
                  </div>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>{Math.round((credits/1000)*100)}%</div>
                </div>
                <ProgressBar value={credits} max={1000} />
                <div style={{ fontSize: '11px', color: T.text3, marginTop: '5px', fontFamily: 'DM Sans, sans-serif' }}>{credits} / 1,000 remaining</div>
              </div>
              {user?.email && <div style={{ marginTop: '12px', fontSize: '12px', color: T.text3, wordBreak: 'break-all', fontFamily: 'DM Sans, sans-serif' }}>{user.email}</div>}
            </Card>

            {/* Activity */}
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
                <Icon d={IC.activity} size={14} color={T.text3} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: T.text1, fontFamily: 'DM Sans, sans-serif' }}>Recent Activity</span>
              </div>
              {HISTORY.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: i < HISTORY.length-1 ? `1px solid ${T.divider}` : 'none', minHeight: 40 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '8px', background: `${item.color}14`, border: `1px solid ${item.color}24`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon d={IC[item.iconKey]} size={13} color={item.color} />
                  </div>
                  <span style={{ flex: 1, fontSize: '13px', color: T.text2, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif' }}>{item.label}</span>
                  <span style={{ fontSize: '11px', color: T.text3, flexShrink: 0, fontFamily: 'DM Sans, sans-serif' }}>{item.time}</span>
                </div>
              ))}
            </Card>
          </div>

          {/* Edit form */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
              <Icon d={IC.edit} size={14} color={T.text3} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: T.text1, fontFamily: 'DM Sans, sans-serif' }}>Edit Profile</span>
            </div>

            <div style={{ marginBottom: 'clamp(12px,2vw,16px)' }}>
              <FieldLabel>Full Name</FieldLabel>
              <Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name" />
            </div>

            <div style={{ marginBottom: 'clamp(12px,2vw,16px)' }}>
              <FieldLabel>Bio</FieldLabel>
              <Textarea rows={3} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="Tell us about yourself..." />
            </div>

            <div style={{ marginBottom: 'clamp(12px,2vw,16px)' }}>
              <FieldLabel>I am a...</FieldLabel>
              <div className="pf-roles">
                {ROLES.map(r => (
                  <div key={r.value} className="role-chip" onClick={() => setForm({...form,role:r.value})}
                    style={{ border: `1px solid ${form.role===r.value?'#10b981':T.border}`, color: form.role===r.value?'#10b981':T.text2, background: form.role===r.value?'rgba(16,185,129,0.1)':'transparent' }}>
                    {form.role===r.value && <Icon d={IC.check} size={12} color="#10b981" />}
                    {r.label}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 'clamp(16px,2vw,20px)' }}>
              <FieldLabel>Skills</FieldLabel>
              {form.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {form.skills.map(s => (
                    <span key={s} className="skill-tag">
                      {s}
                      <span className="skill-rm" onClick={()=>removeSkill(s)}><Icon d={IC.close} size={10} color="#059669" /></span>
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input value={newSkill} onChange={e=>setNewSkill(e.target.value)} placeholder="Add a skill (e.g. React)" style={{ flex: 1 }}
                  onKeyDown={e=>e.key==='Enter'&&addSkill()} />
                <GhostBtn onClick={addSkill} style={{ minHeight: 44, padding: '0 16px', flexShrink: 0 }}>
                  <Icon d={IC.plus} size={14} color="currentColor" />
                  Add
                </GhostBtn>
              </div>
              <div style={{ fontSize: '11px', color: T.text3, marginTop: '5px', fontFamily: 'DM Sans, sans-serif' }}>Press Enter or click Add</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <PrimaryBtn onClick={handleSave} loading={saving} icon={<Icon d={IC.check} size={14} color="#fff" />} style={{ width: 'auto', minWidth: '140px' }}>
                Save Changes
              </PrimaryBtn>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}