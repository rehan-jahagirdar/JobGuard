import { motion } from 'framer-motion';
import { Shield, Zap, Eye, Building2 } from 'lucide-react';
import BlurText from '../components/BlurText';
import InputForm from '../components/InputForm';
import LoadingAnalysis from '../components/LoadingAnalysis';
import ResultCard from '../components/ResultCard';
import { useAnalyze } from '../hooks/useAnalyze';

const STATS = [
  { value: '20,000+', label: 'Fraud cases since 2024', icon: '📊' },
  { value: '₹crores', label: 'Lost to fake jobs',      icon: '💸' },
  { value: '10 sec',  label: 'To detect a scam',       icon: '⚡' },
];

const FEATURES = [
  {
    icon: Shield,
    color: '#7c3aed',
    bg: 'rgba(124,58,237,.1)',
    border: 'rgba(124,58,237,.2)',
    title: 'Trust Score',
    desc: 'AI calculates a trust score from 0 to 100 based on dozens of scam indicators.',
  },
  {
    icon: Eye,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,.08)',
    border: 'rgba(6,182,212,.18)',
    title: 'Scam Red Flags',
    desc: 'Highlights suspicious patterns like fee requests, vague roles, and fake contacts.',
  },
  {
    icon: Building2,
    color: '#10b981',
    bg: 'rgba(16,185,129,.08)',
    border: 'rgba(16,185,129,.18)',
    title: 'Company Check',
    desc: 'Verifies whether the company has a legitimate web presence and known domain.',
  },
];

export default function Home() {
  const { result, loading, error, step, analyze, reset } = useAnalyze();
  const showHero = !result && !loading;

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 space-y-12">

      {/* ── Hero ── */}
      {showHero && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(239,68,68,.08)',
              border: '1px solid rgba(239,68,68,.2)',
              color: '#fca5a5',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"
              style={{ boxShadow: '0 0 6px rgba(239,68,68,.8)', animation: 'pulse 2s infinite' }} />
            20,000+ Indian students scammed by fake jobs since 2024
          </motion.div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
              <BlurText text="Is this job" delay={0.1} />
              <br />
              <motion.span
                initial={{ opacity:0, filter:'blur(16px)', y:16 }}
                animate={{ opacity:1, filter:'blur(0px)', y:0 }}
                transition={{ duration:.65, delay:.45, ease:[.22,1,.36,1] }}
                className="gradient-text"
                style={{ display:'inline-block', paddingBottom:'.08em', lineHeight:1.1 }}
              >
                posting real?
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:.7 }}
              className="text-base md:text-lg max-w-md mx-auto leading-relaxed"
              style={{ color:'var(--text-secondary)' }}
            >
              Paste any job URL or description. Gemini AI analyzes it instantly
              and reveals exactly why it might be a scam.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:.82 }}
            className="flex items-center justify-center gap-8 md:gap-12"
          >
            {STATS.map((s, i) => (
              <motion.div key={i} className="text-center"
                whileHover={{ scale:1.06, y:-2 }}
                transition={{ type:'spring', stiffness:300 }}>
                <p className="text-2xl font-black" style={{ color:'var(--text-primary)' }}>
                  {s.icon} {s.value}
                </p>
                <p className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Powered by */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.96 }}
            className="flex items-center justify-center gap-2 text-xs"
            style={{ color:'var(--text-muted)' }}
          >
            Powered by
            {[
              { label:'Google Gemini AI', c:'rgba(124,58,237,.22)', tc:'#a78bfa', bc:'rgba(124,58,237,.1)' },
              { label:'Firebase',          c:'rgba(6,182,212,.18)',  tc:'#67e8f9', bc:'rgba(6,182,212,.08)' },
            ].map((b, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full font-semibold"
                style={{ background:b.bc, border:`1px solid ${b.c}`, color:b.tc }}>
                {b.label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* ── Input / Loading / Result ── */}
      {!loading && !result && <InputForm onSubmit={analyze} error={error} />}
      {loading && <LoadingAnalysis step={step} />}
      {result && !loading && <ResultCard result={result} onReset={reset} />}

      {/* ── Features (only on hero) ── */}
      {showHero && (
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:1.0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {FEATURES.map((f, i) => (
            <motion.div key={i}
              whileHover={{ scale:1.03, y:-4 }}
              transition={{ type:'spring', stiffness:280, damping:20 }}
              className="glass-card rounded-2xl p-5 space-y-3"
              style={{ cursor:'default' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background:f.bg, border:`1px solid ${f.border}` }}>
                <f.icon size={18} style={{ color:f.color }} />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1" style={{ color:'var(--text-primary)' }}>
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color:'var(--text-secondary)' }}>
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}