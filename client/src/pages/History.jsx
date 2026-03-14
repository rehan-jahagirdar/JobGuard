import { motion } from 'framer-motion';
import { Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HistoryItem from '../components/HistoryItem';

export default function History() {
  const navigate = useNavigate();
  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 space-y-6">
      <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }}
        className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="btn-glass">
          <ArrowLeft size={14} />
        </button>
        <div className="flex items-center gap-2">
          <Clock size={16} style={{ color:'var(--text-secondary)' }} />
          <h1 className="text-lg font-bold">Check History</h1>
        </div>
      </motion.div>

      <div className="glass-card rounded-2xl p-6 text-center space-y-3">
        <p className="text-3xl">📋</p>
        <p className="font-medium" style={{ color:'var(--text-primary)' }}>No history yet</p>
        <p className="text-sm" style={{ color:'var(--text-secondary)' }}>
          Sign in to save your job posting checks
        </p>
        <button onClick={() => navigate('/')} className="btn-glass mx-auto">
          Check a Job Posting
        </button>
      </div>
    </div>
  );
}