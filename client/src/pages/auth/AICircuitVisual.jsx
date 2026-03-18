import { useEffect, useRef } from 'react';

// Animated AI Circuit Visual — pure canvas, no external deps
// Top half of auth left panel
export default function AICircuitVisual({ isDark = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const W = canvas.offsetWidth || 320;
    const H = canvas.offsetHeight || 200;
    canvas.width  = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Colors based on theme
    const C = isDark ? {
      bg:      'transparent',
      line:    'rgba(16,185,129,0.18)',
      lineHi:  'rgba(16,185,129,0.5)',
      node:    'rgba(16,185,129,0.6)',
      nodeDim: 'rgba(16,185,129,0.2)',
      pulse:   'rgba(110,231,183,0.9)',
      core:    '#10b981',
      coreGlow:'rgba(16,185,129,0.3)',
      dot:     'rgba(99,102,241,0.7)',
      dotGlow: 'rgba(99,102,241,0.3)',
      text:    'rgba(255,255,255,0.5)',
    } : {
      bg:      'transparent',
      line:    'rgba(5,150,105,0.15)',
      lineHi:  'rgba(5,150,105,0.4)',
      node:    'rgba(5,150,105,0.5)',
      nodeDim: 'rgba(5,150,105,0.12)',
      pulse:   'rgba(5,150,105,0.9)',
      core:    '#059669',
      coreGlow:'rgba(5,150,105,0.25)',
      dot:     'rgba(99,102,241,0.6)',
      dotGlow: 'rgba(99,102,241,0.2)',
      text:    'rgba(0,0,0,0.4)',
    };

    // Center of the AI core
    const cx = W / 2, cy = H / 2;

    // Circuit nodes around the center
    const nodes = [
      { angle: 0,    r: 80, label: 'Resume' },
      { angle: 60,   r: 85, label: 'Interview' },
      { angle: 120,  r: 78, label: 'Code' },
      { angle: 180,  r: 82, label: 'Learn' },
      { angle: 240,  r: 80, label: 'Bug Fix' },
      { angle: 300,  r: 76, label: 'Profile' },
    ].map(n => ({
      ...n,
      x: cx + n.r * Math.cos((n.angle * Math.PI) / 180),
      y: cy + n.r * Math.sin((n.angle * Math.PI) / 180),
      pulse: 0,
      pulseDir: 1,
      pulseSpeed: 0.015 + Math.random() * 0.02,
      active: false,
      activeCooldown: 0,
    }));

    // Data pulses traveling along lines
    const pulses = [];
    let time = 0;

    const spawnPulse = () => {
      const nodeIdx = Math.floor(Math.random() * nodes.length);
      const toCenter = Math.random() > 0.5;
      pulses.push({
        nodeIdx,
        t: 0,
        toCenter,
        speed: 0.012 + Math.random() * 0.01,
      });
    };

    // Outer ring of small nodes
    const outerNodes = Array.from({ length: 18 }, (_, i) => ({
      angle: (i / 18) * 360,
      r: 130,
      x: cx + 130 * Math.cos((i / 18) * 2 * Math.PI),
      y: cy + 130 * Math.sin((i / 18) * 2 * Math.PI),
      alpha: 0.2 + Math.random() * 0.5,
      speed: 0.005 + Math.random() * 0.01,
    }));

    // Circuit traces (L-shaped paths connecting outer ring to mid nodes)
    const traces = [
      { ox: cx - 130, oy: cy - 30, mx: cx - 80, my: cy - 40 },
      { ox: cx + 120, oy: cy - 50, mx: cx + 75, my: cy - 30 },
      { ox: cx - 100, oy: cy + 80, mx: cx - 60, my: cy + 60 },
      { ox: cx + 110, oy: cy + 70, mx: cx + 65, my: cy + 55 },
      { ox: cx - 20,  oy: cy - 130,mx: cx - 10, my: cy - 80 },
      { ox: cx + 30,  oy: cy + 125,mx: cx + 20, my: cy + 78 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      time += 0.016;

      // Outer glow rings around core
      for (let ring = 3; ring >= 1; ring--) {
        const rr = 22 + ring * 12;
        const alpha = (0.08 - ring * 0.02) * (0.7 + 0.3 * Math.sin(time * 2));
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.strokeStyle = C.coreGlow.replace('0.3', String(alpha * 3));
        ctx.lineWidth = ring === 1 ? 1.5 : 0.5;
        ctx.stroke();
      }

      // Outer thin ring
      ctx.beginPath();
      ctx.arc(cx, cy, 115, 0, Math.PI * 2);
      ctx.strokeStyle = C.line;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Mid ring
      ctx.beginPath();
      ctx.arc(cx, cy, 72, 0, Math.PI * 2);
      ctx.strokeStyle = C.lineHi;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Circuit traces
      traces.forEach(tr => {
        ctx.beginPath();
        ctx.moveTo(tr.ox, tr.oy);
        ctx.lineTo(tr.mx, tr.oy); // horizontal
        ctx.lineTo(tr.mx, tr.my); // vertical
        ctx.strokeStyle = C.line;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // Corner dot
        ctx.beginPath();
        ctx.arc(tr.mx, tr.oy, 2, 0, Math.PI * 2);
        ctx.fillStyle = C.nodeDim;
        ctx.fill();
      });

      // Lines from center to each node
      nodes.forEach((n, i) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = n.active ? C.lineHi : C.line;
        ctx.lineWidth = n.active ? 1 : 0.6;
        ctx.stroke();
      });

      // Outer ring nodes (small blinking dots)
      outerNodes.forEach(on => {
        on.alpha += on.speed * (Math.random() > 0.5 ? 1 : -1);
        on.alpha = Math.max(0.08, Math.min(0.7, on.alpha));
        ctx.beginPath();
        ctx.arc(on.x, on.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = C.node.replace('0.6', String(on.alpha));
        ctx.fill();
      });

      // Mid nodes (the 6 tool nodes)
      nodes.forEach((n, i) => {
        n.pulse += n.pulseSpeed * n.pulseDir;
        if (n.pulse > 1 || n.pulse < 0) n.pulseDir *= -1;

        const r = 7 + n.pulse * 3;
        // Outer glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = C.nodeDim.replace('0.2', String(0.08 + n.pulse * 0.15));
        ctx.fill();
        // Main circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.active ? C.pulse : C.node.replace('0.6', String(0.25 + n.pulse * 0.4));
        ctx.fill();
        // Inner dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)';
        ctx.fill();

        n.activeCooldown = Math.max(0, n.activeCooldown - 1);
        if (n.activeCooldown === 0) n.active = false;
      });

      // Data pulses traveling along lines
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) {
          pulses.splice(i, 1);
          const n = nodes[p.nodeIdx];
          n.active = true;
          n.activeCooldown = 20;
          continue;
        }
        const n = nodes[p.nodeIdx];
        const t = p.toCenter ? p.t : 1 - p.t;
        const px = cx + (n.x - cx) * (1 - t);
        const py = cy + (n.y - cy) * (1 - t);
        // Trail
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = C.pulse;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = C.coreGlow;
        ctx.fill();
      }

      // Spawn pulses occasionally
      if (Math.random() < 0.025) spawnPulse();

      // Core AI node (center)
      const coreR = 18 + 2 * Math.sin(time * 3);
      // Core glow layers
      [30, 24, 20].forEach((r, ri) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = C.coreGlow.replace('0.3', String([0.1,0.15,0.2][ri]));
        ctx.fill();
      });
      // Core circle
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = C.core;
      ctx.fill();
      // AI label
      ctx.font = `700 11px "DM Sans", system-ui, sans-serif`;
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AI', cx, cy);

      // Node labels
      ctx.font = `500 9px "DM Sans", system-ui, sans-serif`;
      ctx.fillStyle = C.text;
      nodes.forEach(n => {
        const lx = cx + (n.x - cx) * 1.45;
        const ly = cy + (n.y - cy) * 1.45;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, lx, ly);
      });

      // Decorative corner dots
      [[20,20],[W-20,20],[20,H-20],[W-20,H-20]].forEach(([x,y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = C.nodeDim;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + 8, y); ctx.lineTo(x + 18, y);
        ctx.moveTo(x, y + 8); ctx.lineTo(x, y + 18);
        ctx.strokeStyle = C.nodeDim;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isDark]);

  return (
    <div style={{
      width: '99%',
      height: '250px',
      position: 'relative',
      marginBottom: '20px',
      borderRadius: '12px',
      overflow: 'hidden',
      border: isDark
        ? '1px solid rgba(16,185,129,0.15)'
        : '1px solid rgba(5,150,105,0.12)',
      background: isDark
        ? 'linear-gradient(135deg,rgba(5,6,15,0.9),rgba(8,20,40,0.9))'
        : 'linear-gradient(135deg,rgba(240,249,255,0.8),rgba(220,240,255,0.8))',
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      {/* Subtle label */}
      <div style={{
        position: 'absolute', bottom: 8, left: 0, right: 0,
        textAlign: 'center', fontSize: '10px', fontWeight: 600,
        color: isDark ? 'rgba(110,231,183,0.5)' : 'rgba(5,150,105,0.5)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        pointerEvents: 'none',
      }}>
        AI · Powered by GPT-4o
      </div>
    </div>
  );
}