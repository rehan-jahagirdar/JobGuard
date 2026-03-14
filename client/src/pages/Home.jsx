import { motion } from 'framer-motion';
import { Shield, Eye, Building2 } from 'lucide-react';
import BlurText from '../components/BlurText';
import InputForm from '../components/InputForm';
import LoadingAnalysis from '../components/LoadingAnalysis';
import ResultCard from '../components/ResultCard';
import { useAnalyze } from '../hooks/useAnalyze';

const STATS = [
  { value: '20,000+', label: 'Fraud cases since 2024' },
  { value: '₹crores', label: 'Lost to fake jobs' },
  { value: '10 sec',  label: 'To detect a scam' },
];

const FEATURES = [
  { icon: Shield,    color:'#7c3aed', bg:'rgba(124,58,237,.1)',  border:'rgba(124,58,237,.2)',  title:'Trust Score',     desc:'AI scores trust 0–100 using dozens of scam indicators.' },
  { icon: Eye,       color:'#06b6d4', bg:'rgba(6,182,212,.08)',  border:'rgba(6,182,212,.18)',  title:'Red Flags',       desc:'Highlights fee requests, vague roles, and fake contacts.' },
  { icon: Building2, color:'#10b981', bg:'rgba(16,185,129,.08)', border:'rgba(16,185,129,.18)', title:'Company Check',   desc:'Verifies if the company has a legitimate online presence.' },
];

export default function Home() {
  const { result, loading, error, step, analyze, reset } = useAnalyze();
  const showHero = !result && !loading;

  return (
    <div className="page-wrapper" style={{ display:'flex', flexDirection:'column', gap:'2.5rem' }}>

      {/* ── Hero ── */}
      {showHero && (
        <div style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem' }}>

          {/* Alert badge */}
          <motion.div
            initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
            style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'6px 14px', borderRadius:999,
              background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)',
              color:'#fca5a5', fontSize:12, fontWeight:600,
              maxWidth:'100%', textAlign:'center',
            }}
          >
            <span style={{
              width:6, height:6, borderRadius:'50%', background:'#f87171', flexShrink:0,
              boxShadow:'0 0 6px rgba(239,68,68,.8)',
            }} />
            <span>20,000+ Indian students scammed by fake jobs since 2024</span>
          </motion.div>

          {/* Headline */}
          <div style={{ width:'100%' }}>
            <h1 className="hero-title">
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
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.7 }}
              className="hero-subtitle"
              style={{ color:'var(--text-secondary)', maxWidth:440, margin:'0.75rem auto 0' }}
            >
              Paste any job URL or description. Gemini AI analyzes it instantly
              and reveals exactly why it might be a scam.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.82 }}
            className="stats-row"
          >
            {STATS.map((s, i) => (
              <motion.div key={i} style={{ textAlign:'center', minWidth:70 }}
                whileHover={{ scale:1.05, y:-2 }} transition={{ type:'spring', stiffness:300 }}>
                <p style={{ fontSize:'clamp(1.1rem, 4vw, 1.5rem)', fontWeight:900, color:'var(--text-primary)' }}>
                  {s.value}
                </p>
                <p style={{ fontSize:11, marginTop:3, color:'var(--text-muted)' }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Powered by */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.96 }}
            style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:6, fontSize:12, color:'var(--text-muted)' }}
          >
            <span>Powered by</span>
            {[
              { label:'Google Gemini AI', c:'rgba(124,58,237,.22)', tc:'#a78bfa', bc:'rgba(124,58,237,.1)' },
              { label:'Firebase',         c:'rgba(6,182,212,.18)',  tc:'#67e8f9', bc:'rgba(6,182,212,.08)' },
            ].map((b,i) => (
              <span key={i} style={{
                padding:'3px 10px', borderRadius:999, fontWeight:600,
                background:b.bc, border:`1px solid ${b.c}`, color:b.tc, fontSize:11,
              }}>
                {b.label}
              </span>
            ))}
          </motion.div>
        </div>
      )}

      {/* ── Input / Loading / Result ── */}
      {!loading && !result && <InputForm onSubmit={analyze} error={error} />}
      {loading && <LoadingAnalysis step={step} />}
      {result && !loading && <ResultCard result={result} onReset={reset} />}

      {/* ── Features ── */}
      {showHero && (
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.0 }}
          className="features-grid"
        >
          {FEATURES.map((f, i) => (
            <motion.div key={i}
              whileHover={{ scale:1.02, y:-3 }}
              transition={{ type:'spring', stiffness:280, damping:20 }}
              className="glass-card"
              style={{ borderRadius:18, padding:'1.1rem', display:'flex', flexDirection:'column', gap:10 }}
            >
              <div style={{
                width:38, height:38, borderRadius:10,
                background:f.bg, border:`1px solid ${f.border}`,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}>
                <f.icon size={17} style={{ color:f.color }} />
              </div>
              <div>
                <p style={{ fontWeight:700, fontSize:13, marginBottom:4, color:'var(--text-primary)' }}>{f.title}</p>
                <p style={{ fontSize:12, lineHeight:1.6, color:'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}