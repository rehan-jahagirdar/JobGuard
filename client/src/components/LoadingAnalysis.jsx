import { motion } from 'framer-motion';

const STEPS = {
  fetching:  { icon:'🌐', title:'Fetching job posting...', sub:'Pulling content from the URL' },
  analyzing: { icon:'🧠', title:'AI is analyzing...', sub:'Scanning 50+ scam patterns with Gemini' },
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
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'4rem 1rem', gap:'2rem' }}
    >
      {/* Rings */}
      <div style={{ position:'relative', width:140, height:140, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {[140,110,80,52].map((size,i) => (
          <motion.div key={i}
            style={{
              position:'absolute', borderRadius:'50%',
              width:size, height:size,
              border:`1px solid rgba(124,58,237,${.7/(i+1)})`,
            }}
            animate={{ scale:[1,1.1,1], opacity:[1,.2,1] }}
            transition={{ duration:2.6, delay:i*.32, repeat:Infinity, ease:'easeInOut' }}
          />
        ))}
        <motion.span
          style={{ fontSize:40, position:'relative', zIndex:1 }}
          animate={{ scale:[1,1.07,1] }}
          transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }}
        >
          {s.icon}
        </motion.span>
      </div>

      {/* Text */}
      <div style={{ textAlign:'center', display:'flex', flexDirection:'column', gap:6 }}>
        <motion.h3
          key={s.title}
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
          style={{ fontSize:'clamp(1rem, 3vw, 1.25rem)', fontWeight:700 }}
        >
          {s.title}
        </motion.h3>
        <p style={{ fontSize:13, color:'var(--text-secondary)' }}>{s.sub}</p>
      </div>

      {/* Scan items */}
      <div
        className="glass-card"
        style={{ borderRadius:16, padding:'1rem', width:'100%', maxWidth:340, display:'flex', flexDirection:'column', gap:8 }}
      >
        {SCAN_ITEMS.map((item,i) => (
          <motion.div key={i}
            initial={{ opacity:0, x:-8 }}
            animate={{ opacity:[0,1,1,.3], x:0 }}
            transition={{ duration:2, delay:i*.4, repeat:Infinity, repeatDelay:SCAN_ITEMS.length*.4 }}
            style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--text-secondary)' }}
          >
            <motion.div
              style={{ width:6, height:6, borderRadius:'50%', background:'rgba(124,58,237,.7)', flexShrink:0 }}
              animate={{ scale:[1,1.4,1], opacity:[.5,1,.5] }}
              transition={{ duration:1.2, delay:i*.4, repeat:Infinity }}
            />
            {item}
          </motion.div>
        ))}
      </div>

      {/* Dots */}
      <div style={{ display:'flex', gap:6 }}>
        {[0,1,2,3].map(i => (
          <motion.div key={i}
            style={{ width:7, height:7, borderRadius:'50%', background:'rgba(124,58,237,.6)' }}
            animate={{ opacity:[.2,1,.2], scale:[.7,1.3,.7] }}
            transition={{ duration:1.4, delay:i*.2, repeat:Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}