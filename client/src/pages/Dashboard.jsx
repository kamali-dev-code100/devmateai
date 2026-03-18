import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../hooks';
import { Icon, IC, Spinner } from '../components/ui/icons';
import { resumeService, interviewService, codeReviewService, learningPathService, bugFixService } from '../services';
import RobotWave from '../components/shared/RobotWave';

// ── Background canvases ────────────────────────────────────────
function DashStars() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); let id;
    const ro = new ResizeObserver(() => { c.width = c.offsetWidth; c.height = c.offsetHeight; });
    ro.observe(c.parentElement);
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const stars = Array.from({ length: 100 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.1 + 0.3, a: Math.random(), s: Math.random() * 0.004 + 0.001 }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      stars.forEach(s => { s.a += s.s * (Math.random() > 0.5 ? 1 : -1); s.a = Math.max(0.05, Math.min(0.7, s.a)); ctx.beginPath(); ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(180,210,255,${s.a})`; ctx.fill(); });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}
function DashNebula() {
  return <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 'clamp(200px,40vw,400px)', height: 'clamp(200px,40vw,400px)', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.07),transparent 70%)', animation: 'dnebula 20s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 'clamp(180px,35vw,350px)', height: 'clamp(180px,35vw,350px)', borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.06),transparent 70%)', animation: 'dnebula 25s ease-in-out infinite reverse' }} />
  </div>;
}
function DashAurora() {
  return <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 'clamp(200px,60vw,600px)', height: '50vh', borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(16,185,129,0.1),rgba(8,145,178,0.06) 40%,transparent 70%)', animation: 'dnebula 14s ease-in-out infinite', filter: 'blur(40px)' }} />
    <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: 'clamp(180px,50vw,500px)', height: '45vh', borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(99,102,241,0.08),rgba(139,92,246,0.05) 40%,transparent 70%)', animation: 'dnebula 18s ease-in-out infinite reverse', filter: 'blur(50px)' }} />
  </div>;
}

// ── Data ───────────────────────────────────────────────────────
// ── Static config (no hardcoded counts) ──────────────────────
const TOOLS_CONFIG = [
  { iconKey: 'resume',    title: 'Resume Analyzer',  desc: 'ATS optimization & AI feedback.',   path: '/resume',      iconColor: '#2563eb', glow: 'rgba(37,99,235,0.12)',  countKey: 'resumes'    },
  { iconKey: 'interview', title: 'Interview Trainer', desc: 'Practice technical interviews.',    path: '/interview',   iconColor: '#059669', glow: 'rgba(5,150,105,0.12)',  countKey: 'interviews' },
  { iconKey: 'code',      title: 'Code Reviewer',     desc: 'Security & performance review.',    path: '/code-review', iconColor: '#d97706', glow: 'rgba(217,119,6,0.12)',  countKey: 'codeReviews'},
  { iconKey: 'learning',  title: 'Learning Paths',    desc: 'AI-curated roadmaps.',              path: '/learning',    iconColor: '#7c3aed', glow: 'rgba(124,58,237,0.12)', countKey: 'learningPaths'},
  { iconKey: 'bug',       title: 'Bug Fix AI',        desc: 'Root cause diagnosis & fix.',       path: '/bug-fix',     iconColor: '#dc2626', glow: 'rgba(220,38,38,0.12)',  countKey: 'bugFixes'   },
];
const QUICK = [
  { iconKey: 'resume',    label: 'Analyze a resume',    path: '/resume',      iconColor: '#2563eb' },
  { iconKey: 'interview', label: 'Start mock interview', path: '/interview',   iconColor: '#059669' },
  { iconKey: 'code',      label: 'Review my code',       path: '/code-review', iconColor: '#d97706' },
  { iconKey: 'bug',       label: 'Fix a bug',             path: '/bug-fix',     iconColor: '#dc2626' },
];
const DAYS = ['M','T','W','T','F','S','S'];

// ── Timeago helper ────────────────────────────────────────────
function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)   return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)    return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1)  return 'Yesterday';
  return `${days}d ago`;
}

// ── Subcomponents ──────────────────────────────────────────────
function StatCard({ stat, T }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...T.card, padding: 'clamp(14px,2vw,18px)', border: `1px solid ${hov ? stat.iconColor + '40' : T.cardBorder}`, transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)', transform: hov ? 'translateY(-3px)' : 'none', boxShadow: hov ? `0 10px 36px ${stat.glowColor}` : T.cardShadow }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${stat.iconColor}15`, border: `1px solid ${stat.iconColor}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.22s', transform: hov ? 'scale(1.1) rotate(-6deg)' : 'none', flexShrink: 0 }}>
          <Icon d={IC[stat.iconKey]} size={16} color={stat.iconColor} />
        </div>
        {stat.delta && <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 7px', borderRadius: '6px', background: 'rgba(16,185,129,0.12)', color: '#059669', flexShrink: 0 }}>{stat.delta}</span>}
      </div>
      <div style={{ fontSize: 'clamp(22px,3vw,28px)', fontWeight: 700, color: T.text1, lineHeight: 1, marginBottom: '3px', fontVariantNumeric: 'tabular-nums', fontFamily: 'DM Sans, sans-serif' }}>{stat.value}</div>
      <div style={{ fontSize: '12px', color: T.text3, marginBottom: '2px', fontFamily: 'DM Sans, sans-serif' }}>{stat.label}</div>
      {stat.iconKey === 'bolt' ? (
        <>
          <div style={{ height: 4, background: T.trackBg, borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
            <div style={{ height: '100%', width: '72%', background: 'linear-gradient(90deg,#10b981,#0891b2)', borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: '10px', color: T.text3, marginTop: 3, fontFamily: 'DM Sans, sans-serif' }}>720 of 1,000/mo</div>
        </>
      ) : (
        <div style={{ fontSize: '11px', color: T.text3, fontFamily: 'DM Sans, sans-serif' }}>{stat.sub}</div>
      )}
    </div>
  );
}

function ToolCard({ tool, onClick, T }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...T.card, padding: 'clamp(14px,2vw,18px)', cursor: 'pointer', border: `1px solid ${hov ? tool.iconColor + '35' : T.cardBorder}`, background: hov ? `${tool.iconColor}08` : T.card.background, transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)', transform: hov ? 'translateY(-3px)' : 'none', boxShadow: hov ? `0 8px 32px ${tool.glow}` : T.cardShadow }}>
      <div style={{ width: 38, height: 38, borderRadius: '10px', background: `${tool.iconColor}15`, border: `1px solid ${tool.iconColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', transition: 'transform 0.2s', transform: hov ? 'scale(1.08)' : 'none', flexShrink: 0 }}>
        <Icon d={IC[tool.iconKey]} size={17} color={tool.iconColor} />
      </div>
      <div style={{ fontSize: 'clamp(12px,1.5vw,13px)', fontWeight: 600, color: T.text1, marginBottom: '4px', fontFamily: 'DM Sans, sans-serif' }}>{tool.title}</div>
      <div style={{ fontSize: '11px', color: T.text2, lineHeight: 1.5, marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>{tool.desc}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', color: tool.iconColor, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>{tool.stat}</span>
        <span style={{ opacity: hov ? 1 : 0, transform: hov ? 'translateX(0)' : 'translateX(-4px)', transition: 'all 0.18s', display: 'flex' }}>
          <Icon d={IC.chevronR} size={13} color={tool.iconColor} />
        </span>
      </div>
    </div>
  );
}

function UsageChart({ T, weekly = [0,0,0,0,0,0,0] }) {
  const [hov, setHov] = useState(null);
  const max = Math.max(...weekly, 1);
  const W = 260, H = 72, bw = 24, gap = (W - bw * 7) / 6;
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} width="100%" style={{ display: 'block' }}>
      {weekly.map((v, i) => {
        const bh = Math.max(4, Math.round((v / max) * H));
        const x = i * (bw + gap), y = H - bh;
        const isHov = hov === i, isTop = i === 3;
        return (
          <g key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ cursor: 'pointer' }}>
            <rect x={x} y={y} width={bw} height={bh} rx="5"
              fill={isHov || isTop ? '#10b981' : T.barFill}
              opacity={isHov ? 1 : isTop ? 0.9 : 0.55}
              style={{ transition: 'all 0.15s', filter: (isHov || isTop) ? 'drop-shadow(0 0 6px rgba(16,185,129,0.5))' : 'none' }} />
            {isHov && <text x={x + bw / 2} y={y - 5} textAnchor="middle" style={{ fontSize: '9px', fill: '#059669', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>{v}</text>}
            <text x={x + bw / 2} y={H + 14} textAnchor="middle" style={{ fontSize: '9px', fill: T.text3, fontFamily: 'DM Sans, sans-serif' }}>{DAYS[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ActivityRow({ act, T }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '9px 0', borderBottom: `1px solid ${T.divider}` }}>
      <div style={{ width: 28, height: 28, borderRadius: '8px', background: `${act.color}14`, border: `1px solid ${act.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        <Icon d={IC[act.iconKey]} size={13} color={act.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '12px', color: T.text2, lineHeight: 1.4, fontFamily: 'DM Sans, sans-serif' }} dangerouslySetInnerHTML={{ __html: act.label }} />
        {act.detail && <div style={{ fontSize: '11px', color: T.text3, marginTop: '1px', fontFamily: 'DM Sans, sans-serif' }}>{act.detail}</div>}
      </div>
      <div style={{ fontSize: '11px', color: T.text3, flexShrink: 0, whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif' }}>{act.time}</div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
  const { user }  = useAuth();
  const { theme } = useTheme();
  const navigate  = useNavigate();
  const isDark    = theme === 'dark';
  const credits   = user?.credits ?? 0;
  const creditsPct = Math.round((credits / 1000) * 100);

  // ── Real data from API ──────────────────────────────────────
  const [stats,      setStats]      = useState(null);
  const [activities, setActivities] = useState([]);
  const [weekly,     setWeekly]     = useState([0,0,0,0,0,0,0]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Fetch all in parallel
        const [resumeRes, interviewRes, codeRes, learningRes, bugRes] = await Promise.allSettled([
          resumeService.getAll?.() || Promise.resolve({ data: { data: [] } }),
          interviewService.getAll?.() || Promise.resolve({ data: { data: [] } }),
          codeReviewService.getAll?.() || Promise.resolve({ data: { data: [] } }),
          learningPathService.getAll?.() || Promise.resolve({ data: { data: [] } }),
          bugFixService.getAll?.() || Promise.resolve({ data: { data: [] } }),
        ]);

        const resumes    = resumeRes.value?.data?.data    || [];
        const interviews = interviewRes.value?.data?.data || [];
        const codeRevs   = codeRes.value?.data?.data      || [];
        const paths      = learningRes.value?.data?.data  || [];
        const bugs       = bugRes.value?.data?.data       || [];

        // Build stats from real data
        const avgScore = resumes.length
          ? Math.round(resumes.reduce((s, r) => s + (r.analysis?.atsScore || 0), 0) / resumes.length)
          : 0;

        setStats({
          resumes:      resumes.length,
          avgScore,
          codeReviews:  codeRevs.length,
          interviews:   interviews.length,
          learningPaths:paths.length,
          bugFixes:     bugs.length,
        });

        // Build activity feed from all recent items
        const allItems = [
          ...resumes.map(r    => ({ iconKey:'resume',    color:'#3b82f6', label:`<strong>Resume analyzed</strong>`, detail: r.analysis?.atsScore ? `ATS Score: ${r.analysis.atsScore}/100` : null, date: r.createdAt })),
          ...interviews.map(i => ({ iconKey:'interview', color:'#10b981', label:`<strong>Interview session</strong>`, detail: i.overallScore ? `Score: ${i.overallScore}/100` : null, date: i.createdAt || i.startedAt })),
          ...codeRevs.map(c   => ({ iconKey:'code',      color:'#f59e0b', label:`<strong>Code reviewed</strong>`,   detail: c.review?.overallScore ? `Score: ${c.review.overallScore}/100` : null, date: c.createdAt })),
          ...paths.map(p      => ({ iconKey:'learning',  color:'#8b5cf6', label:`<strong>Learning path</strong>`,   detail: p.title || null, date: p.createdAt })),
          ...bugs.map(b       => ({ iconKey:'bug',       color:'#ef4444', label:`<strong>Bug diagnosed</strong>`,   detail: null, date: b.createdAt })),
        ]
          .filter(a => a.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map(a => ({ ...a, time: timeAgo(a.date) }));

        setActivities(allItems);

        // Build weekly chart (last 7 days)
        const week = [0,0,0,0,0,0,0];
        const allDates = [...resumes, ...interviews, ...codeRevs, ...paths, ...bugs].map(i => i.createdAt || i.startedAt).filter(Boolean);
        allDates.forEach(d => {
          const dayIdx = 6 - Math.floor((Date.now() - new Date(d)) / 86400000);
          if (dayIdx >= 0 && dayIdx < 7) week[dayIdx]++;
        });
        setWeekly(week);

      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // ── Dynamic stats cards ─────────────────────────────────────
  const STATS = stats ? [
    { iconKey:'resume',    label:'Analyses run',  value: String(stats.resumes),    delta: stats.resumes > 0 ? null : null,   sub:'total',       iconColor:'#2563eb', glowColor:'rgba(37,99,235,0.15)'  },
    { iconKey:'star',      label:'Avg ATS score', value: stats.avgScore ? `${stats.avgScore}` : '—', delta: null, sub:'resume analyses', iconColor:'#059669', glowColor:'rgba(5,150,105,0.15)'  },
    { iconKey:'code',      label:'Code reviews',  value: String(stats.codeReviews), delta: null,                sub:'total',       iconColor:'#d97706', glowColor:'rgba(217,119,6,0.15)'  },
    { iconKey:'bolt',      label:'Credits left',  value: String(credits),           delta: null,                sub:`of 1,000`,    iconColor:'#7c3aed', glowColor:'rgba(124,58,237,0.15)' },
  ] : [
    { iconKey:'resume',    label:'Analyses run',  value:'—', delta:null, sub:'loading...', iconColor:'#2563eb', glowColor:'rgba(37,99,235,0.15)'  },
    { iconKey:'star',      label:'Avg ATS score', value:'—', delta:null, sub:'loading...', iconColor:'#059669', glowColor:'rgba(5,150,105,0.15)'  },
    { iconKey:'code',      label:'Code reviews',  value:'—', delta:null, sub:'loading...', iconColor:'#d97706', glowColor:'rgba(217,119,6,0.15)'  },
    { iconKey:'bolt',      label:'Credits left',  value: String(credits), delta:null, sub:'of 1,000', iconColor:'#7c3aed', glowColor:'rgba(124,58,237,0.15)' },
  ];

  const TOOLS = TOOLS_CONFIG.map(t => ({
    ...t,
    stat: stats
      ? (stats[t.countKey] > 0 ? `${stats[t.countKey]} ${t.countKey === 'resumes' ? 'analyses' : t.countKey === 'interviews' ? 'sessions' : t.countKey === 'codeReviews' ? 'reviews' : t.countKey === 'learningPaths' ? 'active' : 'fixed'}` : 'Try it →')
      : '...',
  }));

  const T = {
    text1:      isDark ? '#ffffff'                         : '#0f1117',
    text2:      isDark ? 'rgba(255,255,255,0.62)'         : 'rgba(0,0,0,0.62)',
    text3:      isDark ? 'rgba(255,255,255,0.35)'         : 'rgba(0,0,0,0.42)',
    cardBorder: isDark ? 'rgba(255,255,255,0.08)'         : 'rgba(0,0,0,0.09)',
    cardShadow: isDark ? '0 2px 12px rgba(0,0,0,0.2)'    : '0 2px 12px rgba(0,0,0,0.06)',
    divider:    isDark ? 'rgba(255,255,255,0.05)'         : 'rgba(0,0,0,0.07)',
    trackBg:    isDark ? 'rgba(255,255,255,0.08)'         : 'rgba(0,0,0,0.08)',
    barFill:    isDark ? 'rgba(16,185,129,0.25)'          : 'rgba(16,185,129,0.22)',
    sectionLbl: isDark ? 'rgba(255,255,255,0.3)'          : 'rgba(0,0,0,0.4)',
    upgradeBg:  isDark ? 'rgba(16,185,129,0.08)'          : 'rgba(16,185,129,0.07)',
    upgradeBrd: isDark ? 'rgba(16,185,129,0.2)'           : 'rgba(16,185,129,0.25)',
    quickBrd:   isDark ? 'rgba(255,255,255,0.07)'         : 'rgba(0,0,0,0.07)',
    quickHov:   isDark ? 'rgba(255,255,255,0.05)'         : 'rgba(0,0,0,0.04)',
    card: {
      background:           isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.85)',
      border:               `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)'}`,
      borderRadius:         '14px',
      backdropFilter:       'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    },
  };

  const Panel = ({ children, style = {} }) => (
    <div style={{ ...T.card, padding: 'clamp(14px,2vw,18px)', boxShadow: T.cardShadow, ...style }}>{children}</div>
  );

  const SectionLabel = ({ children }) => (
    <div style={{ fontSize: '10px', fontWeight: 700, color: T.sectionLbl, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>{children}</div>
  );

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  };

  return (
    <>
      <style>{`
        @keyframes dnebula  { 0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(16px,-16px) scale(1.04)} }
        @keyframes dfadeUp  { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none} }
        @keyframes devmate-spin { to{transform:rotate(360deg)} }
        .ds { animation: dfadeUp 0.4s ease both; }

        /* ── Mobile first grid system ── */
        .stats-grid  { display:grid; grid-template-columns:1fr 1fr;        gap:10px; }
        .chart-grid  { display:grid; grid-template-columns:1fr;             gap:10px; }
        .tools-grid  { display:grid; grid-template-columns:1fr 1fr;         gap:10px; }
        .bottom-grid { display:grid; grid-template-columns:1fr;             gap:10px; }
        .dqrow { transition:all 0.15s ease !important; }
        .dqrow:hover { background:${T.quickHov} !important; transform:translateX(3px); }

        /* ── 360px — very small phones: 1 col stats ── */
        @media(max-width:360px) {
          .stats-grid { grid-template-columns:1fr; }
          .tools-grid { grid-template-columns:1fr; }
        }
        /* ── 640px — tablet: 3-col tools ── */
        @media(min-width:640px) {
          .tools-grid { grid-template-columns:repeat(3,1fr); gap:12px; }
          .stats-grid { gap:12px; }
        }
        /* ── 768px — tablet landscape: side-by-side chart/credits ── */
        @media(min-width:768px) {
          .chart-grid  { grid-template-columns:minmax(0,1.6fr) minmax(0,1fr); gap:14px; }
          .bottom-grid { grid-template-columns:minmax(0,1fr) minmax(0,260px); gap:14px; }
        }
        /* ── 1024px — desktop: 4-col stats, auto tools ── */
        @media(min-width:1024px) {
          .stats-grid { grid-template-columns:repeat(4,1fr); gap:14px; }
          .tools-grid { grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:12px; }
        }
      `}</style>

      {isDark ? <><DashStars /><DashNebula /></> : <DashAurora />}

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div className="ds" style={{ animationDelay: '0ms', marginBottom: 'clamp(16px,3vw,24px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px,2vw,14px)' }}>
            {/* Mini robot — custom SVG, no watermark */}
            <RobotWave size={72} isDark={isDark} />
            {/* Text */}
            <div>
              <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(18px,3vw,24px)', color: T.text1, marginBottom: '4px', fontWeight: 400, margin: '0 0 4px' }}>
                {greeting()}, {user?.name?.split(' ')[0] || 'Developer'}
              </h1>
              <p style={{ fontSize: 'clamp(11px,1.5vw,13px)', color: T.text3, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {user?.plan || 'free'} plan
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="ds stats-grid" style={{ animationDelay: '50ms', marginBottom: 'clamp(8px,2vw,14px)' }}>
          {STATS.map(s => <StatCard key={s.iconKey} stat={s} T={T} />)}
        </div>

        {/* ── Chart + Credits ── */}
        <div className="ds chart-grid" style={{ animationDelay: '100ms', marginBottom: 'clamp(8px,2vw,14px)' }}>
          <Panel>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '6px' }}>
              <div>
                <div style={{ fontSize: 'clamp(12px,1.5vw,13px)', fontWeight: 600, color: T.text1, fontFamily: 'DM Sans, sans-serif' }}>AI usage this week</div>
                <div style={{ fontSize: '11px', color: T.text3, marginTop: '2px', fontFamily: 'DM Sans, sans-serif' }}>{weekly.reduce((a,b)=>a+b,0)} total this week · hover for details</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.12)', color: '#059669', flexShrink: 0, fontFamily: 'DM Sans, sans-serif' }}>↑ 18%</span>
            </div>
            <UsageChart T={T} weekly={weekly} />
          </Panel>

          <Panel style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 'clamp(12px,1.5vw,13px)', fontWeight: 600, color: T.text1, marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>Credits usage</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '10px' }}>
              <span style={{ fontSize: 'clamp(24px,4vw,30px)', fontWeight: 700, color: T.text1, lineHeight: 1, fontFamily: 'DM Sans, sans-serif' }}>{user?.credits ?? 0}</span>
              <span style={{ fontSize: '12px', color: T.text3, fontFamily: 'DM Sans, sans-serif' }}>/ 1,000</span>
            </div>
            <div style={{ height: 5, background: T.trackBg, borderRadius: 3, overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ height: '100%', width: `${creditsPct}%`, background: 'linear-gradient(90deg,#10b981,#0891b2)', borderRadius: 3, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)', boxShadow: '0 0 10px rgba(16,185,129,0.35)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: T.text3, marginBottom: '14px', flexWrap: 'wrap', gap: '4px', fontFamily: 'DM Sans, sans-serif' }}>
              <span>{creditsPct}% remaining</span><span>Resets Apr 1</span>
            </div>
            {/* Upgrade card */}
            <div onClick={() => navigate('/settings')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: T.upgradeBg, border: `1px solid ${T.upgradeBrd}`, cursor: 'pointer', transition: 'all 0.18s', marginTop: 'auto', minHeight: 44 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.14)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.upgradeBg; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ width: 30, height: 30, borderRadius: '8px', background: 'linear-gradient(135deg,#10b981,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d={IC.bolt} size={14} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: T.text1, fontFamily: 'DM Sans, sans-serif' }}>Upgrade to Pro</div>
                <div style={{ fontSize: '11px', color: T.text3, fontFamily: 'DM Sans, sans-serif' }}>GPT-4o + unlimited credits</div>
              </div>
              <Icon d={IC.chevronR} size={13} color={T.text3} />
            </div>
          </Panel>
        </div>

        {/* ── AI Tools ── */}
        <div className="ds" style={{ animationDelay: '150ms', marginBottom: 'clamp(8px,2vw,14px)' }}>
          <SectionLabel>AI Tools</SectionLabel>
          <div className="tools-grid">
            {TOOLS.map(t => <ToolCard key={t.path} tool={t} onClick={() => navigate(t.path)} T={T} />)}
            {/* Upgrade tool card */}
            <div onClick={() => navigate('/settings')}
              style={{ ...T.card, padding: 'clamp(14px,2vw,18px)', cursor: 'pointer', border: `1px dashed ${isDark?'rgba(16,185,129,0.22)':'rgba(16,185,129,0.28)'}`, transition: 'all 0.2s', display: 'flex', flexDirection: 'column', boxShadow: T.cardShadow }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.6)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = isDark?'rgba(16,185,129,0.22)':'rgba(16,185,129,0.28)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ width: 38, height: 38, borderRadius: '10px', background: 'linear-gradient(135deg,#10b981,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <Icon d={IC.sparkles} size={17} color="#fff" />
              </div>
              <div style={{ fontSize: 'clamp(12px,1.5vw,13px)', fontWeight: 600, color: T.text1, marginBottom: '4px', fontFamily: 'DM Sans, sans-serif' }}>Upgrade to Pro</div>
              <div style={{ fontSize: '11px', color: T.text2, lineHeight: 1.5, marginBottom: '10px', flex: 1, fontFamily: 'DM Sans, sans-serif' }}>GPT-4o, 1,000 credits/mo, unlimited sessions.</div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>$19/mo — free trial →</div>
            </div>
          </div>
        </div>

        {/* ── Bottom: Activity + Quick Actions ── */}
        <div className="ds bottom-grid" style={{ animationDelay: '200ms' }}>
          <Panel>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: 'clamp(12px,1.5vw,13px)', fontWeight: 600, color: T.text1, fontFamily: 'DM Sans, sans-serif' }}>Recent activity</span>
              <span style={{ fontSize: '11px', color: T.text3, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>View all →</span>
            </div>
            {loading ? (
            [1,2,3].map(i => (
              <div key={i} style={{ display:'flex', gap:'10px', padding:'9px 0', borderBottom:`1px solid ${T.divider}`, alignItems:'center' }}>
                <div style={{ width:28, height:28, borderRadius:'8px', background:T.trackBg, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ height:10, width:'60%', background:T.trackBg, borderRadius:4, marginBottom:5 }} />
                  <div style={{ height:8,  width:'35%', background:T.trackBg, borderRadius:4 }} />
                </div>
              </div>
            ))
          ) : activities.length > 0 ? (
            activities.map((a, i) => <ActivityRow key={i} act={a} T={T} />)
          ) : (
            <div style={{ textAlign:'center', padding:'24px 0' }}>
              <div style={{ width:40, height:40, borderRadius:'12px', background:T.trackBg, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px' }}>
                <Icon d={IC.activity} size={18} color={T.text3} />
              </div>
              <div style={{ fontSize:'13px', fontWeight:600, color:T.text2, fontFamily:'DM Sans, sans-serif', marginBottom:4 }}>No activity yet</div>
              <div style={{ fontSize:'12px', color:T.text3, fontFamily:'DM Sans, sans-serif' }}>Use any AI tool to see your history here</div>
            </div>
          )}
          </Panel>

          <Panel>
            <div style={{ fontSize: 'clamp(12px,1.5vw,13px)', fontWeight: 600, color: T.text1, marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>Quick actions</div>
            {QUICK.map((qa, i) => (
              <div key={i} className="dqrow" onClick={() => navigate(qa.path)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '10px', border: `1px solid ${T.quickBrd}`, cursor: 'pointer', marginBottom: '8px', background: 'transparent', minHeight: 44, transition: 'all 0.15s' }}>
                <div style={{ width: 30, height: 30, borderRadius: '8px', background: `${qa.iconColor}14`, border: `1px solid ${qa.iconColor}24`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon d={IC[qa.iconKey]} size={14} color={qa.iconColor} />
                </div>
                <span style={{ fontSize: '12px', color: T.text2, flex: 1, fontWeight: 500, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif' }}>{qa.label}</span>
                <Icon d={IC.chevronR} size={12} color={T.text3} />
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </>
  );
}