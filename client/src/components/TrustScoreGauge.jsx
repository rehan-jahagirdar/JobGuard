import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CFG = {
  SAFE:        { color:'#10b981', label:'Safe',        emoji:'✅', glow:'rgba(16,185,129,.6)',  bg:'rgba(16,185,129,.08)'  },
  SUSPICIOUS:  { color:'#f59e0b', label:'Suspicious',  emoji:'⚠️', glow:'rgba(245,158,11,.6)', bg:'rgba(245,158,11,.08)' },
  LIKELY_FAKE: { color:'#ef4444', label:'Likely Fake', emoji:'🚨', glow:'rgba(239,68,68,.6)',  bg:'rgba(239,68,68,.08)'  },
};

export default function TrustScoreGauge({ score, verdict }) {
  const [n, setN] = useState(0);
  const c = CFG[verdict] || CFG.SUSPICIOUS;
  const size = 160; // Consistent size, responsive via container
  const R = 60, C = 2 * Math.PI * R;

  useEffect(() => {
    const t0 = performance.now(), dur = 1800;
    const tick = now => {
      const p = Math.min((now-t0)/dur, 1);
      const e = 1 - Math.pow(1-p, 4);
      setN(Math.round(e*score));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, flexShrink:0 }}>
      {/* Gauge */}
      <div style={{ position:'relative', width:size, height:size }}>
        {/* Glow */}
        <motion.div
          animate={{ opacity:[.35,.7,.35], scale:[1,1.03,1] }}
          transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
          style={{
            position:'absolute', inset:0, borderRadius:'50%',
            boxShadow:`0 0 60px ${c.glow}, 0 0 120px ${c.glow.replace('.6','.2')}`,
          }}
        />
        {/* Inner rings */}
        <div style={{ position:'absolute', inset:8, borderRadius:'50%', border:`1px solid ${c.color}18` }} />
        <div style={{ position:'absolute', inset:16, borderRadius:'50%', border:`1px solid ${c.color}10` }} />

        <svg
          style={{ width:'100%', height:'100%', transform:'rotate(-90deg)' }}
          viewBox="0 0 136 136"
        >
          <circle cx="68" cy="68" r={R} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" />
          <circle cx="68" cy="68" r={R} fill="none" stroke={`${c.color}20`} strokeWidth="8"
            strokeDasharray={C} strokeDashoffset="0" strokeLinecap="round" />
          <motion.circle cx="68" cy="68" r={R} fill="none"
            stroke={c.color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset:C }}
            animate={{ strokeDashoffset: C - (n/100)*C }}
            transition={{ duration:.016 }}
            style={{ filter:`drop-shadow(0 0 8px ${c.color}) drop-shadow(0 0 16px ${c.color}80)` }}
          />
        </svg>

        {/* Center */}
        <div style={{
          position:'absolute', inset:0,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        }}>
          <span style={{
            fontSize:42, fontWeight:900, letterSpacing:'-2px', color:c.color,
            textShadow:`0 0 25px ${c.glow}`, lineHeight:1,
          }}>
            {n}
          </span>
          <span style={{ fontSize:11, color:'rgba(148,163,184,.5)', marginTop:2 }}>/ 100</span>
        </div>
      </div>

      {/* Verdict pill */}
      <motion.div
        initial={{ scale:0, opacity:0 }}
        animate={{ scale:1, opacity:1 }}
        transition={{ delay:.6, type:'spring', stiffness:260, damping:20 }}
        style={{
          display:'flex', alignItems:'center', gap:6,
          padding:'8px 20px', borderRadius:999, fontWeight:700, fontSize:13,
          background:c.bg, border:`1px solid ${c.color}35`, color:c.color,
          boxShadow:`0 0 24px ${c.glow.replace('.6','.3')}`,
          letterSpacing:'.04em', whiteSpace:'nowrap',
        }}
      >
        <span>{c.emoji}</span>
        <span>{c.label}</span>
      </motion.div>
    </div>
  );
}