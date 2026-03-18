import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useTheme } from '../hooks';
import toast from 'react-hot-toast';

// ── Icons ─────────────────────────────────────────────────────
const EyeOn  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const GithubIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>;
const GoogleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
const ArrowLeft = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const CheckIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>;
const ShieldIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

// ── Animated background blobs ─────────────────────────────────
function BlobBg() {
  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', zIndex:0 }}>
      {/* Deep dark base */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(16,185,129,0.12),transparent 60%),radial-gradient(ellipse 60% 80% at 100% 100%,rgba(99,102,241,0.1),transparent 60%),radial-gradient(ellipse 60% 60% at 0% 100%,rgba(8,145,178,0.08),transparent 60%),#050812' }} />

      {/* Animated blobs */}
      <div style={{ position:'absolute', top:'-15%', left:'-10%', width:'55vw', height:'55vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.18),rgba(8,145,178,0.08) 50%,transparent 70%)', animation:'authBlob1 18s ease-in-out infinite', filter:'blur(50px)' }} />
      <div style={{ position:'absolute', top:'10%', right:'-15%', width:'50vw', height:'50vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.15),rgba(139,92,246,0.08) 50%,transparent 70%)', animation:'authBlob2 22s ease-in-out infinite', filter:'blur(60px)' }} />
      <div style={{ position:'absolute', bottom:'-20%', left:'20%', width:'45vw', height:'45vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.12),rgba(16,185,129,0.06) 50%,transparent 70%)', animation:'authBlob3 26s ease-in-out infinite', filter:'blur(55px)' }} />
      <div style={{ position:'absolute', bottom:'15%', right:'10%', width:'30vw', height:'30vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(6,182,212,0.1),transparent 70%)', animation:'authBlob1 20s ease-in-out infinite reverse', filter:'blur(45px)' }} />

      {/* Subtle grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(16,185,129,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.03) 1px,transparent 1px)', backgroundSize:'48px 48px', maskImage:'radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)' }} />

      {/* Floating AI particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: i%3===0 ? 3 : i%3===1 ? 2 : 1.5,
          height: i%3===0 ? 3 : i%3===1 ? 2 : 1.5,
          borderRadius: '50%',
          background: i%2===0 ? 'rgba(16,185,129,0.7)' : 'rgba(99,102,241,0.6)',
          left: `${10+i*12}%`,
          top: `${15+i*10}%`,
          animation: `particle${i%3+1} ${8+i*2}s ease-in-out infinite ${i*0.7}s`,
          filter: 'blur(0.5px)',
          boxShadow: i%2===0 ? '0 0 6px rgba(16,185,129,0.8)' : '0 0 6px rgba(99,102,241,0.8)',
        }} />
      ))}
    </div>
  );
}

// ── Floating input with label ─────────────────────────────────
function FloatInput({ label, type='text', value, onChange, error, right, autoFocus }) {
  const [focused, setFocused] = useState(false);
  const hasVal = value.length > 0;
  const isUp = focused || hasVal;

  const borderCol = error ? '#ef4444' : focused ? '#10b981' : 'rgba(255,255,255,0.1)';
  const glowCol   = error ? 'rgba(239,68,68,0.25)' : focused ? 'rgba(16,185,129,0.25)' : 'transparent';

  return (
    <div style={{ position:'relative', marginBottom: error ? '6px' : '18px' }}>
      {/* Floating label */}
      <label style={{
        position:'absolute', left:14,
        top: isUp ? 6 : '50%',
        transform: isUp ? 'none' : 'translateY(-50%)',
        fontSize: isUp ? '10px' : '14px',
        fontWeight: isUp ? 600 : 400,
        color: error ? '#ef4444' : focused ? '#10b981' : 'rgba(255,255,255,0.35)',
        transition:'all 0.18s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents:'none', zIndex:1,
        letterSpacing: isUp ? '0.06em' : 'normal',
        textTransform: isUp ? 'uppercase' : 'none',
        fontFamily:'DM Sans, sans-serif',
      }}>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width:'100%', height:54,
          padding: isUp ? '20px 44px 8px 14px' : '0 44px 0 14px',
          background:'rgba(255,255,255,0.05)',
          border:`1px solid ${borderCol}`,
          borderRadius:'12px',
          color:'#fff', fontSize:'14px',
          outline:'none', transition:'all 0.2s',
          boxSizing:'border-box',
          fontFamily:'DM Sans, sans-serif',
          boxShadow: focused ? `0 0 0 3px ${glowCol}` : 'none',
        }}
      />

      {/* Right slot (eye icon etc.) */}
      {right && (
        <div style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', display:'flex' }}>
          {right}
        </div>
      )}

      {/* Error */}
      {error && (
        <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
          style={{ fontSize:'11px', color:'#ef4444', margin:'4px 0 10px 2px', fontFamily:'DM Sans, sans-serif' }}>
          {error}
        </motion.p>
      )}
    </div>
  );
}

// ── Password strength bar ─────────────────────────────────────
function PwStrength({ pw }) {
  if (!pw) return null;
  const checks = [pw.length>=8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  const score = checks.filter(Boolean).length;
  const cols = ['#ef4444','#f59e0b','#10b981','#10b981'];
  const labels = ['Weak','Fair','Strong','Very strong'];
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:'flex', gap:3, marginBottom:4 }}>
        {[0,1,2,3].map(i => (
          <motion.div key={i} initial={{ scaleX:0 }} animate={{ scaleX: i<score ? 1 : 0 }}
            transition={{ duration:0.25, delay:i*0.06 }}
            style={{ flex:1, height:3, borderRadius:2, background:i<score?cols[score-1]:'rgba(255,255,255,0.1)', transformOrigin:'left' }} />
        ))}
      </div>
      {score>0 && <span style={{ fontSize:'10px', color:cols[score-1], fontWeight:600, fontFamily:'DM Sans, sans-serif', letterSpacing:'0.04em' }}>{labels[score-1]}</span>}
    </div>
  );
}

// ── Main Auth Page ────────────────────────────────────────────
export default function AuthPage() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const { login, register } = useAuth();

  const [tab, setTab]     = useState(params.get('tab') === 'register' ? 'register' : 'login');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  // Login fields
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPw,   setShowPw]   = useState(false);

  // Register fields
  const [name,     setName]     = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPw,    setRegPw]    = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showRPw,  setShowRPw]  = useState(false);
  const [showCPw,  setShowCPw]  = useState(false);
  const [role,     setRole]     = useState('fullstack');

  const ROLES = ['Frontend','Backend','Full-stack','DevOps','Mobile'];

  const switchTab = (t) => {
    if (t === tab) return;
    setErrors({});
    setTab(t);
  };

  // ── Validation ──────────────────────────────────────────────
  const vLogin = () => {
    const e = {};
    if (!email)                              e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email))   e.email = 'Enter a valid email';
    if (!password)                           e.password = 'Password is required';
    setErrors(e); return !Object.keys(e).length;
  };
  const vReg = () => {
    const e = {};
    if (!name.trim())                        e.name = 'Full name is required';
    if (!regEmail)                           e.regEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(regEmail))e.regEmail = 'Enter a valid email';
    if (!regPw)                              e.regPw = 'Password is required';
    else if (regPw.length < 8)              e.regPw = 'Minimum 8 characters';
    if (regPw !== confirm)                  e.confirm = "Passwords don't match";
    setErrors(e); return !Object.keys(e).length;
  };

  // ── Handlers ────────────────────────────────────────────────
  const doLogin = async (e) => {
    e.preventDefault();
    if (!vLogin()) return;
    setLoading(true);
    const r = await login(email, password);
    setLoading(false);
    if (r.success) { toast.success('Welcome back! 👋'); navigate('/dashboard'); }
    else toast.error(r.message || 'Login failed');
  };

  const doRegister = async (e) => {
    e.preventDefault();
    if (!vReg()) return;
    setLoading(true);
    const r = await register({ name, email:regEmail, password:regPw, role:role.toLowerCase().replace('-','') });
    setLoading(false);
    if (r.success) { toast.success('Welcome to DevMate AI! 🚀'); navigate('/dashboard'); }
    else toast.error(r.message || 'Registration failed');
  };

  const EyeBtn = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle}
      style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)', padding:0, display:'flex', transition:'color 0.15s' }}
      onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.7)'}
      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}>
      {show ? <EyeOff /> : <EyeOn />}
    </button>
  );

  // ── Animation variants ──────────────────────────────────────
  const slideVariants = {
    enterRight: { x:40, opacity:0 },
    enterLeft:  { x:-40, opacity:0 },
    center:     { x:0, opacity:1, transition:{ duration:0.32, ease:[0.22,1,0.36,1] } },
    exitLeft:   { x:-40, opacity:0, transition:{ duration:0.22, ease:'easeIn' } },
    exitRight:  { x:40, opacity:0, transition:{ duration:0.22, ease:'easeIn' } },
  };

  const [slideDir, setSlideDir] = useState('right');
  const handleTabSwitch = (t) => {
    setSlideDir(t === 'register' ? 'right' : 'left');
    switchTab(t);
  };

  return (
    <>
      <style>{`
        @keyframes authBlob1  { 0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-20px) scale(1.06)} }
        @keyframes authBlob2  { 0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-20px,25px) scale(1.04)} }
        @keyframes authBlob3  { 0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,15px) scale(1.07)} }
        @keyframes particle1  { 0%,100%{transform:translate(0,0) scale(1);opacity:0.7}50%{transform:translate(12px,-18px) scale(1.3);opacity:1} }
        @keyframes particle2  { 0%,100%{transform:translate(0,0) scale(1);opacity:0.5}50%{transform:translate(-15px,12px) scale(0.8);opacity:0.9} }
        @keyframes particle3  { 0%,100%{transform:translate(0,0) scale(1);opacity:0.6}50%{transform:translate(8px,20px) scale(1.2);opacity:1} }
        @keyframes logoGlow   { 0%,100%{box-shadow:0 0 16px rgba(16,185,129,0.5),0 0 32px rgba(16,185,129,0.2)}50%{box-shadow:0 0 32px rgba(16,185,129,0.9),0 0 60px rgba(16,185,129,0.35),0 0 90px rgba(8,145,178,0.2)} }
        @keyframes borderGlow { 0%,100%{opacity:0.5}50%{opacity:1} }
        @keyframes spin       { to{transform:rotate(360deg)} }
        @keyframes pulse      { 0%,100%{opacity:1}50%{opacity:0.35} }
        @keyframes fadeSlideUp{ from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none} }

        * { -webkit-tap-highlight-color: transparent; }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 100px rgba(16,24,40,0.95) inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff;
        }

        .social-btn:hover { background: rgba(255,255,255,0.09) !important; border-color: rgba(255,255,255,0.18) !important; transform: translateY(-1px); }
        .social-btn { transition: all 0.18s; }
        .role-chip { transition: all 0.15s; cursor: pointer; user-select: none; }
        .role-chip:hover { border-color: rgba(16,185,129,0.5) !important; }
        .tab-btn { transition: all 0.2s; cursor: pointer; }
        .back-btn:hover { color: rgba(255,255,255,0.8) !important; transform: translateX(-2px); }
        .back-btn { transition: all 0.18s; }

        @media(max-width:480px) {
          .auth-card { padding: 28px 20px !important; }
        }
      `}</style>

      <BlobBg />

      {/* Full page layout */}
      <div style={{ position:'relative', zIndex:1, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,40px) 16px' }}>

        {/* Back to home */}
        <motion.button
          initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }}
          onClick={() => navigate('/')} className="back-btn"
          style={{ position:'fixed', top:24, left:24, display:'flex', alignItems:'center', gap:'7px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'8px 14px', color:'rgba(255,255,255,0.5)', fontSize:'13px', fontWeight:500, cursor:'pointer', backdropFilter:'blur(10px)', fontFamily:'DM Sans, sans-serif' }}>
          <ArrowLeft /> Back
        </motion.button>

        {/* ── The Card ── */}
        <motion.div
          initial={{ opacity:0, y:32, scale:0.97 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
          style={{ width:'100%', maxWidth:'440px', position:'relative' }}>

          {/* Glow border effect */}
          <div style={{
            position:'absolute', inset:-1,
            borderRadius:'25px',
            background:'linear-gradient(135deg,rgba(16,185,129,0.5),rgba(99,102,241,0.3),rgba(8,145,178,0.4),rgba(16,185,129,0.3))',
            backgroundSize:'400% 400%',
            animation:'borderGlow 4s ease-in-out infinite',
            filter:'blur(1px)',
            zIndex:-1,
          }} />

          {/* Card body */}
          <div className="auth-card" style={{
            background:'rgba(8,10,22,0.88)',
            backdropFilter:'blur(32px)',
            WebkitBackdropFilter:'blur(32px)',
            borderRadius:'24px',
            border:'1px solid rgba(255,255,255,0.08)',
            padding:'clamp(28px,5vw,40px)',
            boxShadow:'0 40px 100px rgba(0,0,0,0.6)',
            overflow:'hidden',
          }}>

            {/* ── Logo & Brand ── */}
            <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
              style={{ textAlign:'center', marginBottom:'28px' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                <div style={{
                  width:40, height:40,
                  background:'linear-gradient(135deg,#10b981,#0891b2)',
                  borderRadius:'12px',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  animation:'logoGlow 3s ease-in-out infinite',
                  flexShrink:0,
                }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontFamily:'Instrument Serif, serif', fontSize:'20px', color:'#fff', lineHeight:1 }}>DevMate AI</div>
                  <div style={{ fontSize:'9px', fontWeight:700, color:'#10b981', letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:'DM Sans, sans-serif', marginTop:2 }}>Developer Intelligence</div>
                </div>
              </div>

              {/* Live badge */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'3px 10px', borderRadius:'20px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', fontSize:'11px', fontWeight:500, color:'rgba(110,231,183,0.8)', fontFamily:'DM Sans, sans-serif' }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:'#10b981', display:'inline-block', animation:'pulse 2s infinite' }} />
                24k+ developers active
              </div>
            </motion.div>

            {/* ── Tab switcher ── */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
              style={{ display:'flex', background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:4, marginBottom:'28px', border:'1px solid rgba(255,255,255,0.07)' }}>
              {[['login','Sign In'],['register','Sign Up']].map(([t,l]) => (
                <div key={t} className="tab-btn" onClick={() => handleTabSwitch(t)}
                  style={{ flex:1, textAlign:'center', padding:'9px', borderRadius:'9px', fontSize:'13px', fontWeight:600, fontFamily:'DM Sans, sans-serif', color:tab===t?'#fff':'rgba(255,255,255,0.38)', background:tab===t?'rgba(255,255,255,0.1)':'transparent', boxShadow:tab===t?'0 1px 8px rgba(0,0,0,0.3)':'none', position:'relative', overflow:'hidden' }}>
                  {tab===t && (
                    <motion.div layoutId="tabIndicator"
                      style={{ position:'absolute', inset:0, borderRadius:'9px', background:'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(8,145,178,0.15))', border:'1px solid rgba(16,185,129,0.25)' }}
                      transition={{ duration:0.25, ease:[0.22,1,0.36,1] }} />
                  )}
                  <span style={{ position:'relative', zIndex:1 }}>{l}</span>
                </div>
              ))}
            </motion.div>

            {/* ── Social logins ── */}
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
              style={{ display:'flex', gap:8, marginBottom:20 }}>
              {[{Icon:GithubIcon,label:'GitHub',prov:'github'},{Icon:GoogleIcon,label:'Google',prov:'google'}].map(({Icon,label,prov}) => (
                <button key={prov} className="social-btn"
                  onClick={() => window.location.href=`http://localhost:5000/api/auth/${prov}`}
                  style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px 14px', borderRadius:'11px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.8)', fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>
                  <Icon />{label}
                </button>
              ))}
            </motion.div>

            {/* Divider */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
              style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.25)', fontWeight:500, fontFamily:'DM Sans, sans-serif', whiteSpace:'nowrap' }}>or continue with email</span>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
            </motion.div>

            {/* ── Form ── */}
            <AnimatePresence mode="wait">
              {tab === 'login' ? (
                <motion.form key="login" onSubmit={doLogin} noValidate
                  initial={{ x: slideDir==='right'?-30:30, opacity:0 }}
                  animate={{ x:0, opacity:1 }}
                  exit={{ x: slideDir==='right'?30:-30, opacity:0 }}
                  transition={{ duration:0.28, ease:[0.22,1,0.36,1] }}>

                  <div style={{ marginBottom:4 }}>
                    <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6, fontFamily:'DM Sans, sans-serif' }}>Email address</div>
                    <div style={{ position:'relative' }}>
                      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" autoFocus
                        style={{ width:'100%', height:48, padding:'0 14px', background:'rgba(255,255,255,0.05)', border:`1px solid ${errors.email?'#ef4444':'rgba(255,255,255,0.1)'}`, borderRadius:'11px', color:'#fff', fontSize:'14px', outline:'none', transition:'all 0.2s', boxSizing:'border-box', fontFamily:'DM Sans, sans-serif', boxShadow:errors.email?'0 0 0 3px rgba(239,68,68,0.2)':'' }}
                        onFocus={e=>{ e.target.style.borderColor=errors.email?'#ef4444':'#10b981'; e.target.style.boxShadow=errors.email?'0 0 0 3px rgba(239,68,68,0.2)':'0 0 0 3px rgba(16,185,129,0.2)'; }}
                        onBlur={e=>{ e.target.style.borderColor=errors.email?'#ef4444':'rgba(255,255,255,0.1)'; e.target.style.boxShadow=errors.email?'0 0 0 3px rgba(239,68,68,0.15)':'none'; }} />
                    </div>
                    {errors.email && <p style={{ fontSize:'11px', color:'#ef4444', margin:'4px 0 0 2px', fontFamily:'DM Sans, sans-serif' }}>{errors.email}</p>}
                  </div>

                  <div style={{ marginTop:14, marginBottom:4 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                      <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:'DM Sans, sans-serif' }}>Password</div>
                      <span style={{ fontSize:'12px', color:'#10b981', cursor:'pointer', fontWeight:500, fontFamily:'DM Sans, sans-serif', transition:'opacity 0.15s' }}
                        onMouseEnter={e=>e.target.style.opacity='0.7'} onMouseLeave={e=>e.target.style.opacity='1'}>Forgot password?</span>
                    </div>
                    <div style={{ position:'relative' }}>
                      <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password"
                        style={{ width:'100%', height:48, padding:'0 44px 0 14px', background:'rgba(255,255,255,0.05)', border:`1px solid ${errors.password?'#ef4444':'rgba(255,255,255,0.1)'}`, borderRadius:'11px', color:'#fff', fontSize:'14px', outline:'none', transition:'all 0.2s', boxSizing:'border-box', fontFamily:'DM Sans, sans-serif' }}
                        onFocus={e=>{ e.target.style.borderColor=errors.password?'#ef4444':'#10b981'; e.target.style.boxShadow=errors.password?'0 0 0 3px rgba(239,68,68,0.2)':'0 0 0 3px rgba(16,185,129,0.2)'; }}
                        onBlur={e=>{ e.target.style.borderColor=errors.password?'#ef4444':'rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; }} />
                      <button type="button" onClick={()=>setShowPw(p=>!p)}
                        style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)', display:'flex', transition:'color 0.15s' }}
                        onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.7)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}>
                        {showPw?<EyeOff/>:<EyeOn/>}
                      </button>
                    </div>
                    {errors.password && <p style={{ fontSize:'11px', color:'#ef4444', margin:'4px 0 0 2px', fontFamily:'DM Sans, sans-serif' }}>{errors.password}</p>}
                  </div>

                  {/* Remember me */}
                  <div style={{ display:'flex', alignItems:'center', gap:8, margin:'16px 0 20px' }}>
                    <div onClick={() => setRemember(p=>!p)}
                      style={{ width:18, height:18, borderRadius:5, border:`1.5px solid ${remember?'#10b981':'rgba(255,255,255,0.2)'}`, background:remember?'linear-gradient(135deg,#10b981,#0891b2)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.18s', flexShrink:0 }}>
                      {remember && <CheckIcon />}
                    </div>
                    <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontFamily:'DM Sans, sans-serif' }} onClick={() => setRemember(p=>!p)}>Remember me for 30 days</span>
                  </div>

                  {/* Submit */}
                  <motion.button type="submit" disabled={loading}
                    whileHover={!loading?{ scale:1.02, boxShadow:'0 0 30px rgba(16,185,129,0.5), 0 8px 24px rgba(16,185,129,0.3)' }:{}}
                    whileTap={!loading?{ scale:0.98 }:{}}
                    style={{ width:'100%', height:50, borderRadius:'12px', border:'none', background:loading?'rgba(255,255,255,0.06)':'linear-gradient(135deg,#10b981,#0891b2)', color:loading?'rgba(255,255,255,0.3)':'#fff', fontSize:'14px', fontWeight:700, cursor:loading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all 0.2s', fontFamily:'DM Sans, sans-serif', boxShadow:loading?'none':'0 4px 20px rgba(16,185,129,0.35)', letterSpacing:'0.02em' }}>
                    {loading
                      ? <><span style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.2)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite',display:'inline-block',flexShrink:0 }}/>Signing in...</>
                      : 'Sign in to DevMate →'
                    }
                  </motion.button>

                  <p style={{ textAlign:'center', fontSize:'13px', color:'rgba(255,255,255,0.35)', marginTop:18, fontFamily:'DM Sans, sans-serif' }}>
                    No account?{' '}
                    <span onClick={() => handleTabSwitch('register')} style={{ color:'#10b981', cursor:'pointer', fontWeight:600 }}>Create one free →</span>
                  </p>
                </motion.form>

              ) : (
                <motion.form key="register" onSubmit={doRegister} noValidate
                  initial={{ x: slideDir==='right'?30:-30, opacity:0 }}
                  animate={{ x:0, opacity:1 }}
                  exit={{ x: slideDir==='right'?-30:30, opacity:0 }}
                  transition={{ duration:0.28, ease:[0.22,1,0.36,1] }}>

                  {/* Name */}
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6, fontFamily:'DM Sans, sans-serif' }}>Full Name</div>
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Jay Dev" autoFocus
                      style={{ width:'100%', height:48, padding:'0 14px', background:'rgba(255,255,255,0.05)', border:`1px solid ${errors.name?'#ef4444':'rgba(255,255,255,0.1)'}`, borderRadius:'11px', color:'#fff', fontSize:'14px', outline:'none', transition:'all 0.2s', boxSizing:'border-box', fontFamily:'DM Sans, sans-serif' }}
                      onFocus={e=>{ e.target.style.borderColor='#10b981'; e.target.style.boxShadow='0 0 0 3px rgba(16,185,129,0.2)'; }}
                      onBlur={e=>{ e.target.style.borderColor=errors.name?'#ef4444':'rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; }} />
                    {errors.name && <p style={{ fontSize:'11px', color:'#ef4444', margin:'4px 0 0 2px', fontFamily:'DM Sans, sans-serif' }}>{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6, fontFamily:'DM Sans, sans-serif' }}>Email address</div>
                    <input type="email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} placeholder="you@company.com"
                      style={{ width:'100%', height:48, padding:'0 14px', background:'rgba(255,255,255,0.05)', border:`1px solid ${errors.regEmail?'#ef4444':'rgba(255,255,255,0.1)'}`, borderRadius:'11px', color:'#fff', fontSize:'14px', outline:'none', transition:'all 0.2s', boxSizing:'border-box', fontFamily:'DM Sans, sans-serif' }}
                      onFocus={e=>{ e.target.style.borderColor='#10b981'; e.target.style.boxShadow='0 0 0 3px rgba(16,185,129,0.2)'; }}
                      onBlur={e=>{ e.target.style.borderColor=errors.regEmail?'#ef4444':'rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; }} />
                    {errors.regEmail && <p style={{ fontSize:'11px', color:'#ef4444', margin:'4px 0 0 2px', fontFamily:'DM Sans, sans-serif' }}>{errors.regEmail}</p>}
                  </div>

                  {/* Password */}
                  <div style={{ marginBottom:4 }}>
                    <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6, fontFamily:'DM Sans, sans-serif' }}>Password</div>
                    <div style={{ position:'relative' }}>
                      <input type={showRPw?'text':'password'} value={regPw} onChange={e=>setRegPw(e.target.value)} placeholder="Min 8 characters"
                        style={{ width:'100%', height:48, padding:'0 44px 0 14px', background:'rgba(255,255,255,0.05)', border:`1px solid ${errors.regPw?'#ef4444':'rgba(255,255,255,0.1)'}`, borderRadius:'11px', color:'#fff', fontSize:'14px', outline:'none', transition:'all 0.2s', boxSizing:'border-box', fontFamily:'DM Sans, sans-serif' }}
                        onFocus={e=>{ e.target.style.borderColor='#10b981'; e.target.style.boxShadow='0 0 0 3px rgba(16,185,129,0.2)'; }}
                        onBlur={e=>{ e.target.style.borderColor=errors.regPw?'#ef4444':'rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; }} />
                      <button type="button" onClick={()=>setShowRPw(p=>!p)}
                        style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)', display:'flex', transition:'color 0.15s' }}
                        onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.7)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}>
                        {showRPw?<EyeOff/>:<EyeOn/>}
                      </button>
                    </div>
                    {errors.regPw && <p style={{ fontSize:'11px', color:'#ef4444', margin:'4px 0 0 2px', fontFamily:'DM Sans, sans-serif' }}>{errors.regPw}</p>}
                  </div>

                  {/* Password strength */}
                  <div style={{ marginTop:8 }}><PwStrength pw={regPw} /></div>

                  {/* Confirm */}
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6, fontFamily:'DM Sans, sans-serif' }}>Confirm Password</div>
                    <div style={{ position:'relative' }}>
                      <input type={showCPw?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat password"
                        style={{ width:'100%', height:48, padding:'0 44px 0 14px', background:'rgba(255,255,255,0.05)', border:`1px solid ${errors.confirm?'#ef4444':'rgba(255,255,255,0.1)'}`, borderRadius:'11px', color:'#fff', fontSize:'14px', outline:'none', transition:'all 0.2s', boxSizing:'border-box', fontFamily:'DM Sans, sans-serif' }}
                        onFocus={e=>{ e.target.style.borderColor='#10b981'; e.target.style.boxShadow='0 0 0 3px rgba(16,185,129,0.2)'; }}
                        onBlur={e=>{ e.target.style.borderColor=errors.confirm?'#ef4444':'rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; }} />
                      <button type="button" onClick={()=>setShowCPw(p=>!p)}
                        style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)', display:'flex', transition:'color 0.15s' }}
                        onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.7)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}>
                        {showCPw?<EyeOff/>:<EyeOn/>}
                      </button>
                    </div>
                    {errors.confirm && <p style={{ fontSize:'11px', color:'#ef4444', margin:'4px 0 0 2px', fontFamily:'DM Sans, sans-serif' }}>{errors.confirm}</p>}
                  </div>

                  {/* Role */}
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8, fontFamily:'DM Sans, sans-serif' }}>I am a...</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {ROLES.map(r => (
                        <div key={r} className="role-chip" onClick={() => setRole(r)}
                          style={{ padding:'6px 12px', borderRadius:'8px', fontSize:'12px', fontWeight:500, fontFamily:'DM Sans, sans-serif', border:`1px solid ${role===r?'rgba(16,185,129,0.5)':'rgba(255,255,255,0.1)'}`, color:role===r?'#10b981':'rgba(255,255,255,0.45)', background:role===r?'rgba(16,185,129,0.1)':'transparent' }}>
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button type="submit" disabled={loading}
                    whileHover={!loading?{ scale:1.02, boxShadow:'0 0 30px rgba(16,185,129,0.5), 0 8px 24px rgba(16,185,129,0.3)' }:{}}
                    whileTap={!loading?{ scale:0.98 }:{}}
                    style={{ width:'100%', height:50, borderRadius:'12px', border:'none', background:loading?'rgba(255,255,255,0.06)':'linear-gradient(135deg,#10b981,#0891b2)', color:loading?'rgba(255,255,255,0.3)':'#fff', fontSize:'14px', fontWeight:700, cursor:loading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'DM Sans, sans-serif', boxShadow:loading?'none':'0 4px 20px rgba(16,185,129,0.35)', letterSpacing:'0.02em' }}>
                    {loading
                      ? <><span style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.2)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite',display:'inline-block',flexShrink:0 }}/>Creating account...</>
                      : "Create account — it's free →"
                    }
                  </motion.button>

                  <p style={{ textAlign:'center', fontSize:'11px', color:'rgba(255,255,255,0.25)', marginTop:14, lineHeight:1.6, fontFamily:'DM Sans, sans-serif' }}>
                    By signing up you agree to our{' '}
                    <span style={{ color:'#10b981', cursor:'pointer' }}>Terms</span>
                    {' '}&{' '}
                    <span style={{ color:'#10b981', cursor:'pointer' }}>Privacy Policy</span>
                  </p>
                  <p style={{ textAlign:'center', fontSize:'13px', color:'rgba(255,255,255,0.35)', marginTop:10, fontFamily:'DM Sans, sans-serif' }}>
                    Have an account?{' '}
                    <span onClick={() => handleTabSwitch('login')} style={{ color:'#10b981', cursor:'pointer', fontWeight:600 }}>Sign in →</span>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Trust footer */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:20, paddingTop:18, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
              <ShieldIcon />
              <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.22)', fontFamily:'DM Sans, sans-serif' }}>
                SOC 2 compliant · Data encrypted at rest · Never sold
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}