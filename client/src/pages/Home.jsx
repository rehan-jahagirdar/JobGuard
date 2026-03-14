import { motion } from 'framer-motion';
import BlurText from '../components/BlurText';
import InputForm from '../components/InputForm';
import LoadingAnalysis from '../components/LoadingAnalysis';
import ResultCard from '../components/ResultCard';
import { useAnalyze } from '../hooks/useAnalyze';

const STATS = [
  { value: '11,000+', label: 'Fraud cases in 2023' },
  { value: '₹crores', label: 'Lost to fake jobs'   },
  { value: '10 sec',  label: 'To detect a scam'    },
];

export default function Home() {
  const { result, loading, error, step, analyze, reset } = useAnalyze();

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 space-y-10">

      {/* Hero — hide when result is shown */}
      {!result && !loading && (
        <div className="text-center space-y-6">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
            }}
          >
            🚨 11,000+ Indian students scammed by fake jobs in 2023
          </motion.div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
  <BlurText text="Is this job" delay={0.1} />
  <br />
  <motion.span
    initial={{ opacity: 0, filter: 'blur(12px)', y: 10 }}
    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    style={{
      display: 'inline-block',
      backgroundImage: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '0.85em',
      paddingBottom: '0.15em',
      lineHeight: '1.2',
    }}
  >
    posting real?
  </motion.span>
</h1>
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-base max-w-md mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Paste any job URL or description. AI analyzes it in seconds and tells you
            exactly why it might be a scam — with specific red flags, not vague warnings.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-8 pt-2"
          >
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>

        </div>
      )}

      {/* States */}
      {!loading && !result && <InputForm onSubmit={analyze} error={error} />}
      {loading && <LoadingAnalysis step={step} />}
      {result && !loading && <ResultCard result={result} onReset={reset} />}

    </div>
  );
}