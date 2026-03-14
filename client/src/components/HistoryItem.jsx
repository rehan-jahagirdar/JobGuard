import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';

const VERDICT_CFG = {
  SAFE:        { color: '#10b981', label: 'Safe',        bg: 'rgba(16,185,129,.08)'  },
  SUSPICIOUS:  { color: '#f59e0b', label: 'Suspicious',  bg: 'rgba(245,158,11,.08)' },
  LIKELY_FAKE: { color: '#ef4444', label: 'Likely Fake', bg: 'rgba(239,68,68,.08)'  },
};

export default function HistoryItem({ item, index }) {
  const c = VERDICT_CFG[item.verdict] || VERDICT_CFG.SUSPICIOUS;
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer group"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
        style={{ background: c.bg, border: `1px solid ${c.color}25` }}>
        <span className="text-lg font-bold tabular-nums" style={{ color: c.color, fontSize: 13 }}>
          {item.trustScore}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {item.jobTitle || 'Job Posting'}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <Clock size={11} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {item.companyName !== 'Unknown' ? item.companyName : 'Unknown Company'}
          </span>
        </div>
      </div>
      <span className="text-xs px-2 py-1 rounded-full font-medium shrink-0"
        style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}25` }}>
        {c.label}
      </span>
      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }}
        className="shrink-0 transition-transform group-hover:translate-x-0.5" />
    </motion.div>
  );
}