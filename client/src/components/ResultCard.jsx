import TrustScoreGauge from './TrustScoreGauge';
import FlagCard from './FlagCard';
import { RotateCcw, Share2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  const copyShareLink = () => {
    navigator.clipboard.writeText(result.shareUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sortedFlags = [...(result.flags || [])].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <TrustScoreGauge score={result.trustScore} verdict={result.verdict} />
          
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-xl font-bold">{result.jobTitle || 'Job Posting Analysis'}</h2>
              {result.companyName && result.companyName !== 'Unknown' && (
                <p className="text-gray-400">{result.companyName}</p>
              )}
            </div>
            
            <p className="text-gray-300 leading-relaxed">{result.summary}</p>

            {/* Domain check indicator */}
            {result.domainCheck?.checked && (
              <div className={`text-xs flex items-center gap-2 ${
                result.domainCheck.exists ? 'text-green-400' : 'text-red-400'
              }`}>
                {result.domainCheck.exists ? '✅' : '❌'}
                Company website {result.domainCheck.exists ? 'found' : 'not found'}
                {result.domainCheck.domainGuess && ` (${result.domainCheck.domainGuess})`}
              </div>
            )}

            {/* Advice box */}
            {result.adviceForApplicant && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Advice: </strong>{result.adviceForApplicant}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flags */}
      {sortedFlags.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-300 flex items-center gap-2">
            🚩 Red Flags Found ({sortedFlags.length})
          </h3>
          {sortedFlags.map((flag, i) => (
            <FlagCard key={i} flag={flag} />
          ))}
        </div>
      )}

      {/* Positive signals */}
      {result.positiveSignals?.length > 0 && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 space-y-2">
          <h3 className="font-semibold text-green-400 flex items-center gap-2">
            <CheckCircle size={16} /> Legitimate Signals
          </h3>
          <ul className="space-y-1">
            {result.positiveSignals.map((signal, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                {signal}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 
                     rounded-xl text-sm font-medium transition-colors"
        >
          <RotateCcw size={16} /> Check Another
        </button>
        <button
          onClick={copyShareLink}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 
                     rounded-xl text-sm font-medium transition-colors"
        >
          <Share2 size={16} />
          {copied ? 'Copied!' : 'Share Result'}
        </button>
      </div>
    </div>
  );
}