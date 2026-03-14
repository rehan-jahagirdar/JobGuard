import { motion } from 'framer-motion';

const STEPS = {
  fetching:  { emoji: '🌐', text: 'Fetching job posting...', sub: 'Scraping the URL you provided' },
  analyzing: { emoji: '🧠', text: 'AI is analyzing...', sub: 'Checking against scam patterns' },
};

export default function LoadingAnalysis({ step }) {
  const current = STEPS[step] || STEPS.analyzing;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 space-y-8"
    >
      {/* Animated rings */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${i * 36}px`,
              height: `${i * 36}px`,
              border: `1px solid rgba(124, 58, 237, ${0.6 / i})`,
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.3, 0.8] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
        <span className="text-4xl relative z-10">{current.emoji}</span>
      </div>

      <div className="text-center space-y-2">
        <motion.p
          key={current.text}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold"
        >
          {current.text}
        </motion.p>
        <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-sm">
          {current.sub}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: '#7c3aed' }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}