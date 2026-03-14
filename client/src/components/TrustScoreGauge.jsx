import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CFG = {
  SAFE:        { color: '#10b981', label: 'Safe',        emoji: '✅', glow: 'rgba(16,185,129,.6)',  bg: 'rgba(16,185,129,.08)'  },
  SUSPICIOUS:  { color: '#f59e0b', label: 'Suspicious',  emoji: '⚠️', glow: 'rgba(245,158,11,.6)', bg: 'rgba(245,158,11,.08)' },
  LIKELY_FAKE: { color: '#ef4444', label: 'Likely Fake', emoji: '🚨', glow: 'rgba(239,68,68,.6)',  bg: 'rgba(239,68,68,.08)'  },
};

export default function TrustScoreGauge({ score, verdict }) {
  const [n, setN] = useState(0);
  const c = CFG[verdict] || CFG.SUSPICIOUS;
  const R = 64, C = 2 * Math.PI * R;

  useEffect(() => {
    const t0 = performance.now(), dur = 2000;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setN(Math.round(e * score));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-5 shrink-0">
      <div className="relative w-48 h-48">
        {/* Animated glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ opacity: [.4, .8, .4], scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ boxShadow: `0 0 80px ${c.glow}, 0 0 160px ${c.glow.replace('.6', '.2')}` }}
        />

        {/* Decorative rings */}
        <div className="absolute inset-3 rounded-full" style={{ border: `1px solid ${c.color}18` }} />
        <div className="absolute inset-6 rounded-full" style={{ border: `1px solid ${c.color}10` }} />

        <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
          {/* Track */}
          <circle cx="72" cy="72" r={R} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" />
          {/* Background arc */}
          <circle cx="72" cy="72" r={R} fill="none" stroke={`${c.color}20`} strokeWidth="8"
            strokeDasharray={C} strokeDashoffset="0" strokeLinecap="round" />
          {/* Progress */}
          <motion.circle cx="72" cy="72" r={R} fill="none"
            stroke={c.color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C - (n / 100) * C }}
            transition={{ duration: 0.016 }}
            style={{ filter: `drop-shadow(0 0 10px ${c.color}) drop-shadow(0 0 20px ${c.color}80)` }}
          />
        </svg>

        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-black tabular-nums"
            style={{ color: c.color, textShadow: `0 0 30px ${c.glow}`, letterSpacing: '-2px' }}
          >
            {n}
          </motion.span>
          <span className="text-xs font-medium mt-0.5" style={{ color: 'rgba(148,163,184,.5)' }}>/ 100</span>
        </div>
      </div>

      {/* Verdict pill */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 260, damping: 20 }}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm"
        style={{
          background: c.bg,
          border: `1px solid ${c.color}35`,
          color: c.color,
          boxShadow: `0 0 30px ${c.glow.replace('.6', '.3')}`,
          letterSpacing: '.04em',
        }}
      >
        <span>{c.emoji}</span>
        <span>{c.label}</span>
      </motion.div>
    </div>
  );
}