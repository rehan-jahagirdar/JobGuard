import { motion } from 'framer-motion';

const SEV = {
  high:   { color:'#ef4444', bg:'rgba(239,68,68,.07)',   border:'rgba(239,68,68,.2)',   label:'High Risk' },
  medium: { color:'#f59e0b', bg:'rgba(245,158,11,.07)',  border:'rgba(245,158,11,.2)',  label:'Medium'    },
  low:    { color:'#38bdf8', bg:'rgba(56,189,248,.06)',  border:'rgba(56,189,248,.18)', label:'Low Risk'  },
};

const ICONS = {
  PAYMENT:'💰', PERSONAL_DATA:'🪪', VAGUE_DETAILS:'🌫️',
  UNREALISTIC_OFFER:'🤑', CONTACT:'📞', URGENCY:'⏱️',
  COMPANY:'🏢', LANGUAGE:'📝',
};

export default function FlagCard({ flag, index }) {
  const s = SEV[flag.severity] || SEV.low;
  const safeStr = v => typeof v==='string' ? v : v ? JSON.stringify(v) : '';

  return (
    <motion.div
      initial={{ opacity:0, x:-16, filter:'blur(4px)' }}
      animate={{ opacity:1, x:0, filter:'blur(0px)' }}
      transition={{ duration:.4, delay:index*.07, ease:[.22,1,.36,1] }}
      style={{
        borderRadius:16, padding:'12px 14px',
        background:s.bg, border:`1px solid ${s.border}`,
        boxShadow:'inset 0 1px 0 rgba(255,255,255,.05)',
      }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
        {/* Icon */}
        <div style={{
          width:34, height:34, borderRadius:10, fontSize:16,
          background:`${s.color}15`, border:`1px solid ${s.color}25`,
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          {ICONS[flag.category] || '⚠️'}
        </div>

        {/* Content */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:6, marginBottom:5 }}>
            <span style={{ fontWeight:600, fontSize:13, color:'var(--text-primary)', wordBreak:'break-word' }}>
              {safeStr(flag.title)}
            </span>
            <span style={{
              display:'inline-flex', alignItems:'center', gap:4,
              fontSize:11, padding:'2px 8px', borderRadius:999, fontWeight:500,
              background:`${s.color}15`, color:s.color, border:`1px solid ${s.color}28`,
              whiteSpace:'nowrap',
            }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:s.color, flexShrink:0 }} />
              {s.label}
            </span>
          </div>
          <p style={{ fontSize:12, lineHeight:1.6, color:'var(--text-secondary)', wordBreak:'break-word' }}>
            {safeStr(flag.explanation)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}