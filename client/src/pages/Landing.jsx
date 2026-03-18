import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks';

const FEATURES = [
  { icon: '📄', title: 'Resume Analyzer',  desc: 'ATS score, keyword gaps, and role-specific suggestions powered by GPT-4o.', path: '/resume' },
  { icon: '🎯', title: 'Interview Trainer', desc: 'Simulate FAANG-level technical and behavioral interviews with real-time scoring.', path: '/interview' },
  { icon: '⚡', title: 'Code Reviewer',    desc: 'Security audits, performance tips, and production-ready refactoring in seconds.', path: '/code-review' },
  { icon: '🗺️', title: 'Learning Paths',  desc: 'AI-curated roadmaps tailored to your goals, skills, and target role.', path: '/learning' },
  { icon: '🔍', title: 'Bug Fix AI',       desc: 'Root cause diagnosis and a working fix — from error message to solution instantly.', path: '/bug-fix' },
  { icon: '🔮', title: 'Coming Soon',      desc: 'AI PR reviewer, test generator, architecture advisor, and more on the roadmap.', path: null },
];

const TESTIMONIALS = [
  { initials: 'SR', color: '#6366f1', name: 'Sarah Ramirez', role: 'Senior Frontend Engineer @ Stripe', text: 'DevMate\'s resume analyzer helped me go from 2% interview callback rate to 34%. The ATS keyword suggestions were game-changing.' },
  { initials: 'AK', color: '#6ee7b7', name: 'Aditya Kumar',  role: 'Staff Engineer @ Meta',           text: 'Practiced 15 system design interviews with the AI trainer before my FAANG loop. Got offers from two of them. Worth every penny.' },
  { initials: 'JM', color: '#fbbf24', name: 'Jake Morrison',  role: 'CTO @ Buildify',                 text: 'The code reviewer caught a SQL injection vulnerability that three human reviewers missed. This tool pays for itself.' },
];

const FAQS = [
  { q: 'What AI model powers DevMate?', a: 'DevMate uses GPT-4o for Pro users and GPT-4o-mini for Free users. All prompts are carefully engineered for developer-specific contexts — not generic chatbot responses.' },
  { q: 'Is my code and resume data private?', a: 'Absolutely. Your data is encrypted at rest and in transit. We never use your code or resume to train AI models. You can delete all your data at any time.' },
  { q: 'What are AI credits?', a: 'Credits are consumed each time you use an AI tool. A resume analysis costs 5 credits, code review costs 3, and each interview message costs 1. Credits reset monthly.' },
  { q: 'Can I cancel anytime?', a: 'Yes. No contracts, no cancellation fees. Cancel from your settings page and your plan continues until the end of the billing period.' },
  { q: 'Do you offer refunds?', a: 'We offer a 7-day money-back guarantee for new Pro subscribers. Contact support and we\'ll refund you, no questions asked.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '60px',
        background: theme === 'dark' ? 'rgba(10,10,11,0.88)' : 'rgba(250,250,248,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--bg)"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: '18px' }}>DevMate AI</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {['Features','Pricing','How it works','FAQ'].map(l => (
            <span key={l} style={{ padding: '6px 14px', borderRadius: '7px', fontSize: '13px', color: 'var(--text2)', cursor: 'pointer' }}
              onClick={() => document.getElementById(l.toLowerCase().replace(' ',''))?.scrollIntoView({ behavior: 'smooth' })}>
              {l}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{ width: '32px', height: '32px', borderRadius: '7px', background: 'var(--bg3)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '14px' }}>
            {theme === 'dark' ? '☀' : '🌙'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 32px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(110,231,183,0.07),transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)', backgroundSize: '40px 40px', opacity: 0.25, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', border: '1px solid rgba(110,231,183,0.25)', borderRadius: '20px', background: 'rgba(110,231,183,0.05)', fontSize: '12px', fontWeight: 500, color: 'var(--accent)', marginBottom: '24px' }}>
            <span style={{ fontSize: '8px' }}>●</span> Just launched — AI Interview Trainer 2.0
          </div>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 1.05, color: 'var(--text)', maxWidth: '800px', margin: '0 auto 20px' }}>
            Your AI co-pilot for a <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>better dev career</em>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text2)', maxWidth: '520px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Resume analysis, mock interviews, code reviews, and personalized learning paths — all powered by GPT-4o.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{ padding: '13px 28px', fontSize: '15px', borderRadius: '10px', fontWeight: 600, background: 'var(--accent)', color: 'var(--bg)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
              Start for free →
            </button>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '13px 28px', fontSize: '15px', borderRadius: '10px', fontWeight: 500, background: 'transparent', color: 'var(--text)', border: '1px solid var(--border2)', cursor: 'pointer' }}>
              View demo
            </button>
          </div>
          <div style={{ display: 'flex', gap: '40px', marginTop: '52px', justifyContent: 'center' }}>
            {[['24k+','Developers'],['98%','Satisfaction'],['3.2M','AI analyses']].map(([n,l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--text)' }}>{n}</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section id="features" style={{ padding: '80px 32px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>AI Tools</div>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(28px,4vw,46px)', color: 'var(--text)', marginBottom: '12px' }}>Everything a developer needs to grow</h2>
        <p style={{ fontSize: '16px', color: 'var(--text2)', maxWidth: '520px', lineHeight: 1.7, marginBottom: '48px' }}>Five powerful AI tools designed specifically for software engineers at every career stage.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {FEATURES.map((f) => (
            <div key={f.title}
              onClick={() => f.path && navigate(f.path)}
              style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', background: 'var(--bg2)', cursor: f.path ? 'pointer' : 'default', transition: 'all 0.2s', borderStyle: f.path ? 'solid' : 'dashed' }}
              onMouseEnter={e => f.path && (e.currentTarget.style.borderColor = 'rgba(110,231,183,0.3)', e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => f.path && (e.currentTarget.style.borderColor = 'var(--border)', e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--accentDim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '14px' }}>{f.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section id="howitworks" style={{ padding: '80px 32px', maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '80px', alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, maxWidth: '360px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>How it works</div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(28px,4vw,46px)', color: 'var(--text)', marginBottom: '12px' }}>Get results in minutes</h2>
          <p style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.7 }}>No setup, no integrations required. Just sign up and start improving immediately.</p>
        </div>
        <div style={{ flex: 1 }}>
          {[
            ['Create your profile',     'Tell DevMate your current role, skills, and career goals. Takes under 2 minutes.'],
            ['Choose your AI tool',     'Upload your resume, paste code, or start a mock interview. The AI handles the rest.'],
            ['Get instant feedback',    'Receive detailed, actionable analysis in seconds — not hours.'],
            ['Track your progress',     'Your dashboard shows improvement over time across all AI tool sessions.'],
          ].map(([title, desc], i) => (
            <div key={title} style={{ display: 'flex', gap: '24px', paddingBottom: '36px', position: 'relative' }}>
              {i < 3 && <div style={{ position: 'absolute', left: '17px', top: '38px', bottom: 0, width: '1px', background: 'var(--border)' }} />}
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accentDim)', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>{i+1}</div>
              <div style={{ paddingTop: '6px' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────── */}
      <section id="testimonials" style={{ padding: '80px 32px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Testimonials</div>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(28px,4vw,46px)', color: 'var(--text)', marginBottom: '48px' }}>Loved by developers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '16px' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${t.color}20`, color: t.color, fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Instrument Serif, serif' }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{t.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '80px 32px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Pricing</div>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(28px,4vw,46px)', color: 'var(--text)', marginBottom: '48px' }}>Simple, transparent pricing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {[
            { plan: 'Free', price: '$0', desc: 'Perfect for trying DevMate AI.', features: ['100 AI credits/month','3 resume analyses','5 interview sessions','Basic code review','1 learning path'], cta: 'Get started free', featured: false },
            { plan: 'Pro',  price: '$19', desc: 'For developers actively leveling up.', features: ['1,000 AI credits/month','Unlimited resume analyses','Unlimited interviews','Full code review suite','Unlimited learning paths','Priority GPT-4o'], cta: 'Start Pro trial →', featured: true },
            { plan: 'Team', price: '$49', desc: 'For engineering teams.', features: ['5,000 credits/month','Up to 10 seats','Team analytics','Custom interview banks','API access','Dedicated support'], cta: 'Contact sales', featured: false },
          ].map(p => (
            <div key={p.plan} style={{ border: `1px solid ${p.featured ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '14px', padding: '28px', background: p.featured ? 'linear-gradient(180deg,rgba(110,231,183,0.04),transparent)' : 'var(--bg2)' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{p.plan}</div>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '40px', color: 'var(--text)', marginBottom: '4px' }}>{p.price}<span style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'DM Sans, sans-serif' }}>/mo</span></div>
              <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '20px', lineHeight: 1.5 }}>{p.desc}</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: '13px', color: 'var(--text2)', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'}`} style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/register')}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '80px 32px', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>FAQ</div>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(28px,4vw,46px)', color: 'var(--text)', marginBottom: '40px' }}>Common questions</h2>
        {FAQS.map((f, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
            <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)' }}>{f.q}</span>
              <span style={{ fontSize: '20px', color: 'var(--text3)', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </div>
            {openFaq === i && (
              <div style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, paddingBottom: '20px' }}>{f.a}</div>
            )}
          </div>
        ))}
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '80px 32px', background: 'linear-gradient(180deg,transparent,rgba(110,231,183,0.03))' }}>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(28px,4vw,52px)', color: 'var(--text)', marginBottom: '14px' }}>Ready to accelerate your career?</h2>
        <p style={{ fontSize: '16px', color: 'var(--text2)', marginBottom: '32px' }}>Join 24,000+ developers already using DevMate AI.</p>
        <button onClick={() => navigate('/register')} style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '10px', fontWeight: 700, background: 'var(--accent)', color: 'var(--bg)', border: 'none', cursor: 'pointer' }}>
          Get started for free →
        </button>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '48px 32px 32px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
          <div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '18px', marginBottom: '10px' }}>DevMate AI</div>
            <div style={{ fontSize: '13px', color: 'var(--text3)', lineHeight: 1.6 }}>The AI intelligence platform<br/>built for software developers.</div>
          </div>
          {[
            { title: 'Product', links: ['Resume Analyzer','Interview Trainer','Code Reviewer','Learning Paths'] },
            { title: 'Company', links: ['About','Blog','Careers','Press'] },
            { title: 'Legal',   links: ['Privacy','Terms','Security','Cookies'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {col.links.map(l => <span key={l} style={{ fontSize: '13px', color: 'var(--text3)', cursor: 'pointer' }}>{l}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text3)' }}>© 2026 DevMate AI. All rights reserved.</span>
          <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Made with ♥ for developers</span>
        </div>
      </footer>
    </div>
  );
}
