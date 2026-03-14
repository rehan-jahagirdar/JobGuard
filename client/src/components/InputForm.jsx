import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, FileText, AlertCircle, Sparkles, Info } from 'lucide-react';

export default function InputForm({ onSubmit, error }) {
  const [activeTab, setActiveTab] = useState('text');
  const [urlInput, setUrlInput]   = useState('');
  const [textInput, setTextInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = activeTab === 'url' ? urlInput.trim() : textInput.trim();
    if (!content) return;
    onSubmit({ type: activeTab, content });
  };

  const isValid = activeTab === 'url'
    ? urlInput.trim().startsWith('http')
    : textInput.trim().length > 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass rounded-3xl p-1"
      style={{
        boxShadow: isFocused
          ? '0 0 60px rgba(124, 58, 237, 0.2), 0 0 120px rgba(37, 99, 235, 0.1)'
          : '0 0 40px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      <div className="rounded-3xl p-6 space-y-5"
        style={{ background: 'rgba(10, 0, 30, 0.6)' }}>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            { id: 'text', icon: FileText, label: 'Paste Text' },
            { id: 'url',  icon: Globe,    label: 'Paste URL'  },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4
                         rounded-xl text-sm font-medium transition-all duration-300"
              style={{ color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.4)' }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                  transition={{ type: 'spring', duration: 0.4 }}
                />
              )}
              <tab.icon size={15} className="relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'url' ? (
              <motion.div
                key="url"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <input
                  type="url"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="https://naukri.com/job-listings/..."
                  className="w-full rounded-2xl px-5 py-4 text-white text-sm
                             outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                {/* URL tip box */}
                <div
                  className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs"
                  style={{
                    background: 'rgba(245, 158, 11, 0.07)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    color: 'rgba(253, 211, 77, 0.8)',
                  }}
                >
                  <Info size={13} className="mt-0.5 shrink-0" />
                  <span>
                    Works best with <strong>Naukri, Internshala, Indeed</strong>.
                    LinkedIn & Facebook block scraping — use <strong>Paste Text</strong> for those.
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="text"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Paste the full job description here — title, company, salary, contact details, requirements..."
                  rows={7}
                  className="w-full rounded-2xl px-5 py-4 text-white text-sm
                             outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Minimum 50 characters needed
                  </p>
                  <p
                    className="text-xs tabular-nums"
                    style={{
                      color: textInput.length > 5500
                        ? '#f87171'
                        : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {textInput.length}/6000
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 rounded-2xl p-4 text-sm"
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                }}
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={!isValid}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            className="w-full py-4 rounded-2xl font-semibold text-sm flex items-center
                       justify-center gap-2 transition-all duration-300"
            style={{
              background: isValid
                ? 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)'
                : 'rgba(255,255,255,0.06)',
              color: isValid ? '#fff' : 'rgba(255,255,255,0.3)',
              cursor: isValid ? 'pointer' : 'not-allowed',
              boxShadow: isValid ? '0 0 30px rgba(124, 58, 237, 0.4)' : 'none',
            }}
          >
            <Sparkles size={16} />
            Analyze Job Posting
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}