import { motion } from 'framer-motion';
import BlurText from '../components/BlurText';
import InputForm from '../components/InputForm';
import LoadingAnalysis from '../components/LoadingAnalysis';
import ResultCard from '../components/ResultCard';
import { useAnalyze } from '../hooks/useAnalyze';

const STATS = [
  { value: '11,000+', label: 'Fraud cases in 2023', icon: '📊' },
  { value: '₹crores', label: 'Lost to fake jobs',   icon: '💸' },
  { value: '10 sec',  label: 'To detect a scam',    icon: '⚡' },
];

const FEATURES = [
  { icon: '🎯', text: 'Trust Score 0–100' },
  { icon: '🚩', text: 'Specific red flags' },
  { icon: '🏢', text: 'Company verification' },
  { icon: '💡', text: 'Plain-language advice' },
];

export default function Home() {
  const { result, loading, error, step, analyze, reset } = useAnalyze();

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 space-y-10">

      {!result && !loading && (
        <div className="text-center space-y-8">

          {/* top badge */}
          <motion.div
            initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(239,68,68,.08)',
              border: '1px solid rgba(239,68,68,.2)',
              color: '#fca5a5',
            }}
          >
            🚨 20,000+ Indian students scammed by fake jobs since 2024
          </motion.div>

          {/* headline */}
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:750, lineHeight:1.08 }}
              className="text-4xl md:text-5xl">
              <BlurText text="Is this Job" delay={0.1} />
              <br />
              <motion.span
                initial={{ opacity:0, filter:'blur(16px)', y:14 }}
                animate={{ opacity:1, filter:'blur(0px)', y:0 }}
                transition={{ duration:.6, delay:.44, ease:[.22,1,.36,1] }}
                className="shimmer-text"
                style={{ display:'inline-block', paddingBottom:'.1em', lineHeight:1.15 }}
              >
                posting real?
              </motion.span>
            </h1>
          </div>

          {/* subtitle */}
          <motion.p
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:.68 }}
            className="text-base max-w-md mx-auto leading-relaxed"
            style={{ color:'var(--muted)' }}
          >
            Paste any job URL or description. Gemini AI analyzes it in seconds and
            tells you <em>exactly</em> why it might be a scam — specific red flags, not vague warnings.
          </motion.p>

          {/* feature pills */}
          <motion.div
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:.76 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {FEATURES.map((f, i) => (
              <span key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: 'var(--glass)',
                  border: '1px solid var(--border)',
                  color: 'var(--muted)',
                  backdropFilter: 'blur(12px)',
                }}>
                {f.icon} {f.text}
              </span>
            ))}
          </motion.div>

          {/* stats */}
          <motion.div
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:.82 }}
            className="flex items-center justify-center gap-10 py-2"
          >
            {STATS.map((s, i) => (
              <motion.div key={i} className="text-center"
                whileHover={{ scale:1.05 }} transition={{ type:'spring', stiffness:300 }}>
                <p className="text-xl font-bold" style={{ fontFamily:'Syne,sans-serif' }}>
                  {s.icon} {s.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color:'var(--faint)' }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* powered by */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.95 }}
            className="flex items-center justify-center gap-2 text-xs"
            style={{ color:'var(--faint)' }}
          >
            <span>Powered by</span>
            {[
              { label:'Google Gemini AI', color:'rgba(139,92,246,.25)', tc:'#a78bfa', bc:'rgba(139,92,246,.12)' },
              { label:'Firebase',          color:'rgba(34,211,238,.2)',  tc:'#67e8f9', bc:'rgba(34,211,238,.08)' },
            ].map((b,i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-full font-medium"
                style={{ background:b.bc, border:`1px solid ${b.color}`, color:b.tc }}>
                {b.label}
              </span>
            ))}
          </motion.div>
        </div>
      )}

      {!loading && !result && <InputForm onSubmit={analyze} error={error} />}
      {loading && <LoadingAnalysis step={step} />}
      {result && !loading && <ResultCard result={result} onReset={reset} />}
    </div>
  );
}