import { motion } from 'framer-motion';

const STEPS = {
  fetching:  { icon: '🌐', title: 'Fetching job posting...', sub: 'Pulling content from the URL' },
  analyzing: { icon: '🧠', title: 'AI is analyzing...', sub: 'Scanning against 50+ scam patterns with Gemini' },
};

const SCAN_ITEMS = [
  'Checking salary ranges...',
  'Verifying company details...',
  'Analyzing contact info...',
  'Detecting urgency tactics...',
  'Checking payment requests...',
  'Evaluating language patterns...',
];

export default function LoadingAnalysis({ step }) {
  const s = STEPS[step] || STEPS.analyzing;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 gap-10"
    >
      {/* Animated rings */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {[140, 110, 80, 52].map((size, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              border: `1px solid rgba(124,58,237,${.7 / (i + 1)})`,
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [1, .2, 1] }}
            transition={{ duration: 2.6, delay: i * 0.32, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <motion.span
          className="text-5xl relative z-10"
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {s.icon}
        </motion.span>
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <motion.h3
          key={s.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold"
        >
          {s.title}
        </motion.h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.sub}</p>
      </div>

      {/* Scanning items */}
      <div className="glass-card rounded-2xl p-4 w-full max-w-sm space-y-2">
        {SCAN_ITEMS.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: [0, 1, 1, 0.3], x: 0 }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, repeatDelay: SCAN_ITEMS.length * 0.4 }}
            className="flex items-center gap-2 text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            <motion.div className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent-violet)' }}
              animate={{ scale: [1, 1.4, 1], opacity: [.5, 1, .5] }}
              transition={{ duration: 1.2, delay: i * 0.4, repeat: Infinity }}
            />
            {item}
          </motion.div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0,1,2,3].map(i => (
          <motion.div key={i} className="w-2 h-2 rounded-full"
            style={{ background: 'rgba(124,58,237,.6)' }}
            animate={{ opacity: [.2, 1, .2], scale: [.7, 1.3, .7] }}
            transition={{ duration: 1.4, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}