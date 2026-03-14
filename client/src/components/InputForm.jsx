import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, FileText, AlertCircle, Zap, Info, X } from 'lucide-react';

const EXAMPLE_FAKE = `URGENT HIRING!! Work from home earn ₹50,000 per day!! No experience needed!! Flexible hours, immediate joining. Send ₹499 registration fee via Paytm to 9876543210. WhatsApp us NOW!! Send Aadhaar card copy immediately!! Only 5 seats left!!!`;

const EXAMPLE_REAL = `Software Engineer - Microsoft India
Location: Hyderabad, India | Salary: 20-25 LPA
Experience: 3+ years in React and Node.js

We are looking for a skilled Software Engineer to join our Azure team. You will build scalable web applications and collaborate with cross-functional teams.

Requirements: B.Tech/M.Tech in CS or related field, strong knowledge of JavaScript, TypeScript, React. 

Apply at: careers.microsoft.com
Contact: india-careers@microsoft.com
Benefits: Health insurance, stock options, flexible work`;

export default function InputForm({ onSubmit, error }) {
  const [tab, setTab]       = useState('text');
  const [url, setUrl]       = useState('');
  const [text, setText]     = useState('');
  const [focused, setFocus] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const content = tab === 'url' ? url.trim() : text.trim();
    if (!content) return;
    onSubmit({ type: tab, content });
  };

  const valid = tab === 'url'
    ? url.trim().startsWith('http')
    : text.trim().length > 50;

  const loadExample = (type) => {
    setTab('text');
    setText(type === 'fake' ? EXAMPLE_FAKE : EXAMPLE_REAL);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [.22,1,.36,1] }}
      className="glass-card-solid rounded-3xl overflow-hidden"
      style={{
        boxShadow: focused
          ? '0 0 0 1px rgba(124,58,237,.4), 0 0 80px rgba(124,58,237,.15), 0 32px 64px rgba(0,0,0,.6)'
          : '0 0 0 1px rgba(255,255,255,.06), 0 32px 64px rgba(0,0,0,.5)',
        transition: 'box-shadow .4s ease',
      }}
    >
      {/* Top gradient line */}
      <div className="h-px w-full" style={{
        background: 'linear-gradient(90deg, transparent, rgba(124,58,237,.6), rgba(6,182,212,.4), transparent)'
      }} />

      <div className="p-6 md:p-8 space-y-6">
        {/* Tab switcher */}
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,.04)' }}>
          {[
            { id: 'text', Icon: FileText, label: 'Paste Text' },
            { id: 'url',  Icon: Globe,    label: 'Paste URL'  },
          ].map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300"
              style={{ color: tab === id ? '#fff' : 'rgba(148,163,184,.7)' }}
            >
              {tab === id && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-xl tab-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={14} className="relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={submit} className="space-y-4">
          <AnimatePresence mode="wait">
            {tab === 'url' ? (
              <motion.div key="url"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }} transition={{ duration: .2 }}
                className="space-y-2"
              >
                <input
                  type="url" value={url}
                  onChange={e => setUrl(e.target.value)}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  placeholder="https://naukri.com/job-listings/..."
                  className="input-glass"
                  style={{ padding: '14px 18px' }}
                />
                <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs"
                  style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.18)', color: 'rgba(251,191,36,.85)' }}>
                  <Info size={12} className="mt-0.5 shrink-0" />
                  Works with <strong>Naukri, Internshala, Indeed</strong>. LinkedIn blocks scraping — use Paste Text instead.
                </div>
              </motion.div>
            ) : (
              <motion.div key="text"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: .2 }}
              >
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    placeholder="Paste the full job description here — title, company, salary, contact details, requirements, everything..."
                    rows={7}
                    className="input-glass"
                    style={{ padding: '16px 18px' }}
                  />
                  {text && (
                    <button type="button" onClick={() => setText('')}
                      className="absolute top-3 right-3 p-1 rounded-lg transition-colors"
                      style={{ color: 'rgba(148,163,184,.5)', background: 'rgba(255,255,255,.06)' }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="flex justify-between mt-2 px-0.5">
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Min. 50 characters needed</span>
                  <span className="tabular-nums" style={{ fontSize: 12, color: text.length > 5500 ? 'var(--danger)' : 'var(--text-muted)' }}>
                    {text.length}/6000
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: .97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-3 rounded-2xl p-4 text-sm"
                style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.22)', color: '#fca5a5' }}
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit" disabled={!valid}
            whileHover={valid ? { scale: 1.01, y: -2 } : {}}
            whileTap={valid ? { scale: .99 } : {}}
            className="w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 relative overflow-hidden"
            style={{
              background: valid
                ? 'linear-gradient(135deg, #7c3aed 0%, #2563eb 60%, #06b6d4 100%)'
                : 'rgba(255,255,255,.05)',
              color: valid ? '#fff' : 'rgba(148,163,184,.4)',
              cursor: valid ? 'pointer' : 'not-allowed',
              border: valid ? 'none' : '1px solid rgba(255,255,255,.08)',
              boxShadow: valid ? '0 0 0 1px rgba(124,58,237,.5), 0 4px 30px rgba(124,58,237,.4)' : 'none',
              transition: 'all .3s ease',
              letterSpacing: '.02em',
            }}
          >
            {valid && (
              <motion.div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
              />
            )}
            <Zap size={15} className="relative z-10" />
            <span className="relative z-10">Analyze Job Posting</span>
          </motion.button>
        </form>

        {/* Example buttons */}
        <div className="flex items-center gap-3 pt-1">
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Try example:</span>
          <button onClick={() => loadExample('fake')}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171' }}>
            🚨 Fake Job
          </button>
          <button onClick={() => loadExample('real')}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', color: '#34d399' }}>
            ✅ Real Job
          </button>
        </div>
      </div>
    </motion.div>
  );
}