import { motion } from 'framer-motion';

const STEPS = {
  fetching:  { icon: '🌐', text: 'Fetching job posting...', sub: 'Pulling content from the URL' },
  analyzing: { icon: '🧠', text: 'AI is analyzing...', sub: 'Scanning 50+ scam patterns with Gemini' },
};

export default function LoadingAnalysis({ step }) {
  const s = STEPS[step] || STEPS.analyzing;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-28 gap-10"
    >
      {/* Pulsing rings */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {[1,2,3,4].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${i*28}px`, height: `${i*28}px`,
              border: `1px solid rgba(124,92,252,${0.7/i})`,
            }}
            animate={{ scale:[1,1.18,1], opacity:[1,0.25,1] }}
            transition={{ duration: 2.2, delay: i*0.28, repeat: Infinity, ease:'easeInOut' }}
          />
        ))}
        <motion.span
          className="text-4xl relative z-10"
          animate={{ scale:[1,1.1,1] }}
          transition={{ duration:1.5, repeat:Infinity, ease:'easeInOut' }}
        >
          {s.icon}
        </motion.span>
      </div>

      <div className="text-center space-y-2">
        <motion.p
          key={s.text}
          initial={{ opacity:0, y:8 }}
          animate={{ opacity:1, y:0 }}
          className="text-xl font-semibold"
          style={{ fontFamily:'Syne,sans-serif' }}
        >
          {s.text}
        </motion.p>
        <p style={{ color:'var(--muted)', fontSize:13 }}>{s.sub}</p>
      </div>

      <div className="flex gap-2">
        {[0,1,2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
            style={{ background:'var(--accent)' }}
            animate={{ opacity:[0.2,1,0.2], scale:[0.7,1.3,0.7] }}
            transition={{ duration:1.4, delay:i*0.22, repeat:Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}