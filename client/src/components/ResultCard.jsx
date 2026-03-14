import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Share2, CheckCircle, ShieldAlert } from 'lucide-react';
import TrustScoreGauge from './TrustScoreGauge';
import FlagCard from './FlagCard';

const GLOW = { SAFE:'glow-safe', SUSPICIOUS:'glow-warn', LIKELY_FAKE:'glow-danger' };

export default function ResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(result.shareUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const flags = [...(result.flags||[])].sort((a,b) =>
    ({high:0,medium:1,low:2}[a.severity]) - ({high:0,medium:1,low:2}[b.severity])
  );

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
      transition={{duration:.5}} className="space-y-4">

      {/* Main card */}
      <div className={`glass-hi rounded-3xl p-6 md:p-8 ${GLOW[result.verdict]}`}>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <TrustScoreGauge score={result.trustScore} verdict={result.verdict} />

          <div className="flex-1 space-y-4 w-full">
            <div>
              <motion.h2 initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                transition={{delay:.2}}
                className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif'}}>
                {result.jobTitle || 'Job Posting Analysis'}
              </motion.h2>
              {result.companyName && result.companyName!=='Unknown' && (
                <p className="mt-1 text-sm" style={{color:'var(--muted)'}}>
                  {result.companyName}
                </p>
              )}
            </div>

            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}
              className="text-sm leading-relaxed" style={{color:'rgba(240,238,255,0.7)'}}>
              {result.summary}
            </motion.p>

            {/* Domain check */}
            {result.domainCheck?.checked && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.35}}
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: result.domainCheck.exists ? 'rgba(35,209,139,.1)':'rgba(245,86,74,.1)',
                  border: result.domainCheck.exists ? '1px solid rgba(35,209,139,.25)':'1px solid rgba(245,86,74,.25)',
                  color: result.domainCheck.exists ? '#23d18b':'#f5564a',
                }}>
                {result.domainCheck.exists ? '✅' : '❌'}
                {result.domainCheck.exists
                  ? `Website found (${result.domainCheck.domainGuess})`
                  : `No website found for "${result.companyName}"`}
              </motion.div>
            )}

            {/* Advice */}
            {result.adviceForApplicant && (
              <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:.4}}
                className="rounded-2xl p-4"
                style={{ background:'rgba(124,92,252,.08)', border:'1px solid rgba(124,92,252,.2)' }}>
                <p className="text-sm leading-relaxed" style={{color:'rgba(240,238,255,.82)'}}>
                  💡 <strong style={{color:'#a78bfa'}}>Advice: </strong>
                  {result.adviceForApplicant}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Flags */}
      {flags.length > 0 && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}
          className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <ShieldAlert size={15} style={{color:'var(--danger)'}} />
            <h3 className="text-sm font-semibold" style={{color:'var(--muted)',fontFamily:'Syne,sans-serif'}}>
              Red Flags Detected ({flags.length})
            </h3>
          </div>
          {flags.map((f,i) => <FlagCard key={i} flag={f} index={i} />)}
        </motion.div>
      )}

      {/* Positive signals */}
      {result.positiveSignals?.length > 0 && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}}
          className="rounded-2xl p-5 space-y-3"
          style={{ background:'rgba(35,209,139,.05)', border:'1px solid rgba(35,209,139,.15)' }}>
          <div className="flex items-center gap-2">
            <CheckCircle size={15} style={{color:'var(--safe)'}} />
            <h3 className="text-sm font-semibold" style={{color:'#23d18b',fontFamily:'Syne,sans-serif'}}>
              Legitimate Signals
            </h3>
          </div>
          <ul className="space-y-1.5">
            {result.positiveSignals.map((s,i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{color:'rgba(240,238,255,.6)'}}>
                <span style={{color:'var(--safe)'}} className="mt-0.5">✓</span>{s}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.6}}
        className="flex gap-3 pt-1">
        <motion.button whileHover={{scale:1.03}} whileTap={{scale:.97}}
          onClick={onReset} className="btn-glass">
          <RotateCcw size={14} /> Check Another
        </motion.button>
        <motion.button whileHover={{scale:1.03}} whileTap={{scale:.97}}
          onClick={copy}
          className="btn-glass"
          style={{
            background: copied ? 'rgba(35,209,139,.12)':'rgba(124,92,252,.12)',
            borderColor: copied ? 'rgba(35,209,139,.3)':'rgba(124,92,252,.3)',
            color: copied ? '#23d18b':'#a78bfa',
          }}>
          <Share2 size={14} />
          {copied ? 'Copied!' : 'Share Result'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}