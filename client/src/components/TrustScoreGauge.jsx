import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CFG = {
  SAFE:        { color: '#10b981', label: 'Safe',        emoji: '✅', glow: 'rgba(16,185,129,.55)'  },
  SUSPICIOUS:  { color: '#f59e0b', label: 'Suspicious',  emoji: '⚠️', glow: 'rgba(245,158,11,.55)' },
  LIKELY_FAKE: { color: '#ef4444', label: 'Likely Fake', emoji: '🚨', glow: 'rgba(239,68,68,.55)'   },
};

export default function TrustScoreGauge({ score, verdict }) {
  const [n, setN] = useState(0);
  const c = CFG[verdict] || CFG.SUSPICIOUS;
  const R = 62, C = 2 * Math.PI * R;

  useEffect(() => {
    const t0 = performance.now(), dur = 1800;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setN(Math.round(e * score));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-5 shrink-0">
      {/* gauge */}
      <div className="relative w-48 h-48">
        {/* glow pulse */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ boxShadow: `0 0 80px ${c.glow}` }}
        />
        {/* decorative ring */}
        <div className="absolute inset-2 rounded-full"
          style={{ border: `1px solid ${c.color}22` }} />

        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          {/* track */}
          <circle cx="70" cy="70" r={R} fill="none"
            stroke="rgba(255,255,255,0.05)" strokeWidth="9" />
          {/* progress */}
          <motion.circle cx="70" cy="70" r={R} fill="none"
            stroke={c.color} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C - (n / 100) * C }}
            transition={{ duration: 0.016 }}
            style={{ filter: `drop-shadow(0 0 12px ${c.color})` }}
          />
        </svg>

        {/* center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tabular-nums"
            style={{ fontFamily: 'Syne,sans-serif', color: c.color,
              textShadow: `0 0 30px ${c.glow}` }}>
            {n}
          </span>
          <span style={{ color: 'var(--faint)', fontSize: 11 }}>/ 100</span>
        </div>
      </div>

      {/* verdict pill */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 240, damping: 18 }}
        className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm"
        style={{
          background: `${c.color}16`,
          border: `1px solid ${c.color}40`,
          color: c.color,
          fontFamily: 'Syne,sans-serif',
          letterSpacing: '.03em',
          boxShadow: `0 0 28px ${c.glow}`,
        }}
      >
        {c.emoji} {c.label}
      </motion.div>
    </div>
  );
}