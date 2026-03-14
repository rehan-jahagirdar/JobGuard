import { motion } from 'framer-motion';

const SEV = {
  high:   { color:'#f5564a', bg:'rgba(245,86,74,.07)',   border:'rgba(245,86,74,.22)',   label:'High Risk' },
  medium: { color:'#f5a623', bg:'rgba(245,166,35,.07)',  border:'rgba(245,166,35,.22)',  label:'Medium' },
  low:    { color:'#36b8f5', bg:'rgba(54,184,245,.07)',  border:'rgba(54,184,245,.22)',  label:'Low Risk' },
};
const ICONS = {
  PAYMENT:'💰', PERSONAL_DATA:'🪪', VAGUE_DETAILS:'🌫️',
  UNREALISTIC_OFFER:'🤑', CONTACT:'📞', URGENCY:'⏱️', COMPANY:'🏢', LANGUAGE:'📝',
};

export default function FlagCard({ flag, index }) {
  const s = SEV[flag.severity] || SEV.low;
  return (
    <motion.div
      initial={{ opacity:0, x:-18 }}
      animate={{ opacity:1, x:0 }}
      transition={{ duration:.4, delay:index*.07, ease:[.22,1,.36,1] }}
      className="rounded-2xl p-4"
      style={{ background:s.bg, border:`1px solid ${s.border}` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5 shrink-0">{ICONS[flag.category]||'⚠️'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-white text-sm"
              style={{ fontFamily:'Syne,sans-serif' }}>{flag.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background:`${s.color}20`, color:s.color, border:`1px solid ${s.color}30` }}>
              {s.label}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color:'var(--muted)' }}>
            {flag.explanation}
          </p>
        </div>
      </div>
    </motion.div>
  );
}