import { useState } from 'react';
import { analyzePosting } from '../services/api';

export function useAnalyze() {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [step, setStep]       = useState('idle');

  // 1. Add userId to the destructured parameters
  const analyze = async ({ type, content, userId }) => {
    setLoading(true); setError(null); setResult(null);
    try {
      if (type === 'url') { setStep('fetching'); await new Promise(r => setTimeout(r, 700)); }
      setStep('analyzing');
      
      // 2. Pass userId down to your API service
      const data = await analyzePosting({ type, content, userId });
      
      setResult(data); setStep('done');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Analysis failed. Please try again.');
      setStep('idle');
    } finally { setLoading(false); }
  };

  const reset = () => { setResult(null); setError(null); setStep('idle'); };
  return { result, loading, error, step, analyze, reset };
}