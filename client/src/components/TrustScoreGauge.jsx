import { useEffect, useState } from 'react';

const VERDICT_CONFIG = {
  SAFE:         { color: '#22c55e', label: 'Safe',        bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-400' },
  SUSPICIOUS:   { color: '#f59e0b', label: 'Suspicious',  bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
  LIKELY_FAKE:  { color: '#ef4444', label: 'Likely Fake', bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-400' },
};

export default function TrustScoreGauge({ score, verdict }) {
  const [displayScore, setDisplayScore] = useState(0);
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.SUSPICIOUS;

  // Animate score counting up
  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      current += 2;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(current);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  // SVG arc calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular gauge */}
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background track */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth="12"
          />
          {/* Score arc */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: config.color }}>
            {displayScore}
          </span>
          <span className="text-gray-400 text-xs">/ 100</span>
        </div>
      </div>

      {/* Verdict badge */}
      <div className={`px-6 py-2 rounded-full border font-semibold text-sm ${config.bg} ${config.border} ${config.text}`}>
        {verdict === 'LIKELY_FAKE' ? '🚨' : verdict === 'SUSPICIOUS' ? '⚠️' : '✅'} {config.label}
      </div>
    </div>
  );
}