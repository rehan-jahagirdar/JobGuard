import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Loader } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Extracting job details',       duration: 1200 },
  { id: 2, label: 'Checking company legitimacy',   duration: 1500 },
  { id: 3, label: 'Detecting scam patterns',       duration: 1800 },
  { id: 4, label: 'Cross-referencing database',    duration: 1400 },
  { id: 5, label: 'Calculating trust score',       duration: 1000 },
];

export default function LoadingAnalysis({ step: outerStep }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let totalDelay = 0;
    STEPS.forEach((s, i) => {
      setTimeout(() => {
        setCurrentStep(i);
      }, totalDelay);
      totalDelay += s.duration * 0.6;
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
      }, totalDelay);
      totalDelay += s.duration * 0.4;
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '3rem 1rem', gap: '2rem',
      }}
    >
      {/* Brain emoji with rings */}
      <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[120, 90, 62].map((size, i) => (
          <motion.div key={i}
            style={{
              position: 'absolute', borderRadius: '50%',
              width: size, height: size,
              border: `1px solid rgba(124,58,237,${.6 / (i + 1)})`,
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [1, .2, 1] }}
            transition={{ duration: 2.4, delay: i * .3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <motion.span
          style={{ fontSize: 38, position: 'relative', zIndex: 1 }}
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          🧠
        </motion.span>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: 700, color: 'var(--text-primary)' }}>
          Analyzing Job Posting...
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          AI is processing with Groq
        </p>
      </div>

      {/* Step-by-step progress */}
      <div
        className="glass-card"
        style={{ borderRadius: 18, padding: '1.25rem', width: '100%', maxWidth: 380 }}
      >
        {STEPS.map((s, i) => {
          const isDone = completedSteps.includes(i);
          const isActive = currentStep === i && !isDone;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
                borderBottom: i < STEPS.length - 1 ? '1px solid var(--glass-border)' : 'none',
              }}
            >
              {isDone ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                </motion.div>
              ) : isActive ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader size={16} style={{ color: '#a78bfa', flexShrink: 0 }} />
                </motion.div>
              ) : (
                <Circle size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              )}
              <span style={{
                fontSize: 13,
                color: isDone ? 'var(--text-primary)' : isActive ? '#a78bfa' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 400,
                transition: 'color .3s',
              }}>
                {s.label}
              </span>
              {isDone && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ marginLeft: 'auto', fontSize: 11, color: '#10b981', fontWeight: 600 }}
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2, 3].map(i => (
          <motion.div key={i}
            style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(124,58,237,.6)' }}
            animate={{ opacity: [.2, 1, .2], scale: [.7, 1.3, .7] }}
            transition={{ duration: 1.4, delay: i * .2, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}