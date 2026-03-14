import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

const CFG = {
  SAFE:        { Icon: ShieldCheck, color: '#10b981', bg: 'rgba(16,185,129,.08)',  border: 'rgba(16,185,129,.25)',  text: 'This job posting appears legitimate.' },
  SUSPICIOUS:  { Icon: ShieldAlert, color: '#f59e0b', bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.25)', text: 'Proceed with caution — verify before applying.' },
  LIKELY_FAKE: { Icon: ShieldX,     color: '#ef4444', bg: 'rgba(239,68,68,.08)',  border: 'rgba(239,68,68,.25)',  text: 'High risk — this posting shows multiple scam indicators.' },
};

export default function VerdictBanner({ verdict }) {
  const c = CFG[verdict] || CFG.SUSPICIOUS;
  return (
    <motion.div
      initial={{ opacity: 0, scale: .97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: .2, duration: .4 }}
      className="flex items-center gap-3 rounded-2xl p-4"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <c.Icon size={20} style={{ color: c.color, flexShrink: 0 }} />
      <p className="text-sm font-medium" style={{ color: c.color }}>{c.text}</p>
    </motion.div>
  );
}