import { useState } from 'react';
import toast from 'react-hot-toast';
import { resumeService, interviewService, codeReviewService, learningPathService, bugFixService } from '../../services';
import { useTheme } from '../../hooks';
import { Icon, IC, Spinner, PrimaryBtn } from '../../components/ui/Icons';

// ── Theme hook ────────────────────────────────────────────────
function useT() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return {
    isDark,
    text1:      isDark ? '#ffffff'                       : '#0f1117',
    text2:      isDark ? 'rgba(255,255,255,0.62)'       : 'rgba(0,0,0,0.62)',
    text3:      isDark ? 'rgba(255,255,255,0.35)'       : 'rgba(0,0,0,0.42)',
    accent:                                                '#10b981',
    accentDim:  isDark ? 'rgba(16,185,129,0.12)'        : 'rgba(16,185,129,0.09)',
    accentTxt:  isDark ? '#6ee7b7'                       : '#059669',
    border:     isDark ? 'rgba(255,255,255,0.08)'       : 'rgba(0,0,0,0.09)',
    cardBg:     isDark ? 'rgba(255,255,255,0.03)'       : 'rgba(255,255,255,0.85)',
    inputBg:    isDark ? 'rgba(255,255,255,0.05)'       : 'rgba(255,255,255,0.9)',
    inputBrd:   isDark ? 'rgba(255,255,255,0.12)'       : 'rgba(0,0,0,0.12)',
    shadow:     isDark ? '0 2px 12px rgba(0,0,0,0.2)'  : '0 2px 12px rgba(0,0,0,0.06)',
    trackBg:    isDark ? 'rgba(255,255,255,0.08)'       : 'rgba(0,0,0,0.08)',
    divider:    isDark ? 'rgba(255,255,255,0.06)'       : 'rgba(0,0,0,0.07)',
    chatUser:   isDark ? 'rgba(16,185,129,0.14)'        : 'rgba(16,185,129,0.1)',
    chatAI:     isDark ? 'rgba(255,255,255,0.04)'       : 'rgba(0,0,0,0.03)',
    red:  '#ef4444', amber: '#f59e0b', blue: '#3b82f6',
  };
}

// ── Shared Layout Components ──────────────────────────────────

function PageHeader({ iconKey, title, subtitle, color = '#10b981' }) {
  const T = useT();
  return (
    <div style={{ marginBottom: 'clamp(16px,3vw,28px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '5px' }}>
        <div style={{ width: 38, height: 38, borderRadius: '11px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon d={IC[iconKey]} size={18} color={color} />
        </div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(18px,3vw,24px)', color: T.text1, fontWeight: 400, margin: 0 }}>{title}</h1>
      </div>
      <p style={{ fontSize: 'clamp(12px,1.5vw,13px)', color: T.text3, marginLeft: '49px', fontFamily: 'DM Sans, sans-serif' }}>{subtitle}</p>
    </div>
  );
}

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

function Input({ value, onChange, placeholder, style = {} }) {
  const T = useT();
  return (
    <input value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: '100%', padding: '10px 13px', background: T.inputBg, border: `1px solid ${T.inputBrd}`, borderRadius: '9px', color: T.text1, fontSize: '13px', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', minHeight: 44, ...style }}
      onFocus={e => e.target.style.borderColor = '#10b981'}
      onBlur={e => e.target.style.borderColor = T.inputBrd} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 6, mono = false, style = {} }) {
  const T = useT();
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{ width: '100%', padding: '10px 13px', background: T.inputBg, border: `1px solid ${T.inputBrd}`, borderRadius: '9px', color: T.text1, fontSize: mono ? '12px' : '13px', lineHeight: mono ? 1.7 : 1.6, outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box', resize: 'vertical', fontFamily: mono ? '"Fira Code","Cascadia Code",monospace' : 'DM Sans, sans-serif', ...style }}
      onFocus={e => e.target.style.borderColor = '#10b981'}
      onBlur={e => e.target.style.borderColor = T.inputBrd} />
  );
}

function SelectInput({ value, onChange, options, style = {} }) {
  const T = useT();
  return (
    <select value={value} onChange={onChange}
      style={{
        padding: '8px 12px',
        background: T.isDark ? '#1a1a2e' : '#ffffff',
        border: `1px solid ${T.inputBrd}`,
        borderRadius: '9px',
        color: T.text1,
        fontSize: '12px',
        cursor: 'pointer',
        outline: 'none',
        fontFamily: 'DM Sans, sans-serif',
        minHeight: 36,
        colorScheme: T.isDark ? 'dark' : 'light',
        ...style
      }}>
      {options.map(o => (
        <option
          key={o}
          value={o}
          style={{
            background: T.isDark ? '#1a1a2e' : '#ffffff',
            color: T.text1,
          }}
        >
          {o}
        </option>
      ))}
    </select>
  );
}

function OptionChip({ label, active, onClick, color = '#10b981' }) {
  const T = useT();
  return (
    <div onClick={onClick} style={{ padding: '7px 13px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: active ? 600 : 400, border: `1px solid ${active ? color : T.border}`, color: active ? color : T.text2, background: active ? `${color}14` : 'transparent', transition: 'all 0.15s', userSelect: 'none', minHeight: 36, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif' }}>
      {label}
    </div>
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

// ── Chat Window ───────────────────────────────────────────────
function ChatWindow({ messages, onSend, loading, placeholder = 'Type a message...' }) {
  const T = useT();
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
        p.startsWith('**') ? <strong key={j} style={{ color: T.text1, fontWeight: 600 }}>{p.slice(2,-2)}</strong> : p
      );
      return <div key={i} style={{ marginBottom: line === '' ? '5px' : '1px', lineHeight: 1.65 }}>{parts}</div>;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'clamp(300px,50vh,520px)', background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: '14px', backdropFilter: 'blur(16px)', overflow: 'hidden', boxShadow: T.shadow }}>
      {/* Header */}
      <div style={{ padding: '11px 15px', borderBottom: `1px solid ${T.divider}`, display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.6)', flexShrink: 0 }} />
        <span style={{ fontSize: '12px', fontWeight: 600, color: T.text2, fontFamily: 'DM Sans, sans-serif' }}>AI Assistant</span>
        {loading && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '3px', alignItems: 'center' }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: `chatBounce 1s ease-in-out ${i*0.15}s infinite` }} />)}
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', WebkitOverflowScrolling: 'touch' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
            {m.role !== 'user' && (
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d={IC.sparkles} size={12} color="#fff" />
              </div>
            )}
            <div style={{ maxWidth: 'min(85%,480px)', padding: '9px 13px', borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: m.role === 'user' ? T.chatUser : T.chatAI, border: `1px solid ${m.role === 'user' ? 'rgba(16,185,129,0.2)' : T.border}`, fontSize: '13px', color: T.text2, lineHeight: 1.65, wordBreak: 'break-word', fontFamily: 'DM Sans, sans-serif' }}>
              {renderContent(m.content)}
            </div>
            {m.role === 'user' && (
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: T.inputBg, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d={IC.user} size={12} color={T.text3} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon d={IC.sparkles} size={12} color="#fff" />
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '14px 14px 14px 3px', background: T.chatAI, border: `1px solid ${T.border}`, display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[0,1,2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: T.text3, display: 'inline-block', animation: `chatBounce 1.1s ease-in-out ${i*0.15}s infinite` }} />)}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px', borderTop: `1px solid ${T.divider}`, display: 'flex', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={placeholder} rows={1}
          style={{ flex: 1, padding: '9px 12px', background: T.inputBg, border: `1px solid ${T.inputBrd}`, borderRadius: '9px', color: T.text1, fontSize: '13px', resize: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s', lineHeight: 1.5 }}
          onFocus={e => e.target.style.borderColor = '#10b981'}
          onBlur={e => e.target.style.borderColor = T.inputBrd} />
        <button onClick={send} disabled={!input.trim() || loading}
          style={{ width: 38, height: 38, borderRadius: '9px', border: 'none', flexShrink: 0, background: !input.trim() || loading ? T.trackBg : 'linear-gradient(135deg,#10b981,#0891b2)', color: !input.trim() || loading ? T.text3 : '#fff', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
          {loading ? <Spinner size={13} color={T.text3} /> : <Icon d={IC.send} size={14} />}
        </button>
      </div>
    </div>
  );
}

const GLOBAL_STYLES = ` select { color-scheme: inherit; }
  .dark select, .dark select option { background: #1a1a2e !important; color: #fff !important; }
  .light select, .light select option { background: #ffffff !important; color: #111 !important; }
  @keyframes chatBounce { 0%,80%,100%{transform:scale(0.8);opacity:0.5}40%{transform:scale(1.2);opacity:1} }
  @keyframes devmate-spin { to{transform:rotate(360deg)} }
  @keyframes tfadeUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none} }
  .tool-anim { animation: tfadeUp 0.35s ease both; }
  .tool-grid       { display:grid; grid-template-columns:1fr;          gap:clamp(12px,2vw,20px); align-items:start; }
  .tool-grid-wide  { display:grid; grid-template-columns:1fr;          gap:clamp(12px,2vw,20px); align-items:start; }
  .tool-grid-rwide { display:grid; grid-template-columns:1fr;          gap:clamp(12px,2vw,20px); align-items:start; }
  @media(min-width:768px) {
    .tool-grid       { grid-template-columns:1fr 1fr; }
    .tool-grid-wide  { grid-template-columns:1fr 1.5fr; }
    .tool-grid-rwide { grid-template-columns:1fr 1.3fr; }
  }
  .tchip { display:inline-flex; align-items:center; padding:5px 10px; border-radius:7px; font-size:12px; font-weight:500; cursor:pointer; transition:all 0.15s; user-select:none; font-family:'DM Sans',sans-serif; }
  .flex-wrap-row { display:flex; flex-wrap:wrap; gap:6px; }
`;

// ─── ResumeAnalyzer ───────────────────────────────────────────
export function ResumeAnalyzer() {
  const T = useT();
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading]       = useState(false);
  const [sessionId, setSessionId]   = useState(null);
  const [analysis, setAnalysis]     = useState(null);
  const [messages, setMessages]     = useState([{ role: 'assistant', content: 'Hi! Paste your resume text and target role, then click **Analyze Resume** for a full ATS analysis with keyword coverage, score, and improvement suggestions.' }]);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return toast.error('Please paste your resume text');
    setLoading(true);
    try {
      const { data } = await resumeService.analyze({ resumeText, targetRole: targetRole || 'Software Engineer' });
      const r = data.data;
      setSessionId(r._id); setAnalysis(r.analysis);
      setMessages(prev => [...prev, { role: 'assistant', content: `**Analysis Complete!**\n\n**ATS Score: ${r.analysis.atsScore}/100**\n**Keyword Coverage: ${r.analysis.keywordCoverage}%**\n\n**Strengths:**\n${r.analysis.strengths.map(s=>`• ${s}`).join('\n')}\n\n**Top Suggestions:**\n${r.analysis.suggestions.slice(0,3).map(s=>`• ${s}`).join('\n')}\n\n**Missing Keywords:** ${r.analysis.missingKeywords.slice(0,5).join(', ')}` }]);
    } catch (err) { toast.error(err.response?.data?.message || 'Analysis failed'); }
    finally { setLoading(false); }
  };
  const handleChat = async (msg) => {
    if (!sessionId) return toast.error('Please analyze your resume first');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    try { const { data } = await resumeService.chat(sessionId, msg); setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]); }
    catch { toast.error('Chat failed'); }
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="tool-anim">
        <PageHeader iconKey="resume" title="Resume Analyzer" subtitle="Upload your resume for ATS optimization and AI-powered feedback" color="#2563eb" />
        <div className="tool-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px,2vw,14px)' }}>
            <Card>
              <div style={{ fontSize: '13px', fontWeight: 600, color: T.text1, marginBottom: '14px', fontFamily: 'DM Sans, sans-serif' }}>Resume Content</div>
              <div style={{ marginBottom: '12px' }}><FieldLabel>Target Role</FieldLabel><Input value={targetRole} onChange={e=>setTargetRole(e.target.value)} placeholder="e.g. Senior React Engineer" /></div>
              <div style={{ marginBottom: '14px' }}><FieldLabel>Resume Text</FieldLabel><Textarea rows={8} value={resumeText} onChange={e=>setResumeText(e.target.value)} placeholder="Paste your full resume text here..." /></div>
              <PrimaryBtn onClick={handleAnalyze} loading={loading} icon={<Icon d={IC.sparkles} size={14} color="#fff" />}>
                Analyze Resume · 5 credits
              </PrimaryBtn>
            </Card>

            {analysis && (
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: T.text1, fontFamily: 'DM Sans, sans-serif' }}>Score Breakdown</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '12px', padding: '3px 9px', borderRadius: '20px', background: 'rgba(16,185,129,0.12)', color: T.accentTxt, fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>ATS {analysis.atsScore}/100</span>
                    <span style={{ fontSize: '12px', padding: '3px 9px', borderRadius: '20px', background: 'rgba(99,102,241,0.12)', color: '#6366f1', fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>{analysis.keywordCoverage}% keywords</span>
                  </div>
                </div>
                {[['Summary', analysis.sections?.summary, '#2563eb'], ['Skills', analysis.sections?.skills, '#059669'], ['Experience', analysis.sections?.experience, '#d97706']].map(([name, s, color]) => s && (
                  <div key={name} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '12px', color: T.text2, fontFamily: 'DM Sans, sans-serif' }}>{name}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color, fontFamily: 'DM Sans, sans-serif' }}>{s.score}/10</span>
                    </div>
                    <ProgressBar value={s.score} max={10} color={color} />
                  </div>
                ))}
                {analysis.missingKeywords?.length > 0 && (
                  <div style={{ marginTop: '14px' }}>
                    <FieldLabel>Missing Keywords</FieldLabel>
                    <div className="flex-wrap-row" style={{ marginTop: '6px' }}>
                      {analysis.missingKeywords.slice(0,8).map(kw => (
                        <span key={kw} style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 500, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontFamily: 'DM Sans, sans-serif' }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
          <ChatWindow messages={messages} onSend={handleChat} loading={loading} placeholder="Ask about your resume..." />
        </div>
      </div>
    </>
  );
}

// ─── InterviewTrainer ─────────────────────────────────────────
export function InterviewTrainer() {
  const T = useT();
  const [config, setConfig]     = useState({ role: 'Senior Frontend Engineer', type: 'system-design', difficulty: 'senior' });
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [started, setStarted]   = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Configure your interview session and click **Start Interview** to begin. I\'ll ask questions and score each answer in real-time.' }]);

  const TYPES = [
    { v: 'system-design', l: 'System Design',   iconKey: 'layers' },
    { v: 'technical',     l: 'Algorithms / DS',  iconKey: 'cpu'   },
    { v: 'behavioral',    l: 'Behavioral',        iconKey: 'users' },
    { v: 'mixed',         l: 'Mixed',             iconKey: 'target'},
  ];
  const DIFFS = ['junior','mid','senior','staff'];

  const handleStart = async () => {
    setLoading(true);
    try {
      const { data } = await interviewService.start(config);
      setSessionId(data.data._id); setStarted(true);
      setMessages([{ role: 'assistant', content: data.data.messages[0].content }]);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to start'); }
    finally { setLoading(false); }
  };
  const handleMessage = async (msg) => {
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try { const { data } = await interviewService.message(sessionId, msg); setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]); }
    catch { toast.error('Failed to send'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="tool-anim">
        <PageHeader iconKey="interview" title="Interview Trainer" subtitle="Practice technical & behavioral interviews with AI scoring" color="#059669" />
        <div className="tool-grid tool-grid-wide">
          <Card>
            <div style={{ fontSize: '13px', fontWeight: 600, color: T.text1, marginBottom: '16px', fontFamily: 'DM Sans, sans-serif' }}>Session Setup</div>
            <div style={{ marginBottom: '14px' }}><FieldLabel>Target Role</FieldLabel><Input value={config.role} onChange={e=>setConfig({...config,role:e.target.value})} placeholder="e.g. Senior Frontend Engineer" /></div>
            <div style={{ marginBottom: '14px' }}>
              <FieldLabel>Interview Type</FieldLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                {TYPES.map(({ v, l, iconKey }) => (
                  <div key={v} onClick={() => setConfig({...config,type:v})}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', border: `1px solid ${config.type===v?'#059669':T.border}`, borderRadius: '9px', cursor: 'pointer', background: config.type===v?'rgba(5,150,105,0.1)':'transparent', transition: 'all 0.15s', minHeight: 40 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '7px', background: config.type===v?'rgba(5,150,105,0.15)':T.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon d={IC[iconKey]} size={13} color={config.type===v?'#059669':T.text3} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: config.type===v?600:400, color: config.type===v?'#059669':T.text2, fontFamily: 'DM Sans, sans-serif' }}>{l}</span>
                    {config.type===v && <Icon d={IC.check} size={13} color="#059669" style={{ marginLeft: 'auto' }} />}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '18px' }}>
              <FieldLabel>Difficulty</FieldLabel>
              <div className="flex-wrap-row" style={{ marginTop: '4px' }}>
                {DIFFS.map(d => <OptionChip key={d} label={d.charAt(0).toUpperCase()+d.slice(1)} active={config.difficulty===d} onClick={()=>setConfig({...config,difficulty:d})} color="#059669" />)}
              </div>
            </div>
            <PrimaryBtn onClick={handleStart} loading={loading} disabled={started} icon={started ? <Icon d={IC.check} size={14} color="#fff" /> : <Icon d={IC.interview} size={14} color="#fff" />} style={{ background: started ? 'rgba(5,150,105,0.15)' : undefined, color: started ? '#059669' : '#fff', boxShadow: started ? 'none' : undefined }}>
              {started ? 'Session Active' : 'Start Interview · 1 credit'}
            </PrimaryBtn>
            {started && (
              <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '9px', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#059669', fontFamily: 'DM Sans, sans-serif' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'chatBounce 2s ease-in-out infinite' }} />
                  Session active — answer in chat
                </div>
              </div>
            )}
          </Card>
          <ChatWindow messages={messages} onSend={handleMessage} loading={loading} placeholder={started ? 'Type your answer...' : 'Start the session first'} />
        </div>
      </div>
    </>
  );
}

// ─── CodeReviewer ─────────────────────────────────────────────
export function CodeReviewer() {
  const T = useT();
  const [code, setCode]           = useState('');
  const [language, setLanguage]   = useState('javascript');
  const [loading, setLoading]     = useState(false);
  const [review, setReview]       = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages]   = useState([{ role: 'assistant', content: 'Paste your code and click **Review Code** for an instant security audit, performance analysis, and best practice check.' }]);

  const LANGUAGES = ['javascript','typescript','python','go','rust','java','cpp'];
  const severityConfig = {
    critical: { color: T.red,   bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  iconKey: 'xCircle',     label: 'Critical' },
    warning:  { color: T.amber, bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', iconKey: 'alert',       label: 'Warning'  },
    info:     { color: T.blue,  bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', iconKey: 'info',        label: 'Info'     },
    good:     { color: '#10b981',bg:'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', iconKey: 'checkCircle', label: 'Good'     },
  };
  const scoreColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? T.amber : T.red;

  const handleReview = async () => {
    if (!code.trim()) return toast.error('Please paste some code');
    setLoading(true);
    try {
      const { data } = await codeReviewService.review({ code, language });
      const r = data.data.review;
      setReview(r); setSessionId(data.data._id);
      setMessages(prev => [...prev, { role: 'assistant', content: `**Review Complete — Score: ${r.overallScore}/100**\n\n${r.summary}\n\nFound ${r.issues?.length || 0} issues. Ask me anything about the review!` }]);
    } catch (err) { toast.error(err.response?.data?.message || 'Review failed'); }
    finally { setLoading(false); }
  };
  const handleChat = async (msg) => {
    if (!sessionId) return toast.error('Please review code first');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    try { const { data } = await codeReviewService.chat(sessionId, msg); setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]); }
    catch { toast.error('Chat failed'); }
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="tool-anim">
        <PageHeader iconKey="code" title="Code Reviewer" subtitle="Paste code for instant AI review — security, performance & best practices" color="#d97706" />
        <div className="tool-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px,2vw,14px)' }}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon d={IC.terminal} size={15} color={T.text2} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: T.text1, fontFamily: 'DM Sans, sans-serif' }}>Code Input</span>
                </div>
                <SelectInput value={language} onChange={e=>setLanguage(e.target.value)} options={LANGUAGES} />
              </div>
              <Textarea mono rows={10} value={code} onChange={e=>setCode(e.target.value)} placeholder={`// Paste your ${language} code here...`} />
              <div style={{ marginTop: '12px' }}>
                <PrimaryBtn onClick={handleReview} loading={loading} icon={<Icon d={IC.zap} size={14} color="#fff" />} style={{ background: 'linear-gradient(135deg,#d97706,#b45309)', boxShadow: '0 2px 14px rgba(217,119,6,0.32)' }}>
                  Review Code · 3 credits
                </PrimaryBtn>
              </div>
            </Card>

            {review && (
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Icon d={IC.barChart} size={14} color={T.text2} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: T.text1, fontFamily: 'DM Sans, sans-serif' }}>Issues ({review.issues?.length || 0})</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', background: `${scoreColor(review.overallScore)}15`, color: scoreColor(review.overallScore), border: `1px solid ${scoreColor(review.overallScore)}30`, fontFamily: 'DM Sans, sans-serif' }}>
                    {review.overallScore}/100
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {review.issues?.map((issue, i) => {
                    const cfg = severityConfig[issue.severity] || severityConfig.info;
                    return (
                      <div key={i} style={{ padding: '10px 12px', borderRadius: '9px', background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px', flexWrap: 'wrap' }}>
                          <Icon d={IC[cfg.iconKey]} size={13} color={cfg.color} />
                          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: cfg.color, fontFamily: 'DM Sans, sans-serif' }}>{cfg.label}</span>
                          <span style={{ fontSize: '10px', color: T.text3, fontFamily: 'DM Sans, sans-serif' }}>— {issue.category}</span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: T.text1, marginBottom: '3px', fontFamily: 'DM Sans, sans-serif' }}>{issue.message}</div>
                        <div style={{ fontSize: '12px', color: T.text2, fontFamily: 'DM Sans, sans-serif' }}>{issue.suggestion}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
          <ChatWindow messages={messages} onSend={handleChat} loading={loading} placeholder="Ask about the review..." />
        </div>
      </div>
    </>
  );
}

// ─── LearningPaths ────────────────────────────────────────────
export function LearningPaths() {
  const T = useT();
  const [paths, setPaths]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({ goal: '', currentSkills: [], timeline: '3 months' });
  const [newSkill, setNewSkill] = useState('');

  const SKILL_SUGGESTIONS = ['React','TypeScript','Node.js','Python','Go','Docker','Kubernetes','AWS','GraphQL','PostgreSQL'];
  const TIMELINES = ['1 month','3 months','6 months'];

  const addSkill = s => { if (!form.currentSkills.includes(s)) setForm(p => ({...p, currentSkills:[...p.currentSkills,s]})); };
  const removeSkill = s => setForm(p => ({...p, currentSkills:p.currentSkills.filter(x=>x!==s)}));

  const handleGenerate = async () => {
    if (!form.goal.trim()) return toast.error('Please describe your goal');
    setLoading(true);
    try { const { data } = await learningPathService.generate(form); setPaths(prev => [data.data,...prev]); toast.success('Learning path generated!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Generation failed'); }
    finally { setLoading(false); }
  };
  const toggleModule = async (pathId, moduleId, completed) => {
    try { const { data } = await learningPathService.updateModule(pathId, moduleId, { completed }); setPaths(prev => prev.map(p => p._id===data.data._id?data.data:p)); }
    catch { toast.error('Failed to update'); }
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="tool-anim">
        <PageHeader iconKey="learning" title="Learning Paths" subtitle="AI-generated personalized roadmaps toward your career goals" color="#7c3aed" />
        <div className="tool-grid tool-grid-rwide">
          <Card>
            <div style={{ fontSize: '13px', fontWeight: 600, color: T.text1, marginBottom: '16px', fontFamily: 'DM Sans, sans-serif' }}>Generate New Path</div>
            <div style={{ marginBottom: '14px' }}><FieldLabel>Your Goal</FieldLabel><Input value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})} placeholder="e.g. Become a Staff Frontend Engineer" /></div>
            <div style={{ marginBottom: '14px' }}>
              <FieldLabel>Current Skills</FieldLabel>
              <div className="flex-wrap-row" style={{ marginTop: '6px', marginBottom: '8px' }}>
                {SKILL_SUGGESTIONS.map(s => (
                  <span key={s} className="tchip" onClick={() => form.currentSkills.includes(s)?removeSkill(s):addSkill(s)}
                    style={{ background: form.currentSkills.includes(s)?'rgba(124,58,237,0.12)':T.trackBg, color: form.currentSkills.includes(s)?'#7c3aed':T.text2, border: `1px solid ${form.currentSkills.includes(s)?'rgba(124,58,237,0.3)':T.border}` }}>
                    {form.currentSkills.includes(s) && <Icon d={IC.check} size={10} color="#7c3aed" style={{ marginRight: 4 }} />}
                    {s}
                  </span>
                ))}
              </div>
              {form.currentSkills.filter(s=>!SKILL_SUGGESTIONS.includes(s)).length>0 && (
                <div className="flex-wrap-row" style={{ marginBottom: '8px' }}>
                  {form.currentSkills.filter(s=>!SKILL_SUGGESTIONS.includes(s)).map(s => (
                    <span key={s} className="tchip" style={{ background: 'rgba(124,58,237,0.12)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)' }}>
                      {s}
                      <span onClick={()=>removeSkill(s)} style={{ marginLeft: '5px', cursor: 'pointer', display: 'flex' }}><Icon d={IC.close} size={10} color="#7c3aed" /></span>
                    </span>
                  ))}
                </div>
              )}
              <Input value={newSkill} onChange={e=>setNewSkill(e.target.value)} placeholder="Add custom skill + Enter" style={{ marginTop: '4px' }}
                onKeyDown={e=>{if(e.key==='Enter'&&newSkill.trim()){addSkill(newSkill.trim());setNewSkill('');}}} />
            </div>
            <div style={{ marginBottom: '18px' }}>
              <FieldLabel>Timeline</FieldLabel>
              <div className="flex-wrap-row" style={{ marginTop: '4px' }}>
                {TIMELINES.map(t => <OptionChip key={t} label={t} active={form.timeline===t} onClick={()=>setForm({...form,timeline:t})} color="#7c3aed" />)}
              </div>
            </div>
            <PrimaryBtn onClick={handleGenerate} loading={loading} icon={<Icon d={IC.map} size={14} color="#fff" />} style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 2px 14px rgba(124,58,237,0.32)' }}>
              Generate Path · 5 credits
            </PrimaryBtn>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px,2vw,14px)' }}>
            {paths.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: 'clamp(32px,5vw,60px) 20px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '14px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <Icon d={IC.map} size={24} color="#7c3aed" />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 500, color: T.text2, fontFamily: 'DM Sans, sans-serif' }}>No paths yet</div>
                <div style={{ fontSize: '13px', color: T.text3, marginTop: '6px', fontFamily: 'DM Sans, sans-serif' }}>Generate your first AI learning path →</div>
              </Card>
            ) : paths.map(path => {
              const done = path.modules?.filter(m=>m.completed).length||0, total = path.modules?.length||0;
              const pct = total ? Math.round((done/total)*100) : 0;
              return (
                <Card key={path._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '10px' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 'clamp(13px,1.5vw,15px)', fontWeight: 600, color: T.text1, marginBottom: '3px', fontFamily: 'DM Sans, sans-serif' }}>{path.title}</div>
                      <div style={{ fontSize: '12px', color: T.text3, fontFamily: 'DM Sans, sans-serif' }}>{path.estimatedWeeks} weeks · {total} modules</div>
                    </div>
                    <span style={{ flexShrink: 0, fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: 'rgba(124,58,237,0.12)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.2)', fontFamily: 'DM Sans, sans-serif' }}>{pct}%</span>
                  </div>
                  <ProgressBar value={pct} color="#7c3aed" />
                  <div style={{ fontSize: '11px', color: T.text3, marginTop: '4px', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>{done} of {total} complete</div>
                  {path.modules?.slice(0,5).map((mod) => (
                    <div key={mod._id||mod.order} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: `1px solid ${T.divider}`, minHeight: 40 }}>
                      <div onClick={() => mod._id && toggleModule(path._id,mod._id,!mod.completed)}
                        style={{ width: 18, height: 18, borderRadius: '5px', border: `1.5px solid ${mod.completed?'#7c3aed':'rgba(128,128,128,0.3)'}`, background: mod.completed?'linear-gradient(135deg,#7c3aed,#6366f1)':'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}>
                        {mod.completed && <Icon d={IC.check} size={10} color="#fff" />}
                      </div>
                      <div style={{ flex: 1, fontSize: '13px', color: mod.completed?T.text3:T.text1, textDecoration: mod.completed?'line-through':'none', minWidth: 0, fontFamily: 'DM Sans, sans-serif' }}>{mod.title}</div>
                      <div style={{ fontSize: '11px', color: T.text3, flexShrink: 0, fontFamily: 'DM Sans, sans-serif' }}>{mod.estimatedHours}h</div>
                    </div>
                  ))}
                  {total > 5 && <div style={{ fontSize: '12px', color: T.text3, textAlign: 'center', marginTop: '8px', fontFamily: 'DM Sans, sans-serif' }}>+{total-5} more modules</div>}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── BugFixAssistant ──────────────────────────────────────────
export function BugFixAssistant() {
  const T = useT();
  const [form, setForm]           = useState({ bugDescription:'', code:'', errorMessage:'', language:'javascript' });
  const [loading, setLoading]     = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages]   = useState([{ role: 'assistant', content: 'Hi! Describe your bug, paste your code, and include any error messages. I\'ll diagnose the root cause and provide a complete working fix.' }]);

  const LANGUAGES = ['javascript','typescript','python','go','rust','java'];

  const handleDiagnose = async () => {
    if (!form.bugDescription && !form.code) return toast.error('Please describe the bug or paste your code');
    setLoading(true);
    try {
      const { data } = await bugFixService.diagnose(form);
      setSessionId(data.data.sessionId);
      const userMsg = form.bugDescription || form.errorMessage || 'See code above';
      setMessages(prev => [...prev, { role:'user', content:userMsg }, { role:'assistant', content:data.data.reply }]);
    } catch (err) { toast.error(err.response?.data?.message || 'Diagnosis failed'); }
    finally { setLoading(false); }
  };
  const handleChat = async (msg) => {
    if (!sessionId) return toast.error('Please diagnose a bug first');
    setMessages(prev => [...prev, { role:'user', content:msg }]);
    setLoading(true);
    try { const { data } = await bugFixService.message(sessionId, msg); setMessages(prev => [...prev, { role:'assistant', content:data.data.reply }]); }
    catch { toast.error('Message failed'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="tool-anim">
        <PageHeader iconKey="bug" title="Bug Fix Assistant" subtitle="Describe your bug, paste code, get a root cause diagnosis and fix instantly" color="#dc2626" />
        <div className="tool-grid">
          <Card>
            <div style={{ fontSize: '13px', fontWeight: 600, color: T.text1, marginBottom: '16px', fontFamily: 'DM Sans, sans-serif' }}>Bug Details</div>
            <div style={{ marginBottom: '12px' }}><FieldLabel>Describe the Bug</FieldLabel><Textarea rows={3} value={form.bugDescription} onChange={e=>setForm({...form,bugDescription:e.target.value})} placeholder="e.g. My async function returns undefined even though I'm awaiting it..." /></div>
            <div style={{ marginBottom: '12px' }}>
              <FieldLabel>Error Message (optional)</FieldLabel>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
                  <Icon d={IC.terminal} size={14} color={T.text3} />
                </div>
                <Input value={form.errorMessage} onChange={e=>setForm({...form,errorMessage:e.target.value})} placeholder="TypeError: Cannot read properties of undefined..." style={{ paddingLeft: '36px', fontSize: '12px', fontFamily: '"Fira Code",monospace' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
              <FieldLabel>Your Code</FieldLabel>
              <SelectInput value={form.language} onChange={e=>setForm({...form,language:e.target.value})} options={LANGUAGES} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <Textarea mono rows={9} value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder={`// Paste your buggy ${form.language} code here...`} />
            </div>
            <PrimaryBtn onClick={handleDiagnose} loading={loading} icon={<Icon d={IC.search} size={14} color="#fff" />} style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow: '0 2px 14px rgba(220,38,38,0.3)' }}>
              Diagnose & Fix · 2 credits
            </PrimaryBtn>
            <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '9px', background: T.trackBg, border: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: T.text2, marginBottom: '4px', fontFamily: 'DM Sans, sans-serif' }}>
                <Icon d={IC.info} size={13} color={T.text3} /> For best results
              </div>
              <div style={{ fontSize: '11px', color: T.text3, lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif' }}>Include the full error stack trace, minimal reproducible code, and describe what you expected vs what happened.</div>
            </div>
          </Card>
          <ChatWindow messages={messages} onSend={handleChat} loading={loading} placeholder="Ask a follow-up about the fix..." />
        </div>
      </div>
    </>
  );
}