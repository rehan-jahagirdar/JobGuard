import { useState } from 'react';
import { analyzePosting } from '../services/api';

export function useAnalyze() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('idle'); // idle | fetching | analyzing | done

  const analyze = async ({ type, content }) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      setStep(type === 'url' ? 'fetching' : 'analyzing');
      
      // Small delay so user sees the fetching step
      if (type === 'url') {
        await new Promise(r => setTimeout(r, 800));
        setStep('analyzing');
      }

      const data = await analyzePosting({
        type,
        content,
        userId: localStorage.getItem('jobguard_uid') || 'anonymous'
      });

      setResult(data);
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Analysis failed. Please try again.');
      setStep('idle');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setStep('idle');
  };

  return { result, loading, error, step, analyze, reset };
}