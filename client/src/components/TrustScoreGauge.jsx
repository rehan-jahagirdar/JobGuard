import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const V = {
  SAFE:        { color:'#23d18b', label:'Safe',        emoji:'✅', glow:'rgba(35,209,139,.5)' },
  SUSPICIOUS:  { color:'#f5a623', label:'Suspicious',  emoji:'⚠️', glow:'rgba(245,166,35,.5)' },
  LIKELY_FAKE: { color:'#f5564a', label:'Likely Fake', emoji:'🚨', glow:'rgba(245,86,74,.5)'  },
};

export default function TrustScoreGauge({ score, verdict }) {
  const [n, setN] = useState(0);
  const cfg = V[verdict] || V.SUSPICIOUS;

  useEffect(() => {
    const t0 = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const p = Math.min((now-t0)/dur, 1);
      const e = 1 - Math.pow(1-p, 4);
      setN(Math.round(e*score));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  const R = 60, C = 2*Math.PI*R;
  const offset = C - (n/100)*C;

  return (
    <div className="flex flex-col items-center gap-5 shrink-0">
      <div className="relative w-44 h-44">
        {/* outer glow */}
        <div className="absolute inset-0 rounded-full"
          style={{ boxShadow:`0 0 70px ${cfg.glow}`, opacity:.5 }} />
        <svg className="w-full h-full -rotate-90" viewBox="0 0 136 136">
          <circle cx="68" cy="68" r={R} fill="none"
            stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <circle cx="68" cy="68" r={R} fill="none"
            stroke={cfg.color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={offset}
            style={{
              transition:'stroke-dashoffset .016s linear',
              filter:`drop-shadow(0 0 10px ${cfg.color})`
            }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tabular-nums"
            style={{ fontFamily:'Syne,sans-serif', color:cfg.color }}>{n}</span>
          <span style={{ color:'var(--muted)', fontSize:11 }}>/ 100</span>
        </div>
      </div>

      <motion.div
        initial={{ scale:0, opacity:0 }}
        animate={{ scale:1, opacity:1 }}
        transition={{ delay:.5, type:'spring', stiffness:220 }}
        className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm"
        style={{
          background:`${cfg.color}18`,
          border:`1px solid ${cfg.color}44`,
          color: cfg.color,
          boxShadow:`0 0 24px ${cfg.glow}`,
          fontFamily:'Syne,sans-serif',
        }}
      >
        {cfg.emoji} {cfg.label}
      </motion.div>
    </div>
  );
}