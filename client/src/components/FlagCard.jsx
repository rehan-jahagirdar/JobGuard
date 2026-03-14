import { motion } from 'framer-motion';

const SEV = {
  high:   { color: '#ef4444', bg: 'rgba(239,68,68,.07)',   border: 'rgba(239,68,68,.2)',   label: 'High Risk',  dot: '#ef4444' },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,.07)',  border: 'rgba(245,158,11,.2)',  label: 'Medium',     dot: '#f59e0b' },
  low:    { color: '#38bdf8', bg: 'rgba(56,189,248,.06)',  border: 'rgba(56,189,248,.18)', label: 'Low Risk',   dot: '#38bdf8' },
};

const ICONS = {
  PAYMENT: '💰', PERSONAL_DATA: '🪪', VAGUE_DETAILS: '🌫️',
  UNREALISTIC_OFFER: '🤑', CONTACT: '📞', URGENCY: '⏱️',
  COMPANY: '🏢', LANGUAGE: '📝',
};

export default function FlagCard({ flag, index }) {
  const s = SEV[flag.severity] || SEV.low;
  const safeStr = v => typeof v === 'string' ? v : v ? JSON.stringify(v) : '';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [.22,1,.36,1] }}
      className="rounded-2xl p-4"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,.05)`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 text-lg"
          style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
          {ICONS[flag.category] || '⚠️'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {safeStr(flag.title)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}28` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
              {s.label}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {safeStr(flag.explanation)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}