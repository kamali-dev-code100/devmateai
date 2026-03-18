import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks';

// ── Icons ─────────────────────────────────────────────────────
function Ico({ p, size = 16, c = 'currentColor', sw = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ display:'block', flexShrink:0 }}>
      {(Array.isArray(p) ? p : [p]).map((d,i) => <path key={i} d={d} />)}
    </svg>
  );
}
const IC = {
  sun:    ['M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z','M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'],
  moon:   ['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'],
  menu:   ['M3 6h18M3 12h18M3 18h18'],
  x:      ['M18 6L6 18M6 6l12 12'],
  resume: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8'],
  clock:  ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 6v6l4 2'],
  code:   ['M16 18l6-6-6-6','M8 6l-6 6 6 6'],
  globe:  ['M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z','M2 12h20','M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'],
  bug:    ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  bolt:   ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
};

// ── Variants ──────────────────────────────────────────────────
const fadeUp  = { hidden:{ opacity:0, y:28 }, visible:{ opacity:1, y:0, transition:{ duration:0.55, ease:[0.22,1,0.36,1] } } };
const stagger = { hidden:{}, visible:{ transition:{ staggerChildren:0.1 } } };
const cardItem= { hidden:{ opacity:0, y:20, scale:0.97 }, visible:{ opacity:1, y:0, scale:1, transition:{ duration:0.5, ease:[0.22,1,0.36,1] } } };
const VP = { once:true, margin:'-60px' };

// ── CountUp ───────────────────────────────────────────────────
function CountUp({ to, suffix='', decimals=0, color }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null), done = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const s = performance.now(), dur = 1800;
        const tick = n => { const p=Math.min((n-s)/dur,1); setVal(parseFloat(((1-Math.pow(1-p,3))*to).toFixed(decimals))); if(p<1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }
    }, { threshold:0.5 });
    obs.observe(el); return () => obs.disconnect();
  }, [to]);
  return <div ref={ref} style={{ fontFamily:'Instrument Serif, serif', fontSize:'30px', color, lineHeight:1 }}>{decimals>0?val.toFixed(decimals):val}{suffix}</div>;
}

// ── Background ────────────────────────────────────────────────
function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); let id;
    const resize = () => { c.width=window.innerWidth; c.height=window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const stars = Array.from({ length:180 }, () => ({ x:Math.random(), y:Math.random(), r:Math.random()*1.4+0.2, a:Math.random(), s:Math.random()*0.003+0.001, drift:(Math.random()-0.5)*0.08 }));
    let sh=null;
    const launch = () => { sh={ x:Math.random()*c.width*0.7, y:Math.random()*c.height*0.4, len:120, a:1, vx:5, vy:2.5 }; setTimeout(launch,4000+Math.random()*5000); };
    setTimeout(launch,2500);
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height);
      stars.forEach(s => { s.a+=s.s*(Math.random()>0.5?1:-1); s.a=Math.max(0.05,Math.min(0.9,s.a)); s.x+=s.drift/c.width; if(s.x>1)s.x=0; if(s.x<0)s.x=1; ctx.beginPath(); ctx.arc(s.x*c.width,s.y*c.height,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(200,220,255,${s.a})`; ctx.fill(); });
      if(sh){ const g=ctx.createLinearGradient(sh.x,sh.y,sh.x-sh.len,sh.y-sh.len*0.4); g.addColorStop(0,`rgba(150,220,255,${sh.a})`); g.addColorStop(1,'rgba(150,220,255,0)'); ctx.beginPath(); ctx.moveTo(sh.x,sh.y); ctx.lineTo(sh.x-sh.len,sh.y-sh.len*0.4); ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.stroke(); sh.x+=sh.vx; sh.y+=sh.vy; sh.a-=0.018; if(sh.a<=0||sh.x>c.width)sh=null; }
      id=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize',resize); };
  }, []);
  return <canvas ref={ref} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }} />;
}
function DarkNebula() {
  return <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
    <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'60vw', height:'60vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.12),transparent 70%)', animation:'lnebula 20s ease-in-out infinite' }} />
    <div style={{ position:'absolute', top:'20%', right:'-15%', width:'50vw', height:'50vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.1),transparent 70%)', animation:'lnebula 24s ease-in-out infinite reverse' }} />
    <div style={{ position:'absolute', bottom:'-10%', left:'30%', width:'40vw', height:'40vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.08),transparent 70%)', animation:'lnebula 28s ease-in-out infinite 4s' }} />
  </div>;
}
function Aurora() {
  return <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0, background:'#f0f9ff' }}>
    <div style={{ position:'absolute', top:'-30%', left:'-20%', width:'80vw', height:'60vh', borderRadius:'50%', background:'radial-gradient(ellipse,rgba(16,185,129,0.22),rgba(8,145,178,0.12) 40%,transparent 70%)', animation:'aurora1 12s ease-in-out infinite', filter:'blur(40px)' }} />
    <div style={{ position:'absolute', top:'-10%', right:'-20%', width:'70vw', height:'55vh', borderRadius:'50%', background:'radial-gradient(ellipse,rgba(99,102,241,0.18),rgba(139,92,246,0.1) 40%,transparent 70%)', animation:'aurora2 15s ease-in-out infinite', filter:'blur(50px)' }} />
    <div style={{ position:'absolute', top:'10%', left:'20%', width:'60vw', height:'40vh', borderRadius:'50%', background:'radial-gradient(ellipse,rgba(34,211,238,0.18),rgba(16,185,129,0.08) 40%,transparent 70%)', animation:'aurora3 18s ease-in-out infinite 3s', filter:'blur(45px)' }} />
    <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(16,185,129,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.035) 1px,transparent 1px)', backgroundSize:'52px 52px' }} />
  </div>;
}

// ── NavLink with animated underline ──────────────────────────
function NavLink({ label, isDark, text2, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position:'relative', padding:'7px 13px', borderRadius:'8px', fontSize:'13px', color:hov?(isDark?'#fff':'#0f1117'):text2, cursor:'pointer', fontWeight:500, transition:'color 0.18s', fontFamily:'DM Sans, sans-serif', userSelect:'none' }}>
      {label}
      <motion.div animate={{ scaleX:hov?1:0, opacity:hov?1:0 }} transition={{ duration:0.2 }}
        style={{ position:'absolute', bottom:3, left:'13px', right:'13px', height:'1.5px', background:'linear-gradient(90deg,#10b981,#0891b2)', borderRadius:2, transformOrigin:'left' }} />
    </div>
  );
}

// ── Premium Floating Navbar ───────────────────────────────────
function FloatingNav({ isDark, toggleTheme, onSignIn, onGetStarted, text1, text2, cardBrd }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobile] = useState(false);
  const LINKS = ['Features','How it works','Pricing','FAQ'];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h, { passive:true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scrollTo = (id) => {
    setMobile(false);
    setTimeout(() => document.getElementById(id.toLowerCase().replace(/ /g,''))?.scrollIntoView({ behavior:'smooth' }), 100);
  };

  const navBg = isDark
    ? scrolled ? 'rgba(4,5,14,0.94)' : 'rgba(4,5,14,0.55)'
    : scrolled ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.6)';

  const borderCol = isDark
    ? scrolled ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.1)'
    : scrolled ? 'rgba(16,185,129,0.2)' : 'rgba(0,0,0,0.08)';

  return (
    <motion.div
      initial={{ y:-90, opacity:0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:0.6, delay:0.1, ease:[0.22,1,0.36,1] }}
      style={{ position:'fixed', top:14, left:0, right:0, margin:'0 auto', zIndex:200, width:'calc(100% - clamp(16px,4vw,48px))', maxWidth:'1060px' }}>

      {/* Glow line when scrolled */}
      {scrolled && (
        <div style={{ position:'absolute', top:-1, left:'20%', right:'20%', height:1, background:'linear-gradient(90deg,transparent,rgba(16,185,129,0.5),transparent)', borderRadius:1 }} />
      )}

      <div style={{
        background: navBg,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: `1px solid ${borderCol}`,
        borderRadius: '18px',
        minHeight: scrolled ? '52px' : '60px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(10px,3vw,20px)',
        transition: 'min-height 0.35s ease, background 0.35s ease, border-color 0.35s ease',
        boxShadow: isDark
          ? scrolled ? '0 8px 48px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset' : '0 4px 24px rgba(0,0,0,0.25)'
          : scrolled ? '0 8px 48px rgba(0,0,0,0.1)' : '0 4px 24px rgba(0,0,0,0.07)',
      }}>

        {/* ── Logo ── */}
        <motion.div
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
          onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
          style={{ display:'flex', alignItems:'center', gap:'9px', cursor:'pointer', flexShrink:0 }}>
          <div style={{
            width:32, height:32,
            background:'linear-gradient(135deg,#10b981,#0891b2)',
            borderRadius:'10px',
            display:'flex', alignItems:'center', justifyContent:'center',
            flexShrink:0,
            animation:'logoGlow 3s ease-in-out infinite',
            position:'relative',
          }}>
            {/* Inner circuit lines for futuristic feel */}
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <span style={{ fontFamily:'Instrument Serif, serif', fontSize:'17px', color:text1, letterSpacing:'-0.01em', display:'block', lineHeight:1 }}>DevMate AI</span>
            {!scrolled && <span className="nav-devint" style={{ fontSize:'9px', fontWeight:600, color:'#10b981', letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:'DM Sans, sans-serif', opacity:0.8 }}>Developer Intelligence</span>}
          </div>
        </motion.div>

        {/* ── Center nav links ── */}
        <div className="lnav-links" style={{ display:'flex', gap:'2px', flex:1, justifyContent:'center' }}>
          {LINKS.map(l => (
            <NavLink key={l} label={l} isDark={isDark} text2={text2} onClick={() => scrollTo(l)} />
          ))}
        </div>

        {/* ── Right actions ── */}
        <div style={{ display:'flex', gap:'7px', alignItems:'center', flexShrink:0 }}>
          {/* Theme toggle */}
          <motion.button whileHover={{ scale:1.1, rotate:15 }} whileTap={{ scale:0.9 }}
            onClick={toggleTheme}
            style={{ width:34, height:34, borderRadius:'10px', background:isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)', border:`1px solid ${cardBrd}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', outline:'none', transition:'border-color 0.2s' }}>
            <Ico p={isDark?IC.sun:IC.moon} size={14} c={text2} />
          </motion.button>

          {/* Sign In */}
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={onSignIn} className="nav-signin"
            style={{ padding:'7px 16px', borderRadius:'10px', background:'transparent', border:`1px solid ${cardBrd}`, color:text1, fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'DM Sans, sans-serif', transition:'border-color 0.2s, color 0.2s', whiteSpace:'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#10b981'; e.currentTarget.style.color='#10b981'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=cardBrd; e.currentTarget.style.color=text1; }}>
            Sign In
          </motion.button>

          {/* Get Started — neon gradient */}
          <motion.button
            whileHover={{ scale:1.04, boxShadow:'0 0 24px rgba(16,185,129,0.5), 0 6px 20px rgba(16,185,129,0.3)' }}
            whileTap={{ scale:0.96 }}
            onClick={onGetStarted} className="nav-getstarted"
            style={{ padding:'8px 18px', borderRadius:'10px', background:'linear-gradient(135deg,#10b981,#0891b2)', color:'#fff', fontSize:'13px', fontWeight:700, cursor:'pointer', border:'none', fontFamily:'DM Sans, sans-serif', boxShadow:'0 2px 14px rgba(16,185,129,0.35)', whiteSpace:'nowrap', letterSpacing:'0.01em' }}>
            Get Started →
          </motion.button>

          {/* Mobile hamburger */}
          <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.95 }}
            onClick={() => setMobile(p=>!p)} className="nav-hamburger"
            style={{ width:34, height:34, borderRadius:'10px', background:isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)', border:`1px solid ${cardBrd}`, cursor:'pointer', display:'none', alignItems:'center', justifyContent:'center', outline:'none' }}>
            <Ico p={mobileOpen?IC.x:IC.menu} size={15} c={text2} />
          </motion.button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity:0, y:-8, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-8, scale:0.97 }}
            transition={{ duration:0.2, ease:[0.22,1,0.36,1] }}
            style={{ marginTop:'8px', borderRadius:'16px', background:isDark?'rgba(6,8,18,0.97)':'rgba(255,255,255,0.97)', border:`1px solid ${isDark?'rgba(16,185,129,0.2)':'rgba(0,0,0,0.08)'}`, backdropFilter:'blur(28px)', padding:'12px', boxShadow:'0 24px 60px rgba(0,0,0,0.3)' }}>
            {LINKS.map((l,i) => (
              <motion.div key={l}
                initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04 }}
                onClick={() => scrollTo(l)}
                whileHover={{ background:isDark?'rgba(16,185,129,0.08)':'rgba(16,185,129,0.05)', x:4 }}
                style={{ padding:'11px 14px', borderRadius:'10px', fontSize:'14px', fontWeight:500, color:text2, cursor:'pointer', fontFamily:'DM Sans, sans-serif', transition:'color 0.15s' }}>
                {l}
              </motion.div>
            ))}
            <div style={{ borderTop:`1px solid ${isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.07)'}`, margin:'8px 4px 4px', paddingTop:'10px', display:'flex', gap:'8px' }}>
              <motion.button whileTap={{ scale:0.97 }} onClick={() => { onSignIn(); setMobile(false); }}
                style={{ flex:1, padding:'11px', borderRadius:'10px', background:'transparent', border:`1px solid ${cardBrd}`, color:text1, fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>
                Sign In
              </motion.button>
              <motion.button whileTap={{ scale:0.97 }} onClick={() => { onGetStarted(); setMobile(false); }}
                style={{ flex:1, padding:'11px', borderRadius:'10px', background:'linear-gradient(135deg,#10b981,#0891b2)', color:'#fff', fontSize:'13px', fontWeight:700, cursor:'pointer', border:'none', fontFamily:'DM Sans, sans-serif', boxShadow:'0 2px 14px rgba(16,185,129,0.35)' }}>
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Data ──────────────────────────────────────────────────────
const FEATURES = [
  { icon:IC.resume, c:'#1d4ed8', bg:'rgba(29,78,216,0.08)',  brd:'rgba(29,78,216,0.2)',  title:'Resume Analyzer',  desc:'ATS score, keyword gaps & GPT-4o feedback.',   path:'/resume'      },
  { icon:IC.clock,  c:'#059669', bg:'rgba(5,150,105,0.08)',   brd:'rgba(5,150,105,0.2)',  title:'Interview Trainer', desc:'FAANG-level mock interviews with AI scoring.',  path:'/interview'   },
  { icon:IC.code,   c:'#d97706', bg:'rgba(217,119,6,0.08)',   brd:'rgba(217,119,6,0.2)',  title:'Code Reviewer',     desc:'Security audits & performance tips instantly.', path:'/code-review' },
  { icon:IC.globe,  c:'#7c3aed', bg:'rgba(124,58,237,0.08)',  brd:'rgba(124,58,237,0.2)', title:'Learning Paths',    desc:'AI-curated roadmaps for your target role.',     path:'/learning'    },
  { icon:IC.bug,    c:'#dc2626', bg:'rgba(220,38,38,0.08)',   brd:'rgba(220,38,38,0.2)',  title:'Bug Fix AI',        desc:'Root cause diagnosis + fix in seconds.',        path:'/bug-fix'     },
  { icon:IC.bolt,   c:'#6366f1', bg:'rgba(99,102,241,0.08)',  brd:'rgba(99,102,241,0.2)', title:'Coming Soon',       desc:'AI PR reviewer, test generator & more.',        path:null           },
];
const TESTIMONIALS = [
  { initials:'SR', color:'#6366f1', name:'Sarah Ramirez', role:'Senior Frontend @ Stripe', text:"DevMate's resume analyzer helped me go from 2% callback to 34%. Game-changing ATS suggestions." },
  { initials:'AK', color:'#10b981', name:'Aditya Kumar',  role:'Staff Engineer @ Meta',   text:'Practiced 15 system design interviews with DevMate before my FAANG loop. Got offers from two.' },
  { initials:'JM', color:'#f59e0b', name:'Jake Morrison',  role:'CTO @ Buildify',          text:'The code reviewer caught a SQL injection three human reviewers missed. Pays for itself easily.' },
];
const FAQS = [
  { q:'What AI model powers DevMate?',       a:'GPT-4o for Pro users, GPT-4o-mini for Free. All prompts are engineered for developer-specific contexts.' },
  { q:'Is my code and resume data private?', a:'Yes. Data is encrypted at rest and in transit. We never use your data to train AI models.' },
  { q:'What are AI credits?',                a:'Credits per AI call — resume: 5, code review: 3, interview message: 1. Resets monthly.' },
  { q:'Can I cancel anytime?',               a:'Yes. No contracts, no fees. Cancel from settings — plan continues until end of billing period.' },
];

// ── Main Landing ──────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState(null);
  const isDark = theme === 'dark';

  const bg      = isDark ? '#05060f' : '#f0f9ff';
  const text1   = isDark ? '#fff' : '#0f1117';
  const text2   = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const text3   = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)';
  const accent  = isDark ? '#6ee7b7' : '#059669';
  const cardBg  = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)';
  const cardBrd = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  const goSignIn  = () => navigate('/auth?tab=login');
  const goSignUp  = () => navigate('/auth?tab=register');

  return (
    <div style={{ background:bg, color:text1, minHeight:'100vh', overflowX:'hidden', transition:'background 0.3s, color 0.3s' }}>
      <style>{`
        @keyframes lpulse    { 0%,100%{opacity:1}50%{opacity:0.3} }
        @keyframes lnebula   { 0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,-20px) scale(1.05)} }
        @keyframes aurora1   { 0%,100%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(30px,-20px) rotate(8deg)} }
        @keyframes aurora2   { 0%,100%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(-20px,30px) rotate(-6deg)} }
        @keyframes aurora3   { 0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(15px,15px) scale(1.08)} }
        @keyframes hwShimmer { to { background-position:200% center; } }
        @keyframes logoGlow  { 0%,100%{box-shadow:0 0 14px rgba(16,185,129,0.4)}50%{box-shadow:0 0 32px rgba(16,185,129,0.8),0 0 60px rgba(8,145,178,0.35)} }

        .nav-signin    { display:flex !important; }
        .nav-hamburger { display:none !important; }
        .lnav-links    { display:flex !important; }
        @media(max-width:860px) {
          .nav-signin    { display:none !important; }
          .nav-hamburger { display:flex !important; }
          .lnav-links    { display:none !important; }
        }
        @media(max-width:480px) {
          .nav-getstarted { display:none !important; }
          .nav-devint     { display:none !important; }
        }
        @media(max-width:700px) {
          .feat-grid   { grid-template-columns:1fr 1fr !important; }
          .testi-grid  { grid-template-columns:1fr !important; }
          .price-grid  { grid-template-columns:1fr !important; }
          .hiw-wrap    { flex-direction:column !important; gap:32px !important; }
          .footer-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media(max-width:440px) {
          .feat-grid   { grid-template-columns:1fr !important; }
          .footer-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {isDark ? <><StarField /><DarkNebula /></> : <Aurora />}

      <FloatingNav isDark={isDark} toggleTheme={toggleTheme} onSignIn={goSignIn} onGetStarted={goSignUp} text1={text1} text2={text2} cardBrd={cardBrd} />

      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'130px 32px 60px', position:'relative', zIndex:1 }}>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.3 }}
          style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'5px 16px', border:`1px solid ${isDark?'rgba(110,231,183,0.3)':'rgba(5,150,105,0.3)'}`, borderRadius:'20px', background:isDark?'rgba(110,231,183,0.07)':'rgba(5,150,105,0.07)', fontSize:'13px', fontWeight:500, color:accent, marginBottom:'28px', fontFamily:'DM Sans, sans-serif' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:accent, display:'inline-block', animation:'lpulse 2s infinite' }} />
          Now live — DevMate AI is officially launched!
        </motion.div>

        <h1 style={{ fontFamily:'Instrument Serif, serif', fontSize:'clamp(38px,7vw,84px)', lineHeight:1.05, color:text1, margin:'0 auto 22px', letterSpacing:'-0.02em', maxWidth:'840px' }}>
          {['Your','AI','co-pilot','for','a'].map((w,i) => (
            <motion.span key={i} initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.45+i*0.09, ease:[0.22,1,0.36,1] }}
              style={{ display:'inline-block', marginRight:'0.22em' }}>{w}</motion.span>
          ))}
          <br />
          <motion.span initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.95, ease:[0.22,1,0.36,1] }}
            style={{ display:'inline-block', backgroundImage:isDark?'linear-gradient(90deg,#6ee7b7,#60a5fa,#a78bfa,#6ee7b7)':'linear-gradient(90deg,#059669,#0891b2,#7c3aed,#059669)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'hwShimmer 3s linear 1.2s infinite' }}>
            better dev career
          </motion.span>
        </h1>

        <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:1.15 }}
          style={{ fontSize:'clamp(14px,2vw,18px)', color:text2, maxWidth:'520px', margin:'0 auto 38px', lineHeight:1.78, fontFamily:'DM Sans, sans-serif' }}>
          Resume analysis, mock interviews, code reviews, and personalized learning paths — all powered by GPT-4o.
        </motion.p>

        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:1.3 }}
          style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
          <motion.button whileHover={{ scale:1.04, boxShadow:isDark?'0 10px 40px rgba(16,185,129,0.55)':'0 10px 36px rgba(5,150,105,0.4)' }} whileTap={{ scale:0.97 }}
            onClick={goSignUp} style={{ padding:'14px 30px', fontSize:'15px', borderRadius:'12px', fontWeight:700, background:isDark?'linear-gradient(135deg,#10b981,#0891b2)':'linear-gradient(135deg,#059669,#0891b2)', color:'#fff', border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', boxShadow:isDark?'0 0 30px rgba(16,185,129,0.3)':'0 4px 20px rgba(5,150,105,0.3)' }}>
            Get Started Free →
          </motion.button>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={goSignIn} style={{ padding:'14px 30px', fontSize:'15px', borderRadius:'12px', fontWeight:500, background:isDark?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.75)', color:text1, border:`1px solid ${cardBrd}`, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>
            Sign In
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6, delay:1.55 }}
          style={{ display:'flex', gap:'60px', marginTop:'56px', justifyContent:'center', flexWrap:'wrap' }}>
          {[{to:24,suffix:'k+',decimals:0,label:'Developers'},{to:98,suffix:'%',decimals:0,label:'Satisfaction'},{to:3.2,suffix:'M+',decimals:1,label:'AI analyses'}].map(s => (
            <div key={s.label} style={{ textAlign:'center' }}>
              <CountUp to={s.to} suffix={s.suffix} decimals={s.decimals} color={text1} />
              <div style={{ fontSize:'12px', color:text3, marginTop:'4px', fontFamily:'DM Sans, sans-serif' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:'80px 32px', maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:1 }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}>
          <div style={{ fontSize:'11px', fontWeight:700, color:accent, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px', fontFamily:'DM Sans, sans-serif' }}>AI Tools</div>
          <h2 style={{ fontFamily:'Instrument Serif, serif', fontSize:'clamp(26px,4vw,46px)', color:text1, marginBottom:'12px' }}>Everything a developer needs to grow</h2>
          <p style={{ fontSize:'16px', color:text2, maxWidth:'520px', lineHeight:1.7, marginBottom:'44px', fontFamily:'DM Sans, sans-serif' }}>Five powerful AI tools designed specifically for software engineers at every career stage.</p>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP}
          className="feat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
          {FEATURES.map((f,i) => (
            <motion.div key={i} variants={cardItem} onClick={() => f.path && navigate(f.path)}
              whileHover={f.path?{ y:-5, boxShadow:`0 16px 48px ${f.c}18` }:{}}
              style={{ border:`1px solid ${isDark?f.brd:'rgba(0,0,0,0.07)'}`, borderStyle:f.path?'solid':'dashed', borderRadius:'16px', padding:'24px', background:isDark?f.bg:'rgba(255,255,255,0.6)', cursor:f.path?'pointer':'default', backdropFilter:'blur(10px)' }}>
              <div style={{ width:44, height:44, borderRadius:'12px', background:`${f.c}15`, border:`1px solid ${f.c}25`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
                <Ico p={f.icon} size={20} c={f.c} />
              </div>
              <div style={{ fontSize:'15px', fontWeight:600, color:text1, marginBottom:'6px', fontFamily:'DM Sans, sans-serif' }}>{f.title}</div>
              <div style={{ fontSize:'13px', color:text2, lineHeight:1.65, fontFamily:'DM Sans, sans-serif' }}>{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="howitworks" style={{ padding:'80px 32px', maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:1 }}>
        <div className="hiw-wrap" style={{ display:'flex', gap:'80px', alignItems:'flex-start' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} style={{ flexShrink:0, maxWidth:'360px' }}>
            <div style={{ fontSize:'11px', fontWeight:700, color:accent, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px', fontFamily:'DM Sans, sans-serif' }}>How it works</div>
            <h2 style={{ fontFamily:'Instrument Serif, serif', fontSize:'clamp(26px,4vw,46px)', color:text1, marginBottom:'12px' }}>Get results in minutes</h2>
            <p style={{ fontSize:'16px', color:text2, lineHeight:1.7, fontFamily:'DM Sans, sans-serif' }}>No setup required. Just sign up and start improving immediately.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP} style={{ flex:1 }}>
            {[['Create your profile','Tell DevMate your role, skills, and goals. Takes 2 minutes.'],['Choose your AI tool','Upload resume, paste code, or start a mock interview.'],['Get instant feedback','Detailed, actionable analysis in seconds — not hours.'],['Track your progress','Dashboard shows improvement across all AI sessions.']].map(([title,desc],i) => (
              <motion.div key={title} variants={fadeUp} style={{ display:'flex', gap:'20px', paddingBottom:'32px', position:'relative' }}>
                {i < 3 && <div style={{ position:'absolute', left:'17px', top:'38px', bottom:0, width:'1px', background:`linear-gradient(to bottom,${accent}60,${accent}10)` }} />}
                <div style={{ width:36, height:36, borderRadius:'50%', background:isDark?'rgba(16,185,129,0.1)':'rgba(5,150,105,0.1)', border:`1px solid ${accent}50`, color:accent, fontSize:'13px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, zIndex:1, fontFamily:'DM Sans, sans-serif' }}>{i+1}</div>
                <div style={{ paddingTop:'6px' }}>
                  <div style={{ fontSize:'15px', fontWeight:600, color:text1, marginBottom:'5px', fontFamily:'DM Sans, sans-serif' }}>{title}</div>
                  <div style={{ fontSize:'14px', color:text2, lineHeight:1.65, fontFamily:'DM Sans, sans-serif' }}>{desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:'80px 32px', maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:1 }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}>
          <div style={{ fontSize:'11px', fontWeight:700, color:accent, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px', fontFamily:'DM Sans, sans-serif' }}>Testimonials</div>
          <h2 style={{ fontFamily:'Instrument Serif, serif', fontSize:'clamp(26px,4vw,46px)', color:text1, marginBottom:'44px' }}>Loved by developers</h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP}
          className="testi-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
          {TESTIMONIALS.map(t => (
            <motion.div key={t.name} variants={cardItem}
              whileHover={{ y:-4, boxShadow:`0 12px 40px ${t.color}18` }}
              style={{ background:cardBg, border:`1px solid ${cardBrd}`, borderRadius:'16px', padding:'22px', backdropFilter:'blur(10px)' }}>
              <div style={{ display:'flex', gap:'2px', marginBottom:'12px' }}>{[...Array(5)].map((_,j)=><span key={j} style={{ color:'#f59e0b', fontSize:'12px' }}>★</span>)}</div>
              <p style={{ fontSize:'13px', color:text2, lineHeight:1.75, fontStyle:'italic', marginBottom:'16px', fontFamily:'DM Sans, sans-serif' }}>"{t.text}"</p>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:t.color+'20', color:t.color, fontSize:'12px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:600, color:text1, fontFamily:'DM Sans, sans-serif' }}>{t.name}</div>
                  <div style={{ fontSize:'11px', color:text3, fontFamily:'DM Sans, sans-serif' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding:'80px 32px', maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:1 }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}>
          <div style={{ fontSize:'11px', fontWeight:700, color:accent, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px', fontFamily:'DM Sans, sans-serif' }}>Pricing</div>
          <h2 style={{ fontFamily:'Instrument Serif, serif', fontSize:'clamp(26px,4vw,46px)', color:text1, marginBottom:'44px' }}>Simple, transparent pricing</h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP}
          className="price-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
          {[
            { plan:'Free', price:'$0',  desc:'Perfect for trying DevMate.',  features:['100 AI credits/month','3 resume analyses','5 interview sessions','Basic code review','1 learning path'],                  cta:'Get started free',  featured:false },
            { plan:'Pro',  price:'$19', desc:'For developers leveling up.',   features:['1,000 AI credits/month','Unlimited resume analyses','Unlimited interviews','Full code review suite','Unlimited paths','GPT-4o priority'], cta:'Start Pro trial →', featured:true  },
            { plan:'Team', price:'$49', desc:'For engineering teams.',        features:['5,000 credits/month','Up to 10 seats','Team analytics','Custom interview banks','API access','Dedicated support'],         cta:'Contact sales',     featured:false },
          ].map(p => (
            <motion.div key={p.plan} variants={cardItem}
              whileHover={{ y:-5, boxShadow:p.featured?'0 20px 60px rgba(16,185,129,0.2)':'0 12px 40px rgba(0,0,0,0.12)' }}
              style={{ border:`1px solid ${p.featured?'rgba(16,185,129,0.4)':cardBrd}`, borderRadius:'16px', padding:'28px', background:p.featured?(isDark?'linear-gradient(180deg,rgba(16,185,129,0.07),rgba(8,145,178,0.03))':'linear-gradient(180deg,rgba(16,185,129,0.05),rgba(255,255,255,0.5))'):cardBg, position:'relative', backdropFilter:'blur(10px)' }}>
              {p.featured && <div style={{ position:'absolute', top:-1, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#10b981,#0891b2)', color:'#fff', fontSize:'10px', fontWeight:700, padding:'3px 14px', borderRadius:'0 0 8px 8px', letterSpacing:'0.05em', fontFamily:'DM Sans, sans-serif' }}>MOST POPULAR</div>}
              <div style={{ fontSize:'11px', fontWeight:700, color:text2, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px', marginTop:p.featured?'10px':0, fontFamily:'DM Sans, sans-serif' }}>{p.plan}</div>
              <div style={{ fontFamily:'Instrument Serif, serif', fontSize:'42px', color:text1, marginBottom:'4px', lineHeight:1 }}>{p.price}<span style={{ fontSize:'14px', color:text2, fontFamily:'DM Sans, sans-serif' }}>/mo</span></div>
              <div style={{ fontSize:'13px', color:text2, marginBottom:'20px', lineHeight:1.5, fontFamily:'DM Sans, sans-serif' }}>{p.desc}</div>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'9px', marginBottom:'24px' }}>
                {p.features.map(f => <li key={f} style={{ fontSize:'13px', color:text2, display:'flex', gap:'8px', fontFamily:'DM Sans, sans-serif' }}><span style={{ color:accent, fontWeight:700, flexShrink:0 }}>✓</span>{f}</li>)}
              </ul>
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={goSignUp}
                style={{ width:'100%', padding:'11px', borderRadius:'10px', border:p.featured?'none':`1px solid ${cardBrd}`, background:p.featured?'linear-gradient(135deg,#10b981,#0891b2)':(isDark?'transparent':'rgba(255,255,255,0.8)'), color:p.featured?'#fff':text1, cursor:'pointer', fontSize:'13px', fontWeight:600, fontFamily:'DM Sans, sans-serif' }}>
                {p.cta}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding:'80px 32px', maxWidth:'700px', margin:'0 auto', position:'relative', zIndex:1 }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}>
          <div style={{ fontSize:'11px', fontWeight:700, color:accent, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px', fontFamily:'DM Sans, sans-serif' }}>FAQ</div>
          <h2 style={{ fontFamily:'Instrument Serif, serif', fontSize:'clamp(26px,4vw,46px)', color:text1, marginBottom:'40px' }}>Common questions</h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP}>
          {FAQS.map((f,i) => (
            <motion.div key={i} variants={fadeUp} onClick={() => setOpenFaq(openFaq===i?null:i)}
              whileHover={{ background:isDark?'rgba(255,255,255,0.02)':'rgba(0,0,0,0.02)' }}
              style={{ borderBottom:`1px solid ${cardBrd}`, cursor:'pointer', padding:'0 10px', borderRadius:'8px' }}>
              <div style={{ padding:'18px 0', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'16px' }}>
                <span style={{ fontSize:'14px', fontWeight:500, color:text1, fontFamily:'DM Sans, sans-serif' }}>{f.q}</span>
                <motion.span animate={{ rotate:openFaq===i?45:0 }} transition={{ duration:0.2 }}
                  style={{ fontSize:'18px', color:text2, flexShrink:0, display:'block' }}>+</motion.span>
              </div>
              <AnimatePresence>
                {openFaq===i && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.25 }} style={{ overflow:'hidden' }}>
                    <div style={{ fontSize:'14px', color:text2, lineHeight:1.7, paddingBottom:'18px', fontFamily:'DM Sans, sans-serif' }}>{f.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section style={{ textAlign:'center', padding:'80px 32px', position:'relative', zIndex:1 }}>
        <div style={{ position:'absolute', inset:0, background:isDark?'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(16,185,129,0.07),transparent)':'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(5,150,105,0.08),transparent)', pointerEvents:'none' }} />
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} style={{ position:'relative' }}>
          <h2 style={{ fontFamily:'Instrument Serif, serif', fontSize:'clamp(26px,5vw,54px)', color:text1, marginBottom:'14px' }}>Ready to accelerate your career?</h2>
          <p style={{ fontSize:'16px', color:text2, marginBottom:'32px', fontFamily:'DM Sans, sans-serif' }}>Join 24,000+ developers already using DevMate AI.</p>
          <motion.button whileHover={{ scale:1.04, boxShadow:'0 14px 50px rgba(16,185,129,0.5)' }} whileTap={{ scale:0.97 }}
            onClick={goSignUp} style={{ padding:'15px 34px', fontSize:'16px', borderRadius:'12px', fontWeight:700, background:'linear-gradient(135deg,#10b981,#0891b2)', color:'#fff', border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', boxShadow:'0 0 30px rgba(16,185,129,0.2)' }}>
            Get started for free →
          </motion.button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <motion.footer variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}
        style={{ borderTop:`1px solid ${cardBrd}`, padding:'48px 32px 32px', maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:1 }}>
        <div className="footer-grid" style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'40px', marginBottom:'40px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
              <div style={{ width:26, height:26, background:'linear-gradient(135deg,#10b981,#0891b2)', borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span style={{ fontFamily:'Instrument Serif, serif', fontSize:'16px', color:text1 }}>DevMate AI</span>
            </div>
            <div style={{ fontSize:'13px', color:text3, lineHeight:1.65, fontFamily:'DM Sans, sans-serif' }}>The AI intelligence platform<br/>built for software developers.</div>
          </div>
          {[{title:'Product',links:['Resume Analyzer','Interview Trainer','Code Reviewer','Learning Paths']},{title:'Company',links:['About','Blog','Careers','Press']},{title:'Legal',links:['Privacy','Terms','Security','Cookies']}].map(col => (
            <div key={col.title}>
              <div style={{ fontSize:'11px', fontWeight:700, color:text2, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'12px', fontFamily:'DM Sans, sans-serif' }}>{col.title}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {col.links.map(l => <span key={l} style={{ fontSize:'13px', color:text3, cursor:'pointer', transition:'color 0.15s', fontFamily:'DM Sans, sans-serif' }} onMouseEnter={e=>e.target.style.color=text1} onMouseLeave={e=>e.target.style.color=text3}>{l}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', paddingTop:'24px', borderTop:`1px solid ${cardBrd}`, flexWrap:'wrap', gap:'8px' }}>
          <span style={{ fontSize:'12px', color:text3, fontFamily:'DM Sans, sans-serif' }}>© 2026 DevMate AI. All rights reserved.</span>
          <span style={{ fontSize:'12px', color:text3, fontFamily:'DM Sans, sans-serif' }}>Made with ♥ for developers</span>
        </div>
      </motion.footer>
    </div>
  );
}