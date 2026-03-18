import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { PageHeader, StatCard, ActivityItem, Card } from '../components/ui';

const TOOLS = [
  { icon: '📄', title: 'Resume Analyzer',  desc: 'ATS optimization & role-specific AI feedback.',  path: '/resume',      stat: '23 analyses' },
  { icon: '🎯', title: 'Interview Trainer', desc: 'Practice technical & behavioral interviews.',     path: '/interview',   stat: '14 sessions' },
  { icon: '⚡', title: 'Code Reviewer',    desc: 'Instant security, performance & best practices.', path: '/code-review', stat: '38 reviews' },
  { icon: '🗺️', title: 'Learning Paths',  desc: 'Personalized AI roadmaps toward your goal.',      path: '/learning',    stat: '3 active' },
  { icon: '🔍', title: 'Bug Fix AI',       desc: 'Paste error, get root cause & fix instantly.',    path: '/bug-fix',     stat: '12 fixed' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title={`Good morning, ${user?.name?.split(' ')[0] || 'Developer'} 👋`}
        subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · ${user?.credits ?? 0} credits remaining · ${user?.plan || 'free'} plan`}
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '28px' }}>
        <StatCard label="Analyses run"  value="142"  delta="↑ 12 this week" />
        <StatCard label="Avg AI score"  value="84"   delta="↑ +6 pts" />
        <StatCard label="Code reviews"  value="38"   delta="↑ 4 this week" />
        <StatCard label="Credits left"  value={user?.credits ?? 0} delta="of 1000/mo" deltaColor="var(--text3)" />
      </div>

      {/* Tools grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px', marginBottom: '20px' }}>
        {TOOLS.map(t => (
          <div key={t.path}
            className="card"
            onClick={() => navigate(t.path)}
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{t.icon}</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>{t.title}</div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5 }}>{t.desc}</div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--accent)' }}>{t.stat} →</div>
          </div>
        ))}
        {/* Upgrade card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(110,231,183,0.06), transparent)', borderColor: 'rgba(110,231,183,0.2)', cursor: 'pointer' }}
          onClick={() => navigate('/settings')}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>⭐</div>
          <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>Upgrade to Pro</div>
          <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5 }}>Unlock 1,000 credits/mo, GPT-4o, and unlimited AI sessions.</div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--accent)' }}>$19/mo — Start free trial →</div>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)', marginBottom: '16px' }}>Recent Activity</div>
        <ActivityItem color="#6366f1" label="<strong>Resume analyzed</strong> — Senior Frontend Engineer role" time="2h ago" detail="ATS Score: 82/100" />
        <ActivityItem color="var(--amber)" label="<strong>Code review</strong> — useEffect cleanup pattern flagged" time="5h ago" />
        <ActivityItem color="var(--accent)" label="<strong>Mock interview</strong> — System design session" time="Yesterday" detail="Score: 78/100" />
        <ActivityItem color="#a78bfa" label="<strong>Learning path</strong> — React Advanced Patterns, step 4/8" time="2d ago" />
        <ActivityItem color="var(--red)" label="<strong>Bug fix</strong> — Async/await race condition diagnosed" time="3d ago" />
      </Card>
    </div>
  );
}
