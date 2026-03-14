import { motion } from 'framer-motion';

const STEPS = {
  fetching:  { icon: '🌐', title: 'Fetching job posting...', sub: 'Pulling content from the URL you provided' },
  analyzing: { icon: '🧠', title: 'Gemini AI is analyzing...', sub: 'Cross-checking 50+ scam patterns' },
};

export default function LoadingAnalysis({ step }) {
  const s = STEPS[step] || STEPS.analyzing;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-28 gap-10"
    >
      {/* rings */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {[44, 76, 108, 140].map((size, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              border: `1px solid rgba(139,92,246,${.65 / (i + 1)})`,
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [1, .2, 1] }}
            transition={{ duration: 2.4, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <motion.span
          className="text-4xl relative z-10"
          animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {s.icon}
        </motion.span>
      </div>

      <div className="text-center space-y-2">
        <motion.p
          key={s.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold"
          style={{ fontFamily: 'Syne,sans-serif' }}
        >
          {s.title}
        </motion.p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{s.sub}</p>
      </div>

      {/* dots */}
      <div className="flex gap-2">
        {[0, 1, 2, 3].map(i => (
          <motion.div key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--violet)' }}
            animate={{ opacity: [.2, 1, .2], scale: [.7, 1.3, .7] }}
            transition={{ duration: 1.4, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}