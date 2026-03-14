import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Share2, CheckCircle, ShieldAlert, Copy, Check } from 'lucide-react';
import TrustScoreGauge from './TrustScoreGauge';
import FlagCard from './FlagCard';
import VerdictBanner from './VerdictBanner';

const RING = { SAFE: 'glow-safe', SUSPICIOUS: 'glow-warn', LIKELY_FAKE: 'glow-danger' };

const safeStr = v => {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return JSON.stringify(v);
};

export default function ResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(result.shareUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const flags = [...(result.flags || [])].sort(
    (a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity])
  );

  const highCount = flags.filter(f => f.severity === 'high').length;
  const medCount  = flags.filter(f => f.severity === 'medium').length;
  const lowCount  = flags.filter(f => f.severity === 'low').length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5 }} className="space-y-5">

      {/* Main result card */}
      <div className={`glass-card-solid rounded-3xl overflow-hidden ${RING[result.verdict] || ''}`}>
        {/* Top gradient line */}
        <div className="h-px w-full" style={{
          background: result.verdict === 'SAFE'
            ? 'linear-gradient(90deg, transparent, rgba(16,185,129,.7), transparent)'
            : result.verdict === 'SUSPICIOUS'
            ? 'linear-gradient(90deg, transparent, rgba(245,158,11,.7), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(239,68,68,.7), transparent)'
        }} />

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <TrustScoreGauge score={result.trustScore} verdict={result.verdict} />

            <div className="flex-1 space-y-4 w-full">
              <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:.2 }}>
                <h2 className="text-2xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {safeStr(result.jobTitle) || 'Job Posting Analysis'}
                </h2>
                {result.companyName && result.companyName !== 'Unknown' && (
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {safeStr(result.companyName)}
                  </p>
                )}
              </motion.div>

              {/* Verdict banner */}
              <VerdictBanner verdict={result.verdict} />

              {/* Summary */}
              <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}
                className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {safeStr(result.summary)}
              </motion.p>

              {/* Severity counts */}
              {flags.length > 0 && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.35 }}
                  className="flex flex-wrap gap-2">
                  {highCount > 0 && (
                    <span className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background:'rgba(239,68,68,.1)', color:'#f87171', border:'1px solid rgba(239,68,68,.25)' }}>
                      🔴 {highCount} High Risk
                    </span>
                  )}
                  {medCount > 0 && (
                    <span className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background:'rgba(245,158,11,.1)', color:'#fbbf24', border:'1px solid rgba(245,158,11,.25)' }}>
                      🟡 {medCount} Medium
                    </span>
                  )}
                  {lowCount > 0 && (
                    <span className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background:'rgba(56,189,248,.08)', color:'#7dd3fc', border:'1px solid rgba(56,189,248,.22)' }}>
                      🔵 {lowCount} Low Risk
                    </span>
                  )}
                </motion.div>
              )}

              {/* Domain check */}
              {result.domainCheck?.checked && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.4 }}
                  className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
                  style={{
                    background: result.domainCheck.exists ? 'rgba(16,185,129,.08)':'rgba(239,68,68,.08)',
                    border: result.domainCheck.exists ? '1px solid rgba(16,185,129,.22)':'1px solid rgba(239,68,68,.22)',
                    color: result.domainCheck.exists ? '#34d399':'#f87171',
                  }}>
                  {result.domainCheck.exists ? '✅' : '❌'}
                  {result.domainCheck.exists
                    ? `Website found (${result.domainCheck.domainGuess})`
                    : `No website found for "${safeStr(result.companyName)}"`}
                </motion.div>
              )}

              {/* Advice */}
              {result.adviceForApplicant && (
                <motion.div initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} transition={{ delay:.45 }}
                  className="rounded-2xl p-4"
                  style={{ background:'rgba(124,58,237,.08)', border:'1px solid rgba(124,58,237,.2)' }}>
                  <p className="text-sm leading-relaxed" style={{ color:'rgba(237,233,255,.82)' }}>
                    💡 <strong style={{ color:'#a78bfa' }}>Advice: </strong>
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
          className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <ShieldAlert size={14} style={{ color:'var(--danger)' }} />
            <h3 className="text-sm font-semibold" style={{ color:'var(--text-secondary)' }}>
              Red Flags Detected ({flags.length})
            </h3>
          </div>
          {flags.map((f, i) => <FlagCard key={i} flag={f} index={i} />)}
        </motion.div>
      )}

      {/* Positive signals */}
      {result.positiveSignals?.length > 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.5 }}
          className="glass-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} style={{ color:'var(--safe)' }} />
            <h3 className="text-sm font-semibold" style={{ color:'#34d399' }}>
              Legitimate Signals
            </h3>
          </div>
          <ul className="space-y-2">
            {result.positiveSignals.map((sig, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color:'var(--text-secondary)' }}>
                <span style={{ color:'var(--safe)' }} className="mt-0.5 shrink-0">✓</span>
                {safeStr(sig)}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.6 }}
        className="flex flex-wrap gap-3">
        <motion.button whileHover={{ scale:1.03, y:-1 }} whileTap={{ scale:.97 }}
          onClick={onReset} className="btn-glass">
          <RotateCcw size={13} /> Check Another
        </motion.button>
        <motion.button whileHover={{ scale:1.03, y:-1 }} whileTap={{ scale:.97 }}
          onClick={copy} className="btn-glass"
          style={{
            background: copied ? 'rgba(16,185,129,.1)' : 'rgba(124,58,237,.1)',
            borderColor: copied ? 'rgba(16,185,129,.3)' : 'rgba(124,58,237,.3)',
            color: copied ? '#34d399' : '#a78bfa',
          }}>
          {copied ? <Check size={13} /> : <Share2 size={13} />}
          {copied ? 'Link Copied!' : 'Share Result'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}