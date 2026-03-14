import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Share2, CheckCircle, ShieldAlert } from 'lucide-react';
import TrustScoreGauge from './TrustScoreGauge';
import FlagCard from './FlagCard';

const GLOW_CLASS = {
  SAFE:        'glow-border-safe',
  SUSPICIOUS:  'glow-border-suspicious',
  LIKELY_FAKE: 'glow-border-fake',
};

export default function ResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(result.shareUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const sortedFlags = [...(result.flags || [])].sort((a, b) => {
    return { high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity];
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* Main result card */}
      <div
        className={`glass rounded-3xl p-6 md:p-8 ${GLOW_CLASS[result.verdict]}`}
        style={{ background: 'rgba(10, 0, 30, 0.7)' }}
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <TrustScoreGauge score={result.trustScore} verdict={result.verdict} />

          <div className="flex-1 space-y-4 w-full">
            {/* Job info */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold"
              >
                {result.jobTitle || 'Job Posting Analysis'}
              </motion.h2>
              {result.companyName && result.companyName !== 'Unknown' && (
                <p className="mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {result.companyName}
                </p>
              )}
            </div>

            {/* Summary */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {result.summary}
            </motion.p>

            {/* Domain check */}
            {result.domainCheck?.checked && (
              <div
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: result.domainCheck.exists
                    ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  border: result.domainCheck.exists
                    ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(239,68,68,0.2)',
                  color: result.domainCheck.exists ? '#86efac' : '#fca5a5',
                }}
              >
                {result.domainCheck.exists ? '✅' : '❌'}
                {result.domainCheck.exists
                  ? `Company website found (${result.domainCheck.domainGuess})`
                  : `No website found for "${result.companyName}"`}
              </div>
            )}

            {/* Advice */}
            {result.adviceForApplicant && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(124, 58, 237, 0.08)',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  💡 <strong style={{ color: '#a78bfa' }}>Advice: </strong>
                  {result.adviceForApplicant}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Red flags */}
      {sortedFlags.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 px-1">
            <ShieldAlert size={16} style={{ color: '#ef4444' }} />
            <h3 className="font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Red Flags Detected ({sortedFlags.length})
            </h3>
          </div>
          {sortedFlags.map((flag, i) => (
            <FlagCard key={i} flag={flag} index={i} />
          ))}
        </motion.div>
      )}

      {/* Positive signals */}
      {result.positiveSignals?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-5 space-y-3"
          style={{
            background: 'rgba(34, 197, 94, 0.05)',
            border: '1px solid rgba(34, 197, 94, 0.15)',
          }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={16} style={{ color: '#22c55e' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#86efac' }}>
              Legitimate Signals
            </h3>
          </div>
          <ul className="space-y-2">
            {result.positiveSignals.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.6)' }}>
                <span style={{ color: '#22c55e' }} className="mt-0.5">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 pt-1"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          <RotateCcw size={15} /> Check Another
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={copyLink}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all"
          style={{
            background: copied
              ? 'rgba(34, 197, 94, 0.15)'
              : 'rgba(124, 58, 237, 0.15)',
            border: copied
              ? '1px solid rgba(34, 197, 94, 0.3)'
              : '1px solid rgba(124, 58, 237, 0.3)',
            color: copied ? '#86efac' : '#a78bfa',
          }}
        >
          <Share2 size={15} />
          {copied ? 'Link Copied!' : 'Share Result'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}