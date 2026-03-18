// RobotWave.jsx — Astronaut Robot
// Purple helmet, glowing visor, waving arm, green status pulse dots
// Pure CSS animations — no dependencies, no watermark

export default function RobotWave({ size = 72, isDark = true }) {
  const id = 'ra';

  return (
    <>
      <style>{`
        @keyframes ${id}-float  { 0%,100%{transform:translateY(0)}      50%{transform:translateY(-6px)}  }
        @keyframes ${id}-wave   { 0%,100%{transform:rotate(0deg)}        25%{transform:rotate(-32deg)}    65%{transform:rotate(12deg)} }
        @keyframes ${id}-blink  { 0%,88%,100%{transform:scaleY(1)}       94%{transform:scaleY(0.07)}      }
        @keyframes ${id}-pulse  { 0%,100%{opacity:0.5}                   50%{opacity:1}                   }
        @keyframes ${id}-glow   { 0%,100%{opacity:0.35}                  50%{opacity:0.85}                }
        @keyframes ${id}-visor  { 0%,100%{opacity:0.12}                  50%{opacity:0.28}                }
        @keyframes ${id}-shadow { 0%,100%{transform:scaleX(1);opacity:.14} 50%{transform:scaleX(.72);opacity:.08} }

        .${id}-body   { animation: ${id}-float  2.4s ease-in-out infinite; }
        .${id}-arm    { animation: ${id}-wave   1.9s ease-in-out infinite; }
        .${id}-el     { animation: ${id}-blink  3.8s ease-in-out infinite; transform-origin: 50% 50%; }
        .${id}-er     { animation: ${id}-blink  3.8s ease-in-out .22s infinite; transform-origin: 50% 50%; }
        .${id}-dot1   { animation: ${id}-pulse  1.6s ease-in-out infinite; }
        .${id}-dot2   { animation: ${id}-pulse  1.6s ease-in-out .4s infinite; }
        .${id}-glow   { animation: ${id}-glow   2.4s ease-in-out infinite; }
        .${id}-vshim  { animation: ${id}-visor  2.4s ease-in-out infinite; }
        .${id}-shadow { animation: ${id}-shadow 2.4s ease-in-out infinite; }
      `}</style>

      <svg
        width={size} height={size}
        viewBox="0 0 100 108"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}>

        <defs>
          <radialGradient id={`${id}-hg`} cx="40%" cy="35%" r="58%">
            <stop offset="0%"   stopColor="#e0e7ff"/>
            <stop offset="100%" stopColor="#c7d2fe"/>
          </radialGradient>
          <radialGradient id={`${id}-vg`} cx="45%" cy="38%" r="55%">
            <stop offset="0%"   stopColor="#3730a3"/>
            <stop offset="100%" stopColor="#1e1b4b"/>
          </radialGradient>
          <radialGradient id={`${id}-sg`} cx="40%" cy="32%" r="60%">
            <stop offset="0%"   stopColor="#818cf8"/>
            <stop offset="100%" stopColor="#6366f1"/>
          </radialGradient>
          <radialGradient id={`${id}-eg`} cx="38%" cy="35%" r="55%">
            <stop offset="0%"   stopColor="#a5b4fc"/>
            <stop offset="100%" stopColor="#818cf8"/>
          </radialGradient>
          <radialGradient id={`${id}-bg`} cx="50%" cy="40%" r="55%">
            <stop offset="0%"   stopColor="#a5b4fc"/>
            <stop offset="100%" stopColor="#6366f1"/>
          </radialGradient>
        </defs>

        {/* ── DevMate green glow ring ── */}
        <circle className={`${id}-glow`} cx="50" cy="54" r="48"
          fill="none" stroke="#10b981" strokeWidth="1.5"
          style={{ filter: 'blur(1.5px)' }} />

        {/* ── Ground shadow ── */}
        <ellipse className={`${id}-shadow`} cx="50" cy="104" rx="18" ry="4" fill="#000"/>

        {/* ── Everything floats together ── */}
        <g className={`${id}-body`}>

          {/* Legs */}
          <rect x="30" y="82" width="14" height="12" rx="5" fill="#4f46e5"/>
          <rect x="56" y="82" width="14" height="12" rx="5" fill="#4f46e5"/>
          <rect x="30" y="89" width="14" height="5"  rx="3" fill="#3730a3"/>
          <rect x="56" y="89" width="14" height="5"  rx="3" fill="#3730a3"/>

          {/* Body suit */}
          <rect x="26" y="58" width="48" height="28" rx="12" fill={`url(#${id}-sg)`}/>
          <rect x="32" y="63" width="36" height="14" rx="5"  fill="#4f46e5"/>
          <rect x="36" y="66" width="28" height="8"  rx="3"  fill={`url(#${id}-bg)`}/>
          {/* Chest light */}
          <circle cx="50" cy="70" r="3"   fill="#e0e7ff"/>
          <circle cx="50" cy="70" r="1.8" fill="#c7d2fe"/>
          {/* Suit shine */}
          <ellipse cx="34" cy="66" rx="4" ry="5" fill="rgba(255,255,255,0.2)"/>
          {/* Side vents */}
          <rect x="26" y="66" width="6" height="3" rx="1.5" fill="#3730a3"/>
          <rect x="26" y="71" width="6" height="3" rx="1.5" fill="#3730a3"/>
          <rect x="68" y="66" width="6" height="3" rx="1.5" fill="#3730a3"/>
          <rect x="68" y="71" width="6" height="3" rx="1.5" fill="#3730a3"/>

          {/* Left arm — relaxed */}
          <rect x="10" y="61" width="17" height="11" rx="5.5" fill="#6366f1"/>
          <ellipse cx="10" cy="66.5" rx="6" ry="5" fill="#4f46e5"/>
          <ellipse cx="10" cy="66.5" rx="3" ry="2.5" fill="#3730a3"/>

          {/* Right arm — waves */}
          <g className={`${id}-arm`} style={{ transformOrigin: '73px 62px' }}>
            <rect x="73" y="59" width="17" height="11" rx="5.5" fill="#6366f1"/>
            <ellipse cx="90" cy="64.5" rx="6" ry="5" fill="#4f46e5"/>
            <ellipse cx="90" cy="64.5" rx="3" ry="2.5" fill="#3730a3"/>
          </g>

          {/* Collar ring */}
          <ellipse cx="50" cy="59" rx="22" ry="6" fill="#c7d2fe"/>
          <ellipse cx="50" cy="59" rx="18" ry="4" fill="#a5b4fc"/>

          {/* Helmet */}
          <ellipse cx="50" cy="36" rx="26" ry="25" fill={`url(#${id}-hg)`}/>
          {/* Helmet shine */}
          <ellipse cx="39" cy="24" rx="9" ry="7" fill="rgba(255,255,255,0.35)"/>
          {/* Helmet side panels */}
          <ellipse cx="25" cy="36" rx="4" ry="6" fill="#c7d2fe"/>
          <ellipse cx="75" cy="36" rx="4" ry="6" fill="#c7d2fe"/>

          {/* Visor */}
          <ellipse cx="50" cy="38" rx="20" ry="18" fill={`url(#${id}-vg)`}/>
          {/* Visor shimmer */}
          <ellipse className={`${id}-vshim`} cx="40" cy="28" rx="7" ry="5"
            fill="rgba(165,180,252,0.65)" style={{ filter: 'blur(1px)' }}/>

          {/* Left eye */}
          <g className={`${id}-el`}>
            <circle cx="40" cy="38" r="7"   fill={`url(#${id}-eg)`}/>
            <circle cx="40" cy="38" r="4"   fill="#1e1b4b"/>
            <circle cx="42" cy="36" r="1.5" fill="rgba(255,255,255,0.75)"/>
            <circle cx="39" cy="40.5" r="0.9" fill="rgba(255,255,255,0.4)"/>
          </g>

          {/* Right eye */}
          <g className={`${id}-er`}>
            <circle cx="60" cy="38" r="7"   fill={`url(#${id}-eg)`}/>
            <circle cx="60" cy="38" r="4"   fill="#1e1b4b"/>
            <circle cx="62" cy="36" r="1.5" fill="rgba(255,255,255,0.75)"/>
            <circle cx="59" cy="40.5" r="0.9" fill="rgba(255,255,255,0.4)"/>
          </g>

          {/* Smile */}
          <path d="M42 47 Q50 53 58 47"
            fill="none" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round"/>

          {/* Status dots — pulsing green */}
          <circle className={`${id}-dot1`} cx="27" cy="24" r="3.2" fill="#10b981"/>
          <circle className={`${id}-dot1`} cx="27" cy="24" r="5.5"
            fill="none" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
          <circle className={`${id}-dot2`} cx="73" cy="24" r="3.2" fill="#10b981"/>
          <circle className={`${id}-dot2`} cx="73" cy="24" r="5.5"
            fill="none" stroke="#10b981" strokeWidth="1" opacity="0.4"/>

          {/* Antenna */}
          <line x1="50" y1="12" x2="50" y2="5"
            stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="50" cy="4" r="4"   fill="#6366f1"/>
          <circle cx="50" cy="4" r="2"   fill="#a5b4fc"/>
          <circle cx="48.8" cy="2.8" r="0.8" fill="rgba(255,255,255,0.6)"/>
        </g>
      </svg>
    </>
  );
}