import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const VERDICT_CONFIG = {
  SAFE:        { color: '#22c55e', label: 'Safe',        glow: 'rgba(34, 197, 94, 0.4)',   emoji: '✅' },
  SUSPICIOUS:  { color: '#f59e0b', label: 'Suspicious',  glow: 'rgba(245, 158, 11, 0.4)',  emoji: '⚠️' },
  LIKELY_FAKE: { color: '#ef4444', label: 'Likely Fake', glow: 'rgba(239, 68, 68, 0.4)',   emoji: '🚨' },
};

export default function TrustScoreGauge({ score, verdict }) {
  const [displayScore, setDisplayScore] = useState(0);
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.SUSPICIOUS;

  // ReactBits-style CountUp animation
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [score]);

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* SVG gauge */}
      <div className="relative w-44 h-44">
        {/* Glow behind gauge */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 60px ${config.glow}`,
            opacity: 0.6,
          }}
        />
        <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
          {/* Track */}
          <circle
            cx="65" cy="65" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          {/* Score arc */}
          <motion.circle
            cx="65" cy="65" r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.016s linear', filter: `drop-shadow(0 0 8px ${config.color})` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tabular-nums" style={{ color: config.color }}>
            {displayScore}
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>/ 100</span>
        </div>
      </div>

      {/* Verdict badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm"
        style={{
          background: `${config.color}18`,
          border: `1px solid ${config.color}44`,
          color: config.color,
          boxShadow: `0 0 20px ${config.glow}`,
        }}
      >
        {config.emoji} {config.label}
      </motion.div>
    </div>
  );
}