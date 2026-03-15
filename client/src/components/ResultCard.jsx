import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Share2, CheckCircle, ShieldAlert, Check } from 'lucide-react';
import TrustScoreGauge from './TrustScoreGauge';
import FlagCard from './FlagCard';
import VerdictBanner from './VerdictBanner';

const RING = { SAFE:'glow-safe', SUSPICIOUS:'glow-warn', LIKELY_FAKE:'glow-danger' };
const safeStr = v => !v ? '' : typeof v==='string' ? v : JSON.stringify(v);

export default function ResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(result.shareUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const flags = [...(result.flags||[])].sort(
    (a,b) => ({high:0,medium:1,low:2}[a.severity] - {high:0,medium:1,low:2}[b.severity])
  );
  const highCount = flags.filter(f=>f.severity==='high').length;
  const medCount  = flags.filter(f=>f.severity==='medium').length;
  const lowCount  = flags.filter(f=>f.severity==='low').length;

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:.5 }}
      style={{ display:'flex', flexDirection:'column', gap:'1rem' }}
    >
      {/* Main card */}
      <div
        className={`glass-card-solid ${RING[result.verdict]||''}`}
        style={{ borderRadius:24, overflow:'hidden' }}
      >
        {/* Top line */}
        <div style={{
          height:1, width:'100%',
          background: result.verdict==='SAFE'
            ? 'linear-gradient(90deg,transparent,rgba(16,185,129,.7),transparent)'
            : result.verdict==='SUSPICIOUS'
            ? 'linear-gradient(90deg,transparent,rgba(245,158,11,.7),transparent)'
            : 'linear-gradient(90deg,transparent,rgba(239,68,68,.7),transparent)'
        }} />

        <div style={{ padding:'clamp(1.25rem, 4vw, 2rem)' }}>
          {/* Responsive layout: stack on mobile, row on desktop */}
          <div className="result-flex">
            <TrustScoreGauge score={result.trustScore} verdict={result.verdict} />

            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'0.875rem', width:'100%', minWidth:0 }}>
              {/* Title */}
              <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:.2 }}>
                <h2 style={{
                  fontSize:'clamp(1.1rem, 3vw, 1.4rem)', fontWeight:700,
                  lineHeight:1.3, color:'var(--text-primary)',
                  wordBreak:'break-word',
                }}>
                  {safeStr(result.jobTitle) || 'Job Posting Analysis'}
                </h2>
                {result.companyName && result.companyName!=='Unknown' && (
                  <p style={{ fontSize:13, marginTop:3, color:'var(--text-secondary)' }}>
                    {safeStr(result.companyName)}
                  </p>
                )}
              </motion.div>

              {/* Verdict banner */}
              <VerdictBanner verdict={result.verdict} />

              {/* Summary */}
              <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}
                style={{ fontSize:13, lineHeight:1.6, color:'var(--text-secondary)', wordBreak:'break-word' }}>
                {safeStr(result.summary)}
              </motion.p>

              {/* Severity pills */}
              {flags.length > 0 && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.35 }}
                  style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {highCount>0 && <Pill bg="rgba(239,68,68,.1)" color="#f87171" border="rgba(239,68,68,.25)" label={`🔴 ${highCount} High Risk`} />}
                  {medCount>0  && <Pill bg="rgba(245,158,11,.1)" color="#fbbf24" border="rgba(245,158,11,.25)" label={`🟡 ${medCount} Medium`} />}
                  {lowCount>0  && <Pill bg="rgba(56,189,248,.08)" color="#7dd3fc" border="rgba(56,189,248,.22)" label={`🔵 ${lowCount} Low Risk`} />}
                </motion.div>
              )}

              {/* Domain check */}
              {result.domainCheck?.checked && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.4 }}
                  style={{
                    display:'inline-flex', alignItems:'center', gap:6,
                    padding:'5px 12px', borderRadius:999, fontSize:12,
                    background: result.domainCheck.exists?'rgba(16,185,129,.08)':'rgba(239,68,68,.08)',
                    border: result.domainCheck.exists?'1px solid rgba(16,185,129,.22)':'1px solid rgba(239,68,68,.22)',
                    color: result.domainCheck.exists?'#34d399':'#f87171',
                    flexWrap:'wrap', maxWidth:'100%',
                  }}>
                  {result.domainCheck.exists ? '✅' : '❌'}
                  <span style={{ wordBreak:'break-word' }}>
                    {result.domainCheck.exists
                      ? `Website found (${result.domainCheck.domainGuess})`
                      : `No website found for "${safeStr(result.companyName)}"`}
                  </span>
                </motion.div>
              )}

              {/* Advice */}
              {result.adviceForApplicant && (
                <motion.div initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} transition={{ delay:.45 }}
                  style={{ borderRadius:14, padding:'12px 14px', background:'rgba(124,58,237,.08)', border:'1px solid rgba(124,58,237,.2)' }}>
                    <p style={{ fontSize:13, lineHeight:1.6, color:'var(--text-secondary)', wordBreak:'break-word' }}>
                    💡 <strong style={{ color:'var(--accent)' }}>Advice: </strong>
                    {safeStr(result.adviceForApplicant)}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Red flags */}
      {flags.length > 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}
          style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'0 2px' }}>
            <ShieldAlert size={13} style={{ color:'var(--danger)', flexShrink:0 }} />
            <span style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)' }}>
              Red Flags Detected ({flags.length})
            </span>
          </div>
          {flags.map((f,i) => <FlagCard key={i} flag={f} index={i} />)}
        </motion.div>
      )}

      {/* Positive signals */}
      {result.positiveSignals?.length > 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.5 }}
          className="glass-card"
          style={{ borderRadius:18, padding:'1rem', display:'flex', flexDirection:'column', gap:'0.625rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <CheckCircle size={13} style={{ color:'var(--safe)', flexShrink:0 }} />
            <span style={{ fontSize:13, fontWeight:600, color:'#34d399' }}>Legitimate Signals</span>
          </div>
          <ul style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {result.positiveSignals.map((sig,i) => (
              <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:13, color:'var(--text-secondary)' }}>
                <span style={{ color:'var(--safe)', flexShrink:0, marginTop:1 }}>✓</span>
                <span style={{ wordBreak:'break-word' }}>{safeStr(sig)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.6 }}
        style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
        <motion.button whileHover={{ scale:1.03,y:-1 }} whileTap={{ scale:.97 }}
          onClick={onReset} className="btn-glass">
          <RotateCcw size={13} /> Check Another
        </motion.button>
        <motion.button whileHover={{ scale:1.03,y:-1 }} whileTap={{ scale:.97 }}
          onClick={copy} className="btn-glass"
          style={{
            background: copied?'rgba(16,185,129,.1)':'rgba(124,58,237,.1)',
            borderColor: copied?'rgba(16,185,129,.3)':'rgba(124,58,237,.3)',
            color: copied?'#34d399':'#a78bfa',
          }}>
          {copied ? <Check size={13} /> : <Share2 size={13} />}
          {copied ? 'Copied!' : 'Share Result'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function Pill({ bg, color, border, label }) {
  return (
    <span style={{ padding:'3px 10px', borderRadius:999, fontSize:12, fontWeight:500, background:bg, color, border:`1px solid ${border}` }}>
      {label}
    </span>
  );
}