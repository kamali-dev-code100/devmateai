import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../hooks';

function formatMessage(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(128,128,128,0.15);padding:1px 5px;border-radius:3px;font-family:\'Fira Code\',\'Cascadia Code\',monospace;font-size:11px">$1</code>')
    .replace(/\n/g, '<br/>');
}

export default function ChatWindow({
  messages = [],
  onSend,
  loading = false,
  placeholder = 'Type a message...',
  height = 'clamp(320px, 50vh, 520px)',
}) {
  const { theme }  = useTheme();
  const isDark     = theme === 'dark';
  const [input, setInput] = useState('');
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    onSend(text);
    // Refocus input after send (important for mobile UX)
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Theme tokens
  const T = {
    bg:       isDark ? 'rgba(255,255,255,0.03)'  : 'rgba(255,255,255,0.85)',
    border:   isDark ? 'rgba(255,255,255,0.08)'  : 'rgba(0,0,0,0.09)',
    divider:  isDark ? 'rgba(255,255,255,0.06)'  : 'rgba(0,0,0,0.07)',
    text1:    isDark ? '#ffffff'                  : '#0f1117',
    text2:    isDark ? 'rgba(255,255,255,0.65)'  : 'rgba(0,0,0,0.65)',
    text3:    isDark ? 'rgba(255,255,255,0.35)'  : 'rgba(0,0,0,0.4)',
    inputBg:  isDark ? 'rgba(255,255,255,0.05)'  : 'rgba(255,255,255,0.9)',
    inputBrd: isDark ? 'rgba(255,255,255,0.12)'  : 'rgba(0,0,0,0.12)',
    userBub:  isDark ? 'rgba(16,185,129,0.14)'   : 'rgba(16,185,129,0.1)',
    userBrd:  isDark ? 'rgba(16,185,129,0.25)'   : 'rgba(16,185,129,0.2)',
    aiBub:    isDark ? 'rgba(255,255,255,0.04)'  : 'rgba(0,0,0,0.03)',
    aiBrd:    isDark ? 'rgba(255,255,255,0.08)'  : 'rgba(0,0,0,0.07)',
    shadow:   isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
    avatar:   isDark ? 'rgba(255,255,255,0.1)'   : 'rgba(0,0,0,0.06)',
    sendBg:   isDark ? 'rgba(255,255,255,0.06)'  : 'rgba(0,0,0,0.04)',
  };

  return (
    <>
      <style>{`
        @keyframes cw-bounce {
          0%,80%,100% { transform: scale(0.7); opacity: 0.4; }
          40%         { transform: scale(1.1); opacity: 1;   }
        }
        @keyframes cw-spin { to { transform: rotate(360deg); } }
        .cw-msg-enter { animation: cw-fadein 0.22s ease both; }
        @keyframes cw-fadein { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none} }
        .cw-input:focus { border-color: #10b981 !important; outline: none; }
        .cw-send-btn:hover:not(:disabled) { background: linear-gradient(135deg,#10b981,#0891b2) !important; color: #fff !important; }
        .cw-send-btn:active:not(:disabled) { transform: scale(0.96); }
        .cw-send-btn { transition: all 0.15s; }
      `}</style>

      <div style={{
        display: 'flex', flexDirection: 'column',
        height,
        background: T.bg,
        border: `1px solid ${T.border}`,
        borderRadius: '14px',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: T.shadow,
      }}>

        {/* ── Header bar ── */}
        <div style={{
          padding: '10px 14px',
          borderBottom: `1px solid ${T.divider}`,
          display: 'flex', alignItems: 'center', gap: '8px',
          flexShrink: 0,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px rgba(16,185,129,0.6)',
          }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: T.text2 }}>
            AI Assistant
          </span>
          {/* Typing indicator */}
          {loading && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '3px', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: '50%', background: '#10b981',
                  display: 'inline-block',
                  animation: `cw-bounce 1.1s ease-in-out ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
          )}
        </div>

        {/* ── Messages ── */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '14px',
          display: 'flex', flexDirection: 'column', gap: '10px',
          WebkitOverflowScrolling: 'touch', // smooth iOS scroll
        }}>
          {messages.map((msg, i) => (
            <div key={i} className="cw-msg-enter" style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              gap: '8px', alignItems: 'flex-end',
            }}>
              {/* AI avatar */}
              {msg.role !== 'user' && (
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#10b981,#0891b2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>AI</div>
              )}

              {/* Bubble */}
              <div style={{
                maxWidth: 'min(85%, 480px)',
                padding: '9px 13px',
                borderRadius: msg.role === 'user'
                  ? '14px 14px 3px 14px'
                  : '14px 14px 14px 3px',
                background:  msg.role === 'user' ? T.userBub : T.aiBub,
                border: `1px solid ${msg.role === 'user' ? T.userBrd : T.aiBrd}`,
                fontSize: '13px',
                color: T.text2,
                lineHeight: 1.65,
                wordBreak: 'break-word',
              }} dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />

              {/* User avatar */}
              {msg.role === 'user' && (
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: T.avatar,
                  border: `1px solid ${T.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 600, color: T.text2, flexShrink: 0,
                }}>You</div>
              )}
            </div>
          ))}

          {/* Loading bubble */}
          {loading && (
            <div className="cw-msg-enter" style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>AI</div>
              <div style={{ padding: '10px 14px', borderRadius: '14px 14px 14px 3px', background: T.aiBub, border: `1px solid ${T.aiBrd}`, display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: T.text3, display: 'inline-block', animation: `cw-bounce 1.1s ease-in-out ${i*0.15}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input bar ── */}
        <div style={{
          padding: '10px 12px',
          borderTop: `1px solid ${T.divider}`,
          display: 'flex', gap: '8px', alignItems: 'flex-end',
          flexShrink: 0,
        }}>
          <textarea
            ref={inputRef}
            className="cw-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            rows={1}
            disabled={loading}
            style={{
              flex: 1, padding: '9px 12px',
              background: T.inputBg,
              border: `1px solid ${T.inputBrd}`,
              borderRadius: '9px', color: T.text1,
              fontSize: '13px', resize: 'none',
              fontFamily: 'DM Sans, sans-serif',
              lineHeight: 1.5, maxHeight: '100px',
              overflowY: 'auto', opacity: loading ? 0.6 : 1,
              transition: 'border-color 0.15s',
              WebkitAppearance: 'none', // iOS fix
            }}
          />
          <button
            className="cw-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            style={{
              width: 38, height: 38, borderRadius: '9px', border: 'none',
              flexShrink: 0, alignSelf: 'flex-end',
              background: !input.trim() || loading ? T.sendBg : 'linear-gradient(135deg,#10b981,#0891b2)',
              color: !input.trim() || loading ? T.text3 : '#fff',
              cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 38, // touch target
            }}>
            {loading
              ? <span style={{ width: 14, height: 14, border: '2px solid rgba(128,128,128,0.3)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'cw-spin 0.7s linear infinite', display: 'block' }} />
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
            }
          </button>
        </div>
      </div>
    </>
  );
}