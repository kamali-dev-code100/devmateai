import { useState, useEffect } from 'react';
import { useAuth } from '../hooks';
import { PageHeader, Card, FormGroup, StatCard } from '../components/ui';
import { userService } from '../services';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, fetchMe } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', role: 'fullstack', skills: [] });
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        role: user.role || 'fullstack',
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateProfile(form);
      await fetchMe();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const ROLES = [
    { value: 'frontend',  label: 'Frontend' },
    { value: 'backend',   label: 'Backend' },
    { value: 'fullstack', label: 'Full-stack' },
    { value: 'devops',    label: 'DevOps' },
    { value: 'mobile',    label: 'Mobile' },
  ];

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your account and personal information" />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <StatCard label="Total analyses"    value="142"              delta="Since joining" deltaColor="var(--text3)" />
        <StatCard label="Avg resume score"  value="84"               delta="+6 pts this month" />
        <StatCard label="Interviews done"   value="14"               delta="3 completed" />
        <StatCard label="Credits remaining" value={user?.credits ?? 0} delta={`${user?.plan || 'free'} plan`} deltaColor="var(--text3)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px' }}>

        {/* Avatar + basic info */}
        <div>
          <Card style={{ marginBottom: '16px', textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: 700, color: 'white',
              margin: '0 auto 14px',
              fontFamily: 'Instrument Serif, serif',
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', fontFamily: 'Instrument Serif, serif' }}>{user?.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '4px', textTransform: 'capitalize' }}>{user?.role?.replace('-', ' ')} Developer</div>
            <div style={{ marginTop: '8px' }}>
              <span className={`badge ${user?.plan === 'pro' ? 'badge-green' : user?.plan === 'team' ? 'badge-purple' : 'badge-blue'}`} style={{ textTransform: 'capitalize' }}>
                {user?.plan || 'free'} plan
              </span>
            </div>
            <div style={{ marginTop: '16px', padding: '10px', background: 'var(--bg3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '4px' }}>CREDITS</div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(100, ((user?.credits || 0) / 1000) * 100)}%` }} /></div>
              <div style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '4px' }}>{user?.credits ?? 0} remaining</div>
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '14px' }}>Session History</div>
            {[
              { icon: '📄', label: 'Resume analyzed', time: '2h ago', color: '#6366f1' },
              { icon: '⚡', label: 'Code reviewed',   time: '5h ago', color: 'var(--accent)' },
              { icon: '🎯', label: 'Mock interview',  time: 'Yesterday', color: 'var(--amber)' },
              { icon: '🔍', label: 'Bug diagnosed',   time: '2d ago', color: 'var(--red)' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span style={{ flex: 1, fontSize: '13px', color: 'var(--text2)' }}>{item.label}</span>
                <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{item.time}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Edit form */}
        <Card>
          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '18px' }}>Edit Profile</div>

          <FormGroup label="Full Name">
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </FormGroup>

          <FormGroup label="Bio">
            <textarea className="form-input" rows={3} placeholder="Tell us about yourself..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </FormGroup>

          <FormGroup label="I am a...">
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {ROLES.map(r => (
                <div key={r.value} onClick={() => setForm({ ...form, role: r.value })}
                  style={{ padding: '7px 14px', border: `1px solid ${form.role === r.value ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: form.role === r.value ? 'var(--accent)' : 'var(--text2)', background: form.role === r.value ? 'var(--accentDim)' : 'transparent', transition: 'all 0.15s' }}>
                  {r.label}
                </div>
              ))}
            </div>
          </FormGroup>

          <FormGroup label="Skills">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {form.skills.map(s => (
                <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: 'var(--accentDim)', color: 'var(--accent)', border: '1px solid rgba(110,231,183,0.2)' }}>
                  {s}
                  <span onClick={() => removeSkill(s)} style={{ cursor: 'pointer', opacity: 0.6, fontWeight: 700 }}>×</span>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input className="form-input" placeholder="Add a skill (e.g. React)" value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()} style={{ flex: 1 }} />
              <button className="btn btn-ghost btn-sm" onClick={addSkill}>Add</button>
            </div>
          </FormGroup>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <><span className="spinner" style={{ width: '13px', height: '13px' }} /> Saving...</> : 'Save Changes'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
