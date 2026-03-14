import { motion } from 'framer-motion';

const SEV = {
  high:   { color: '#ef4444', bg: 'rgba(239,68,68,.07)',   border: 'rgba(239,68,68,.22)',   label: 'High Risk' },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,.07)',  border: 'rgba(245,158,11,.22)',  label: 'Medium'    },
  low:    { color: '#22d3ee', bg: 'rgba(34,211,238,.06)',  border: 'rgba(34,211,238,.2)',   label: 'Low Risk'  },
};

const ICONS = {
  PAYMENT: '💰', PERSONAL_DATA: '🪪', VAGUE_DETAILS: '🌫️',
  UNREALISTIC_OFFER: '🤑', CONTACT: '📞', URGENCY: '⏱️',
  COMPANY: '🏢', LANGUAGE: '📝',
};

export default function FlagCard({ flag, index }) {
  const s = SEV[flag.severity] || SEV.low;
  return (
    <motion.div
      initial={{ opacity: 0, x: -22, filter: 'blur(4px)' }}
      animate={{ opacity: 1, x: 0,   filter: 'blur(0px)' }}
      transition={{ duration: 0.42, delay: index * 0.075, ease: [.22,1,.36,1] }}
      className="rounded-2xl p-4"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,.06)`,
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5 shrink-0 leading-none">{ICONS[flag.category] || '⚠️'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="font-semibold text-white text-sm"
              style={{ fontFamily: 'Syne,sans-serif' }}>
              {flag.title}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: `${s.color}1a`,
                color: s.color,
                border: `1px solid ${s.color}35`,
              }}>
              {s.label}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            {flag.explanation}
          </p>
        </div>
      </div>
    </motion.div>
  );
}