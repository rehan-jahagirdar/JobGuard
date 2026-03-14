import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, FileText, AlertCircle, Zap, Info } from 'lucide-react';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.35, ease: [.22,1,.36,1] }}
      className="glass-hi rounded-3xl p-[1px]"
      style={{
        boxShadow: focused
          ? '0 0 0 1px rgba(139,92,246,.4), 0 0 90px rgba(139,92,246,.14), 0 30px 80px rgba(0,0,0,.5)'
          : '0 0 0 1px rgba(255,255,255,.06), 0 30px 70px rgba(0,0,0,.45)',
        transition: 'box-shadow .4s ease',
      }}
    >
      {/* inner surface */}
      <div className="rounded-3xl p-6 space-y-5"
        style={{ background: 'rgba(6,0,18,.75)' }}>

        {/* tab switcher */}
        <div className="flex gap-1.5 p-1 rounded-2xl"
          style={{ background: 'rgba(255,255,255,.04)' }}>
          {[
            { id: 'text', Icon: FileText, label: 'Paste Text' },
            { id: 'url',  Icon: Globe,    label: 'Paste URL'  },
          ].map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className="relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors duration-200"
              style={{ color: tab === id ? '#fff' : 'var(--muted)' }}
            >
              {tab === id && (
                <motion.div layoutId="active-tab"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#0e7490)' }}
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <Icon size={14} className="relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <AnimatePresence mode="wait">
            {tab === 'url' ? (
              <motion.div key="url"
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }} transition={{ duration: .22 }}
                className="space-y-2"
              >
                <input
                  type="url" value={url}
                  onChange={e => setUrl(e.target.value)}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  placeholder="https://naukri.com/job-listings/..."
                  className="input-field"
                  style={{ padding: '14px 18px' }}
                />
                <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs"
                  style={{
                    background: 'rgba(245,158,11,.07)',
                    border: '1px solid rgba(245,158,11,.18)',
                    color: 'rgba(253,211,77,.8)',
                  }}>
                  <Info size={12} className="mt-0.5 shrink-0" />
                  Works best with <strong>Naukri, Internshala, Indeed</strong>.
                  LinkedIn blocks scraping — use Paste Text for those.
                </div>
              </motion.div>
            ) : (
              <motion.div key="text"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }} transition={{ duration: .22 }}
              >
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  placeholder="Paste the full job description here — title, company, salary, contact details, requirements, everything..."
                  rows={7}
                  className="input-field"
                  style={{ padding: '16px 18px' }}
                />
                <div className="flex justify-between mt-2 px-0.5">
                  <span style={{ fontSize: 12, color: 'var(--faint)' }}>Minimum 50 characters</span>
                  <span style={{ fontSize: 12, color: text.length > 5500 ? 'var(--danger)' : 'var(--faint)' }}
                    className="tabular-nums">{text.length}/6000</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: .97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-3 rounded-2xl p-4 text-sm"
                style={{
                  background: 'rgba(239,68,68,.08)',
                  border: '1px solid rgba(239,68,68,.22)',
                  color: '#fca5a5',
                }}
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* submit */}
          <motion.button
            type="submit" disabled={!valid}
            whileHover={valid ? { scale: 1.015, y: -2 } : {}}
            whileTap={valid ? { scale: .985 } : {}}
            className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 relative overflow-hidden"
            style={{
              fontFamily: 'Syne,sans-serif',
              letterSpacing: '.03em',
              background: valid
                ? 'linear-gradient(135deg,#7c3aed 0%,#0891b2 100%)'
                : 'rgba(255,255,255,.05)',
              color: valid ? '#fff' : 'var(--faint)',
              cursor: valid ? 'pointer' : 'not-allowed',
              border: valid ? 'none' : '1px solid rgba(255,255,255,.08)',
              boxShadow: valid
                ? '0 0 0 1px rgba(124,58,237,.5), 0 0 45px rgba(124,58,237,.35)'
                : 'none',
              transition: 'all .3s ease',
            }}
          >
            {valid && (
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
            )}
            <Zap size={15} className="relative z-10" />
            <span className="relative z-10">Analyze Job Posting</span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}