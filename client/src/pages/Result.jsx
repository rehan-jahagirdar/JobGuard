import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ResultCard from '../components/ResultCard';
import { getSharedResult } from '../services/api';

export default function Result() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shareId) return;
    getSharedResult(shareId)
      .then(setResult)
      .catch(() => setError('Result not found or expired.'))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) return (
    <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-t-transparent mx-auto"
          style={{ borderColor: 'rgba(124,58,237,.4)', borderTopColor: '#7c3aed', animation: 'spin 1s linear infinite' }} />
        <p style={{ color:'var(--text-secondary)' }}>Loading result...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="relative z-10 max-w-xl mx-auto px-4 py-20 text-center space-y-4">
      <p className="text-5xl">😕</p>
      <p style={{ color:'var(--text-secondary)' }}>{error}</p>
      <button onClick={() => navigate('/')} className="btn-glass mx-auto">
        <ArrowLeft size={14} /> Go Home
      </button>
    </div>
  );

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 space-y-6">
      <motion.button
        initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
        onClick={() => navigate('/')} className="btn-glass">
        <ArrowLeft size={14} /> Check Another
      </motion.button>
      {result && <ResultCard result={result} onReset={() => navigate('/')} />}
    </div>
  );
}