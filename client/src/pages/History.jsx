// client/src/pages/Home.jsx
import { motion } from 'framer-motion';
import { Shield, Eye, Building2, Users, Globe, AlertTriangle } from 'lucide-react';
import BlurText from '../components/BlurText';
import InputForm from '../components/InputForm';
import LoadingAnalysis from '../components/LoadingAnalysis';
import ResultCard from '../components/ResultCard';
import { useAnalyze } from '../hooks/useAnalyze';

const STATS = [
  { value:'20,000+', label:'Fraud cases since 2024', icon:'📊' },
  { value:'₹crores', label:'Lost to fake jobs',      icon:'💸' },
  { value:'10 sec',  label:'To detect a scam',       icon:'⚡' },
];

const FEATURES = [
  { icon:Shield,    color:'#7c3aed', bg:'rgba(124,58,237,.1)',  border:'rgba(124,58,237,.2)',  title:'Trust Score',   desc:'AI scores trust 0–100 using dozens of scam indicators.' },
  { icon:Eye,       color:'#06b6d4', bg:'rgba(6,182,212,.08)',  border:'rgba(6,182,212,.18)',  title:'Red Flags',     desc:'Highlights fee requests, vague roles, and fake contacts.' },
  { icon:Building2, color:'#10b981', bg:'rgba(16,185,129,.08)', border:'rgba(16,185,129,.18)', title:'Company Check', desc:'Verifies if the company has a legitimate online presence.' },
];

const SCAM_PATTERNS = [
  { pattern:'Upfront registration fee',    count:2847, risk:'HIGH'   },
  { pattern:'WhatsApp-only contact',       count:1923, risk:'HIGH'   },
  { pattern:'Unrealistic daily earnings',  count:1654, risk:'HIGH'   },
  { pattern:'Aadhaar/PAN upfront request', count:1231, risk:'HIGH'   },
  { pattern:'No company name provided',    count: 987, risk:'MEDIUM' },
  { pattern:'Gmail contact for corporate', count: 743, risk:'MEDIUM' },
];

const COMPANY_CHECKS = [
  { icon:'🌐', label:'Official website presence', check:true  },
  { icon:'💼', label:'LinkedIn company profile',  check:false },
  { icon:'📧', label:'Domain email verification', check:false },
  { icon:'📅', label:'Domain age > 1 year',       check:false },
  { icon:'🔍', label:'Google search presence',    check:true  },
];

export default function Home() {
  const { result, loading, error, step, analyze, reset } = useAnalyze();
  const showHero = !result && !loading;

  return (
    <div className="page-wrapper">

      {/* Hero + Input */}
      {showHero && (
        <div className="desktop-layout">
          <div className="hero-section desktop-hero">
            <motion.div
              initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:999, background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)', color:'#fca5a5', fontSize:12, fontWeight:600 }}
            >
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#f87171', flexShrink:0, boxShadow:'0 0 6px rgba(239,68,68,.8)' }} />
              20,000+ students scammed by fake jobs since 2024
            </motion.div>

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
              className="hero-subtitle" style={{ color:'var(--text-secondary)' }}
            >
              Paste any job URL, description, or screenshot. Gemini AI analyzes it instantly
              and reveals exactly why it might be a scam — specific red flags, not vague warnings.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.82 }}
              className="stats-row"
            >
              {STATS.map((s,i) => (
                <motion.div key={i} style={{ textAlign:'inherit' }}
                  whileHover={{ scale:1.05, y:-2 }} transition={{ type:'spring', stiffness:300 }}>
                  <p style={{ fontSize:'clamp(1.2rem,3vw,1.6rem)', fontWeight:900, color:'var(--text-primary)' }}>
                    {s.icon} {s.value}
                  </p>
                  <p style={{ fontSize:11, marginTop:3, color:'var(--text-muted)' }}>{s.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.96 }}
              style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:6, fontSize:12, color:'var(--text-muted)' }}
            >
              Powered by
              {[
                { label:'Google Gemini AI', c:'rgba(124,58,237,.22)', tc:'#a78bfa', bc:'rgba(124,58,237,.1)' },
                { label:'Firebase',         c:'rgba(6,182,212,.18)',  tc:'#67e8f9', bc:'rgba(6,182,212,.08)' },
              ].map((b,i) => (
                <span key={i} style={{ padding:'3px 10px', borderRadius:999, fontWeight:600, background:b.bc, border:`1px solid ${b.c}`, color:b.tc, fontSize:11 }}>
                  {b.label}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="desktop-input">
            <InputForm onSubmit={analyze} error={error} />
          </div>
        </div>
      )}

      {loading && <LoadingAnalysis step={step} />}
      {result && !loading && <ResultCard result={result} onReset={reset} />}

      {/* Feature cards */}
      {showHero && (
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.0 }}
          className="features-grid"
        >
          {FEATURES.map((f,i) => (
            <motion.div key={i}
              whileHover={{ scale:1.02, y:-4 }}
              transition={{ type:'spring', stiffness:280, damping:20 }}
              className="glass-card"
              style={{ borderRadius:20, padding:'1.4rem', display:'flex', flexDirection:'column', gap:12 }}
            >
              <div style={{ width:42, height:42, borderRadius:12, background:f.bg, border:`1px solid ${f.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <f.icon size={19} style={{ color:f.color }} />
              </div>
              <div>
                <p style={{ fontWeight:700, fontSize:14, marginBottom:5, color:'var(--text-primary)' }}>{f.title}</p>
                <p style={{ fontSize:13, lineHeight:1.6, color:'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Scam Pattern Network */}
      {showHero && (
        <motion.section initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.1 }}>
          <SectionHead icon={Users} color="#f87171" bg="rgba(239,68,68,.1)" border="rgba(239,68,68,.2)"
            title="Scam Pattern Detection Network"
            subtitle="Community intelligence — patterns from previously reported scam postings" />

          <motion.div className="glass-card"
            style={{ borderRadius:16, padding:'1rem 1.25rem', margin:'1rem 0', borderColor:'rgba(239,68,68,.25)', background:'rgba(239,68,68,.05)' }}
            whileHover={{ scale:1.003 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <AlertTriangle size={14} style={{ color:'#f87171', flexShrink:0 }} />
              <span style={{ fontSize:13, fontWeight:700, color:'#f87171' }}>Pattern Match Example</span>
            </div>
            <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.5 }}>
              ⚠ This job pattern matches <strong style={{ color:'var(--text-primary)' }}>37 previously reported</strong> scam postings
            </p>
            <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:12, color:'var(--text-muted)' }}>Confidence:</span>
              <div style={{ flex:1, height:6, borderRadius:999, background:'var(--glass)', overflow:'hidden' }}>
                <motion.div initial={{ width:0 }} animate={{ width:'92%' }}
                  transition={{ duration:1.5, delay:1.2, ease:'easeOut' }}
                  style={{ height:'100%', borderRadius:999, background:'linear-gradient(90deg,#f59e0b,#ef4444)' }} />
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:'#f87171' }}>92%</span>
            </div>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'0.75rem' }}>
            {SCAM_PATTERNS.map((p,i) => (
              <motion.div key={i}
                initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:1.2+i*.07 }}
                className="glass-card"
                style={{ borderRadius:14, padding:'0.875rem 1rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                <span style={{ fontSize:13, color:'var(--text-primary)', wordBreak:'break-word' }}>{p.pattern}</span>
                <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>{p.count.toLocaleString()}</span>
                  <span style={{ fontSize:10, padding:'2px 7px', borderRadius:999, fontWeight:700,
                    background:p.risk==='HIGH'?'rgba(239,68,68,.12)':'rgba(245,158,11,.12)',
                    color:p.risk==='HIGH'?'#f87171':'#fbbf24',
                    border:p.risk==='HIGH'?'1px solid rgba(239,68,68,.25)':'1px solid rgba(245,158,11,.25)',
                  }}>{p.risk}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Company Legitimacy Scanner */}
      {showHero && (
        <motion.section initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.3 }}>
          <SectionHead icon={Globe} color="#67e8f9" bg="rgba(6,182,212,.1)" border="rgba(6,182,212,.2)"
            title="Company Legitimacy Scanner"
            subtitle="Automatically verifies company authenticity across multiple sources" />

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'0.875rem', marginTop:'1rem' }}>
            <div className="glass-card-solid" style={{ borderRadius:18, padding:'1.25rem' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>TechSolutions India</p>
                  <p style={{ fontSize:12, color:'var(--text-muted)' }}>Sample company check result</p>
                </div>
                <span style={{ fontSize:11, padding:'4px 10px', borderRadius:999, fontWeight:700, background:'rgba(245,158,11,.1)', color:'#fbbf24', border:'1px solid rgba(245,158,11,.25)' }}>Suspicious</span>
              </div>
              {COMPANY_CHECKS.map((c,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0', borderBottom:i<COMPANY_CHECKS.length-1?'1px solid var(--glass-border)':'none' }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>{c.icon}</span>
                  <span style={{ flex:1, fontSize:13, color:'var(--text-secondary)' }}>{c.label}</span>
                  <span style={{ fontSize:13, color:c.check?'#34d399':'#f87171', fontWeight:600 }}>{c.check?'✅':'❌'}</span>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {[
                { icon:'🌐', title:'Website Verification',  desc:'Checks if company has an active official domain' },
                { icon:'💼', title:'LinkedIn Presence',     desc:'Searches for verified company LinkedIn profile' },
                { icon:'📧', title:'Email Domain Check',    desc:'Verifies emails match official company domain' },
                { icon:'📅', title:'Domain Age Analysis',   desc:'New domains (< 6 months) are flagged suspicious' },
              ].map((item,i) => (
                <motion.div key={i}
                  initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:1.4+i*.08 }}
                  className="glass-card"
                  style={{ borderRadius:14, padding:'0.875rem 1rem', display:'flex', alignItems:'flex-start', gap:10 }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{item.title}</p>
                    <p style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2, lineHeight:1.5 }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}

function SectionHead({ icon: Icon, color, bg, border, title, subtitle }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1rem' }}>
      <div style={{ width:36, height:36, borderRadius:10, background:bg, border:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon size={17} style={{ color }} />
      </div>
      <div>
        <h2 style={{ fontSize:'clamp(1.05rem,2.5vw,1.3rem)', fontWeight:800, color:'var(--text-primary)' }}>{title}</h2>
        <p style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>{subtitle}</p>
      </div>
    </div>
  );
}