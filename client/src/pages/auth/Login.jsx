// ─── Login.jsx ────────────────────────────────────────────────
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks';
import toast from 'react-hot-toast';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your DevMate account">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <SocialBtn icon="🐙" label="Continue with GitHub" />
          <SocialBtn icon="🔵" label="Continue with Google" />
        </div>
        <Divider />
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--accent)', cursor: 'pointer' }}>Forgot password?</span>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px' }} disabled={isLoading}>
          {isLoading ? <><span className="spinner" style={{ width: '14px', height: '14px' }} /> Signing in...</> : 'Sign in'}
        </button>
        <p style={{ fontSize: '13px', color: 'var(--text3)', textAlign: 'center', marginTop: '18px' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent)' }}>Create one free</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// ─── Register.jsx ─────────────────────────────────────────────
export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'fullstack' });
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    const result = await register(form);
    if (result.success) {
      toast.success('Account created! Welcome to DevMate 🚀');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const ROLES = [
    { value: 'frontend',  label: 'Frontend' },
    { value: 'backend',   label: 'Backend' },
    { value: 'fullstack', label: 'Full-stack' },
    { value: 'devops',    label: 'DevOps' },
  ];

  return (
    <AuthLayout title="Create your account" subtitle="Start your AI developer journey today">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <SocialBtn icon="🐙" label="Sign up with GitHub" />
          <SocialBtn icon="🔵" label="Sign up with Google" />
        </div>
        <Divider />
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">Full Name</label>
          <input className="form-input" placeholder="Jay Dev"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Min 8 characters"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label className="form-label">I am a...</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
            {ROLES.map(r => (
              <div key={r.value}
                onClick={() => setForm({ ...form, role: r.value })}
                style={{ padding: '7px 14px', border: `1px solid ${form.role === r.value ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: form.role === r.value ? 'var(--accent)' : 'var(--text2)', background: form.role === r.value ? 'var(--accentDim)' : 'transparent', transition: 'all 0.15s' }}>
                {r.label}
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px' }} disabled={isLoading}>
          {isLoading ? <><span className="spinner" style={{ width: '14px', height: '14px' }} /> Creating account...</> : "Create account — it's free"}
        </button>
        <p style={{ fontSize: '11px', color: 'var(--text3)', textAlign: 'center', marginTop: '12px' }}>
          By signing up you agree to our Terms &amp; Privacy Policy
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text3)', textAlign: 'center', marginTop: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// ─── Shared auth components ───────────────────────────────────
function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div style={{ width: '42px', height: '42px', background: 'var(--accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="var(--bg)"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
        </div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '26px', textAlign: 'center', color: 'var(--text)', marginBottom: '6px' }}>{title}</h1>
        <p style={{ fontSize: '14px', textAlign: 'center', color: 'var(--text2)', marginBottom: '28px' }}>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

function SocialBtn({ icon, label }) {
  return (
    <button type="button" style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '9px', background: 'var(--bg3)', color: 'var(--text)', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
      <span>{icon}</span> {label}
    </button>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      <span style={{ fontSize: '12px', color: 'var(--text3)' }}>or continue with email</span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  );
}

export default Login;
