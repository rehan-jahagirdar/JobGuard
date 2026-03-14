import { motion } from 'framer-motion';
import BlurText from '../components/BlurText';
import InputForm from '../components/InputForm';
import LoadingAnalysis from '../components/LoadingAnalysis';
import ResultCard from '../components/ResultCard';
import { useAnalyze } from '../hooks/useAnalyze';

const STATS = [
  { value:'11,000+', label:'Fraud cases in 2023' },
  { value:'₹crores', label:'Lost to fake jobs'   },
  { value:'10 sec',  label:'To detect a scam'    },
];

export default function Home() {
  const { result, loading, error, step, analyze, reset } = useAnalyze();

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 space-y-10">
      {!result && !loading && (
        <div className="text-center space-y-7">

          {/* Badge */}
          <motion.div
            initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{duration:.5}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              background:'rgba(245,86,74,.08)',
              border:'1px solid rgba(245,86,74,.2)',
              color:'#fca5a5',
              fontFamily:'DM Sans,sans-serif',
            }}>
            🚨 11,000+ Indian students scammed by fake jobs in 2023
          </motion.div>

          {/* Headline */}
          <h1 style={{fontFamily:'Syne,sans-serif',fontWeight:800,lineHeight:1.1}}
            className="text-5xl md:text-6xl">
            <BlurText text="Is this job" delay={0.1} />
            <br />
            <motion.span
              initial={{opacity:0,filter:'blur(14px)',y:12}}
              animate={{opacity:1,filter:'blur(0px)',y:0}}
              transition={{duration:.6,delay:.42,ease:[.22,1,.36,1]}}
              style={{
                display:'inline-block',
                backgroundImage:'linear-gradient(135deg,#a78bfa 0%,#36b8f5 100%)',
                WebkitBackgroundClip:'text',
                WebkitTextFillColor:'transparent',
                backgroundClip:'text',
                paddingBottom:'.12em',
                lineHeight:1.15,
              }}>
              posting real?
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.65}}
            className="text-base max-w-md mx-auto leading-relaxed"
            style={{color:'var(--muted)'}}>
            Paste any job URL or description. Gemini AI analyzes it in seconds and tells
            you <em>exactly</em> why it might be a scam — specific red flags, not vague warnings.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.75}}
            className="flex items-center justify-center gap-10 pt-1">
            {STATS.map((s,i) => (
              <div key={i} className="text-center">
                <p className="text-lg font-bold" style={{fontFamily:'Syne,sans-serif'}}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{color:'var(--muted)'}}>{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Powered by badge */}
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.9}}
            className="flex items-center justify-center gap-2 text-xs"
            style={{color:'var(--muted)'}}>
            <span>Powered by</span>
            <span className="px-2 py-0.5 rounded-full font-medium"
              style={{
                background:'rgba(124,92,252,.12)',
                border:'1px solid rgba(124,92,252,.25)',
                color:'#a78bfa',
              }}>
              Google Gemini AI
            </span>
            <span>&</span>
            <span className="px-2 py-0.5 rounded-full font-medium"
              style={{
                background:'rgba(54,184,245,.1)',
                border:'1px solid rgba(54,184,245,.2)',
                color:'#36b8f5',
              }}>
              Firebase
            </span>
          </motion.div>
        </div>
      )}

      {!loading && !result && <InputForm onSubmit={analyze} error={error} />}
      {loading && <LoadingAnalysis step={step} />}
      {result && !loading && <ResultCard result={result} onReset={reset} />}
    </div>
  );
}