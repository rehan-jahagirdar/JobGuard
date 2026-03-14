import { motion } from 'framer-motion';

const SEVERITY = {
  high:   { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.07)',  border: 'rgba(239, 68, 68, 0.2)',  label: 'High Risk' },
  medium: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.07)', border: 'rgba(245, 158, 11, 0.2)', label: 'Medium' },
  low:    { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.07)', border: 'rgba(96, 165, 250, 0.2)', label: 'Low Risk' },
};

const ICONS = {
  PAYMENT:           '💰',
  PERSONAL_DATA:     '🪪',
  VAGUE_DETAILS:     '🌫️',
  UNREALISTIC_OFFER: '🤑',
  CONTACT:           '📞',
  URGENCY:           '⏱️',
  COMPANY:           '🏢',
  LANGUAGE:          '📝',
};

export default function FlagCard({ flag, index }) {
  const s = SEVERITY[flag.severity] || SEVERITY.low;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-2xl p-4"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5 shrink-0">{ICONS[flag.category] || '⚠️'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-white text-sm">{flag.title}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: `${s.color}20`,
                color: s.color,
                border: `1px solid ${s.color}30`,
              }}
            >
              {s.label}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {flag.explanation}
          </p>
        </div>
      </div>
    </motion.div>
  );
}