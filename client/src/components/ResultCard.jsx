import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Share2, CheckCircle, ShieldAlert } from 'lucide-react';
import TrustScoreGauge from './TrustScoreGauge';
import FlagCard from './FlagCard';

const RING = { SAFE: 'ring-safe', SUSPICIOUS: 'ring-warn', LIKELY_FAKE: 'ring-danger' };

const safeStr = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
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
    <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5 }} className="space-y-4">

      {/* ── main card ── */}
      <div className={`glass-hi rounded-3xl p-6 md:p-8 ${RING[result.verdict] || ''}`}>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <TrustScoreGauge score={result.trustScore} verdict={result.verdict} />

          <div className="flex-1 space-y-4 w-full">
            <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:.2 }}>
              <h2 className="text-2xl font-bold leading-tight"
                style={{ fontFamily:'Syne,sans-serif' }}>
                {safeStr(result.jobTitle) || 'Job Posting Analysis'}
              </h2>
              {result.companyName && result.companyName !== 'Unknown' && (
                <p className="mt-1 text-sm" style={{ color:'var(--muted)' }}>
                  {safeStr(result.companyName)}
                </p>
              )}
            </motion.div>

            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}
              className="text-sm leading-relaxed" style={{ color:'rgba(237,233,255,.72)' }}>
              {safeStr(result.summary)}
            </motion.p>

            {/* severity summary bar */}
            {flags.length > 0 && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.35 }}
                className="flex flex-wrap gap-2">
                {highCount > 0 && (
                  <span className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background:'rgba(239,68,68,.12)', color:'#f87171', border:'1px solid rgba(239,68,68,.25)' }}>
                    🔴 {highCount} High Risk
                  </span>
                )}
                {medCount > 0 && (
                  <span className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background:'rgba(245,158,11,.12)', color:'#fbbf24', border:'1px solid rgba(245,158,11,.25)' }}>
                    🟡 {medCount} Medium
                  </span>
                )}
                {lowCount > 0 && (
                  <span className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background:'rgba(34,211,238,.1)', color:'#67e8f9', border:'1px solid rgba(34,211,238,.22)' }}>
                    🔵 {lowCount} Low Risk
                  </span>
                )}
              </motion.div>
            )}

            {/* domain check */}
            {result.domainCheck?.checked && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.4 }}
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: result.domainCheck.exists ? 'rgba(16,185,129,.1)':'rgba(239,68,68,.1)',
                  border: result.domainCheck.exists ? '1px solid rgba(16,185,129,.25)':'1px solid rgba(239,68,68,.25)',
                  color: result.domainCheck.exists ? '#34d399':'#f87171',
                }}>
                {result.domainCheck.exists ? '✅' : '❌'}
                {result.domainCheck.exists
                  ? `Website found (${result.domainCheck.domainGuess})`
                  : `No website found for "${safeStr(result.companyName)}"`}
              </motion.div>
            )}

            {/* advice */}
            {result.adviceForApplicant && (
              <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:.45 }}
                className="rounded-2xl p-4"
                style={{ background:'rgba(139,92,246,.08)', border:'1px solid rgba(139,92,246,.2)' }}>
                <p className="text-sm leading-relaxed" style={{ color:'rgba(237,233,255,.82)' }}>
                  💡 <strong style={{ color:'#a78bfa' }}>Advice: </strong>
                  {safeStr(result.adviceForApplicant)}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── red flags ── */}
      {flags.length > 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}
          className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <ShieldAlert size={14} style={{ color:'var(--danger)' }} />
            <h3 className="text-sm font-semibold"
              style={{ color:'var(--muted)', fontFamily:'Syne,sans-serif' }}>
              Red Flags Detected ({flags.length})
            </h3>
          </div>
          {flags.map((f, i) => <FlagCard key={i} flag={f} index={i} />)}
        </motion.div>
      )}

      {/* ── positive signals ── */}
      {result.positiveSignals?.length > 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.5 }}
          className="rounded-2xl p-5 space-y-3"
          style={{ background:'rgba(16,185,129,.05)', border:'1px solid rgba(16,185,129,.15)' }}>
          <div className="flex items-center gap-2">
            <CheckCircle size={14} style={{ color:'var(--safe)' }} />
            <h3 className="text-sm font-semibold"
              style={{ color:'#34d399', fontFamily:'Syne,sans-serif' }}>
              Legitimate Signals
            </h3>
          </div>
          <ul className="space-y-1.5">
            {result.positiveSignals.map((sig, i) => (
              <li key={i} className="flex items-start gap-2 text-sm"
                style={{ color:'var(--muted)' }}>
                <span style={{ color:'var(--safe)' }} className="mt-0.5 shrink-0">✓</span>
                {safeStr(sig)}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ── actions ── */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.6 }}
        className="flex flex-wrap gap-3 pt-1">
        <motion.button whileHover={{ scale:1.03,y:-1 }} whileTap={{ scale:.97 }}
          onClick={onReset} className="gbtn">
          <RotateCcw size={13} /> Check Another
        </motion.button>

        <motion.button whileHover={{ scale:1.03,y:-1 }} whileTap={{ scale:.97 }}
          onClick={copy} className="gbtn"
          style={{
            background: copied ? 'rgba(16,185,129,.12)':'rgba(139,92,246,.12)',
            borderColor: copied ? 'rgba(16,185,129,.3)':'rgba(139,92,246,.3)',
            color: copied ? '#34d399':'#a78bfa',
          }}>
          <Share2 size={13} />
          {copied ? 'Link Copied!' : 'Share Result'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}