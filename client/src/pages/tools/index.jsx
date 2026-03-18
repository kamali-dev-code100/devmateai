import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageHeader, Card, FormGroup } from '../../components/ui';
import ChatWindow from '../../components/shared/ChatWindow';
import { resumeService, interviewService, codeReviewService, learningPathService, bugFixService } from '../../services';

// ─── ResumeAnalyzer ───────────────────────────────────────────
export function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Paste your resume text and target role, then click "Analyze Resume" for a full ATS analysis with keyword coverage, score, and improvement suggestions.' }
  ]);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return toast.error('Please paste your resume text');
    setLoading(true);
    try {
      const { data } = await resumeService.analyze({ resumeText, targetRole: targetRole || 'Software Engineer' });
      const r = data.data;
      setSessionId(r._id);
      setAnalysis(r.analysis);
      const summary = `**Analysis Complete!**\n\n**ATS Score: ${r.analysis.atsScore}/100**\n**Keyword Coverage: ${r.analysis.keywordCoverage}%**\n\n**Strengths:**\n${r.analysis.strengths.map(s => `• ${s}`).join('\n')}\n\n**Top Suggestions:**\n${r.analysis.suggestions.slice(0, 3).map(s => `• ${s}`).join('\n')}\n\n**Missing Keywords:** ${r.analysis.missingKeywords.slice(0, 5).join(', ')}`;
      setMessages(prev => [...prev, { role: 'assistant', content: summary }]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (msg) => {
    if (!sessionId) return toast.error('Please analyze your resume first');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    try {
      const { data } = await resumeService.chat(sessionId, msg);
      setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]);
    } catch { toast.error('Chat failed'); }
  };

  return (
    <div>
      <PageHeader title="Resume Analyzer" subtitle="Upload your resume for ATS optimization and AI-powered feedback" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '14px' }}>Resume Content</div>
            <FormGroup label="Target Role">
              <input className="form-input" placeholder="e.g. Senior React Engineer" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
            </FormGroup>
            <FormGroup label="Resume Text">
              <textarea className="form-input" rows={8} placeholder="Paste your resume text here..." value={resumeText} onChange={e => setResumeText(e.target.value)} />
            </FormGroup>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAnalyze} disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: '14px', height: '14px' }} /> Analyzing...</> : '✦ Analyze Resume (5 credits)'}
            </button>
          </Card>
          {analysis && (
            <Card>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '14px' }}>Score Breakdown</div>
              {[['Summary', analysis.sections?.summary], ['Skills', analysis.sections?.skills], ['Experience', analysis.sections?.experience]].map(([name, s]) => s && (
                <div key={name} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text2)' }}>{name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{s.score}/10</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${s.score * 10}%` }} /></div>
                </div>
              ))}
            </Card>
          )}
        </div>
        <ChatWindow messages={messages} onSend={handleChat} loading={loading} placeholder="Ask about your resume..." />
      </div>
    </div>
  );
}

// ─── InterviewTrainer ─────────────────────────────────────────
export function InterviewTrainer() {
  const [config, setConfig] = useState({ role: 'Senior Frontend Engineer', type: 'system-design', difficulty: 'senior' });
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Configure your interview session and click **Start Interview** to begin. I\'ll ask questions and score each answer in real-time.' }]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const { data } = await interviewService.start(config);
      setSessionId(data.data._id);
      setStarted(true);
      setMessages([{ role: 'assistant', content: data.data.messages[0].content }]);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to start'); }
    finally { setLoading(false); }
  };

  const handleMessage = async (msg) => {
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const { data } = await interviewService.message(sessionId, msg);
      setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]);
    } catch { toast.error('Failed to send message'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Interview Trainer" subtitle="Practice technical & behavioral interviews with AI scoring" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
        <Card>
          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '14px' }}>Session Setup</div>
          <FormGroup label="Target Role">
            <input className="form-input" value={config.role} onChange={e => setConfig({ ...config, role: e.target.value })} />
          </FormGroup>
          <FormGroup label="Interview Type">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
              {[['system-design', 'System Design'], ['technical', 'Algorithms / DS'], ['behavioral', 'Behavioral'], ['mixed', 'Mixed']].map(([v, l]) => (
                <div key={v} onClick={() => setConfig({ ...config, type: v })}
                  style={{ padding: '8px 12px', border: `1px solid ${config.type === v ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '7px', cursor: 'pointer', fontSize: '13px', color: config.type === v ? 'var(--accent)' : 'var(--text2)', background: config.type === v ? 'var(--accentDim)' : 'transparent' }}>{l}</div>
              ))}
            </div>
          </FormGroup>
          <FormGroup label="Difficulty">
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['junior', 'mid', 'senior', 'staff'].map(d => (
                <div key={d} onClick={() => setConfig({ ...config, difficulty: d })}
                  style={{ padding: '6px 12px', border: `1px solid ${config.difficulty === d ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '7px', cursor: 'pointer', fontSize: '12px', color: config.difficulty === d ? 'var(--accent)' : 'var(--text2)', background: config.difficulty === d ? 'var(--accentDim)' : 'transparent', textTransform: 'capitalize' }}>{d}</div>
              ))}
            </div>
          </FormGroup>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleStart} disabled={loading || started}>
            {loading ? <><span className="spinner" style={{ width: '14px', height: '14px' }} /> Starting...</> : started ? '✓ Session Active' : '✦ Start Interview (1 credit)'}
          </button>
        </Card>
        <ChatWindow messages={messages} onSend={handleMessage} loading={loading} placeholder={started ? 'Type your answer...' : 'Start the session first'} />
      </div>
    </div>
  );
}

// ─── CodeReviewer ─────────────────────────────────────────────
export function CodeReviewer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Paste your code and click **Review Code** for an instant security audit, performance analysis, and best practice check.' }]);

  const handleReview = async () => {
    if (!code.trim()) return toast.error('Please paste some code');
    setLoading(true);
    try {
      const { data } = await codeReviewService.review({ code, language });
      const r = data.data.review;
      setReview(r);
      setSessionId(data.data._id);
      setMessages(prev => [...prev, { role: 'assistant', content: `**Review Complete — Score: ${r.overallScore}/100**\n\n${r.summary}\n\nFound ${r.issues?.length || 0} issues. Ask me anything about the review!` }]);
    } catch (err) { toast.error(err.response?.data?.message || 'Review failed'); }
    finally { setLoading(false); }
  };

  const handleChat = async (msg) => {
    if (!sessionId) return toast.error('Please review code first');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    try {
      const { data } = await codeReviewService.chat(sessionId, msg);
      setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]);
    } catch { toast.error('Chat failed'); }
  };

  const severityColor = { critical: 'var(--red)', warning: 'var(--amber)', info: 'var(--blue)', good: 'var(--accent)' };

  return (
    <div>
      <PageHeader title="Code Reviewer" subtitle="Paste code for instant AI review — security, performance & best practices" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>Code Input</div>
              <select className="form-input" style={{ width: 'auto', padding: '4px 10px', fontSize: '12px' }} value={language} onChange={e => setLanguage(e.target.value)}>
                {['javascript', 'typescript', 'python', 'go', 'rust', 'java', 'cpp'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <textarea className="form-input font-mono" rows={10} style={{ fontSize: '12px', lineHeight: 1.7 }} placeholder="// Paste your code here..." value={code} onChange={e => setCode(e.target.value)} />
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} onClick={handleReview} disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: '14px', height: '14px' }} /> Reviewing...</> : '⚡ Review Code (3 credits)'}
            </button>
          </Card>
          {review && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>Issues Found</div>
                <span className={`badge ${review.overallScore >= 80 ? 'badge-green' : review.overallScore >= 60 ? 'badge-amber' : 'badge-red'}`}>{review.overallScore}/100</span>
              </div>
              {review.issues?.map((issue, i) => (
                <div key={i} className={`review-item ${issue.severity}`}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: severityColor[issue.severity], marginBottom: '4px' }}>
                    {issue.severity} — {issue.category}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{issue.message}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '3px' }}>{issue.suggestion}</div>
                </div>
              ))}
            </Card>
          )}
        </div>
        <ChatWindow messages={messages} onSend={handleChat} loading={loading} placeholder="Ask about the review..." />
      </div>
    </div>
  );
}

// ─── LearningPaths ────────────────────────────────────────────
export function LearningPaths() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ goal: '', currentSkills: [], timeline: '3 months' });
  const [newSkill, setNewSkill] = useState('');

  const SKILL_SUGGESTIONS = ['React', 'TypeScript', 'Node.js', 'Python', 'Go', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'PostgreSQL'];

  const handleGenerate = async () => {
    if (!form.goal.trim()) return toast.error('Please describe your goal');
    setLoading(true);
    try {
      const { data } = await learningPathService.generate(form);
      setPaths(prev => [data.data, ...prev]);
      toast.success('Learning path generated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Generation failed'); }
    finally { setLoading(false); }
  };

  const toggleModule = async (pathId, moduleId, completed) => {
    try {
      const { data } = await learningPathService.updateModule(pathId, moduleId, { completed });
      setPaths(prev => prev.map(p => p._id === data.data._id ? data.data : p));
    } catch { toast.error('Failed to update'); }
  };

  const addSkill = (skill) => {
    if (!form.currentSkills.includes(skill)) setForm(prev => ({ ...prev, currentSkills: [...prev.currentSkills, skill] }));
  };

  return (
    <div>
      <PageHeader title="Learning Paths" subtitle="AI-generated personalized roadmaps toward your career goals" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '20px' }}>
        <Card>
          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '14px' }}>Generate New Path</div>
          <FormGroup label="Your Goal">
            <input className="form-input" placeholder="e.g. Become a Staff Frontend Engineer" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} />
          </FormGroup>
          <FormGroup label="Current Skills">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {SKILL_SUGGESTIONS.map(s => (
                <span key={s} className={`chip ${form.currentSkills.includes(s) ? 'active' : ''}`} onClick={() => addSkill(s)}>{s}</span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '6px' }}>
              {form.currentSkills.filter(s => !SKILL_SUGGESTIONS.includes(s)).map(s => (
                <span key={s} className="chip active">{s} <span onClick={() => setForm(p => ({ ...p, currentSkills: p.currentSkills.filter(x => x !== s) }))} style={{ marginLeft: '4px', cursor: 'pointer' }}>×</span></span>
              ))}
            </div>
            <input className="form-input" placeholder="Type custom skill + Enter" value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newSkill.trim()) { addSkill(newSkill.trim()); setNewSkill(''); } }} />
          </FormGroup>
          <FormGroup label="Timeline">
            <div style={{ display: 'flex', gap: '8px' }}>
              {['1 month', '3 months', '6 months'].map(t => (
                <div key={t} onClick={() => setForm({ ...form, timeline: t })}
                  style={{ padding: '7px 14px', border: `1px solid ${form.timeline === t ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: form.timeline === t ? 'var(--accent)' : 'var(--text2)', background: form.timeline === t ? 'var(--accentDim)' : 'transparent' }}>{t}</div>
              ))}
            </div>
          </FormGroup>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleGenerate} disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: '14px', height: '14px' }} /> Generating...</> : '🗺️ Generate Path (5 credits)'}
          </button>
        </Card>
        <div>
          {paths.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '14px' }}>🗺️</div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text2)' }}>No paths yet</div>
              <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '6px' }}>Generate your first AI learning path →</div>
            </Card>
          ) : paths.map(path => (
            <Card key={path._id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)' }}>{path.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>{path.estimatedWeeks} weeks · {path.modules?.length} modules</div>
                </div>
                <span className="badge badge-green">{path.progress}%</span>
              </div>
              <div className="progress-track" style={{ marginBottom: '14px' }}>
                <div className="progress-fill" style={{ width: `${path.progress}%` }} />
              </div>
              {path.modules?.slice(0, 5).map((mod) => (
                <div key={mod._id || mod.order} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <input type="checkbox" checked={mod.completed} onChange={e => mod._id && toggleModule(path._id, mod._id, e.target.checked)}
                    style={{ accentColor: 'var(--accent)', cursor: 'pointer', width: '15px', height: '15px' }} />
                  <div style={{ flex: 1, fontSize: '13px', color: mod.completed ? 'var(--text3)' : 'var(--text)', textDecoration: mod.completed ? 'line-through' : 'none' }}>{mod.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{mod.estimatedHours}h</div>
                </div>
              ))}
              {path.modules?.length > 5 && <div style={{ fontSize: '12px', color: 'var(--text3)', textAlign: 'center', marginTop: '8px' }}>+{path.modules.length - 5} more modules</div>}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BugFixAssistant ──────────────────────────────────────────
export function BugFixAssistant() {
  const [form, setForm] = useState({ bugDescription: '', code: '', errorMessage: '', language: 'javascript' });
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! Describe your bug, paste your code, and include any error messages. I\'ll diagnose the root cause and provide a complete working fix.' }]);

  const handleDiagnose = async () => {
    if (!form.bugDescription && !form.code) return toast.error('Please describe the bug or paste your code');
    setLoading(true);
    try {
      const { data } = await bugFixService.diagnose(form);
      setSessionId(data.data.sessionId);
      const userMsg = form.bugDescription || form.errorMessage || 'See code above';
      setMessages(prev => [...prev, { role: 'user', content: userMsg }, { role: 'assistant', content: data.data.reply }]);
    } catch (err) { toast.error(err.response?.data?.message || 'Diagnosis failed'); }
    finally { setLoading(false); }
  };

  const handleChat = async (msg) => {
    if (!sessionId) return toast.error('Please diagnose a bug first');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const { data } = await bugFixService.message(sessionId, msg);
      setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]);
    } catch { toast.error('Message failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Bug Fix Assistant" subtitle="Describe your bug, paste code, get a root cause diagnosis and fix instantly" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <Card>
            <FormGroup label="Describe the Bug">
              <textarea className="form-input" rows={3} placeholder="e.g. My async function returns undefined even though I'm awaiting it..." value={form.bugDescription} onChange={e => setForm({ ...form, bugDescription: e.target.value })} />
            </FormGroup>
            <FormGroup label="Error Message (optional)">
              <input className="form-input font-mono" style={{ fontSize: '12px' }} placeholder="TypeError: Cannot read properties of undefined..." value={form.errorMessage} onChange={e => setForm({ ...form, errorMessage: e.target.value })} />
            </FormGroup>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Your Code</label>
              <select className="form-input" style={{ width: 'auto', padding: '3px 8px', fontSize: '11px' }} value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                {['javascript', 'typescript', 'python', 'go', 'rust', 'java'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <textarea className="form-input font-mono" rows={8} style={{ fontSize: '12px', lineHeight: 1.7 }} placeholder="// Paste your buggy code here..." value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} onClick={handleDiagnose} disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: '14px', height: '14px' }} /> Diagnosing...</> : '🔍 Diagnose & Fix (2 credits)'}
            </button>
          </Card>
        </div>
        <ChatWindow messages={messages} onSend={handleChat} loading={loading} placeholder="Ask a follow-up about the fix..." />
      </div>
    </div>
  );
}
