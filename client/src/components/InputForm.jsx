import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, FileText, AlertCircle, Zap, Info, X } from 'lucide-react';

const EXAMPLE_FAKE = `URGENT HIRING!! Work from home earn ₹50,000 per day!! No experience needed!! Flexible hours, immediate joining. Send ₹499 registration fee via Paytm to 9876543210. WhatsApp us NOW!! Send Aadhaar card copy immediately!! Only 5 seats left!!!`;

const EXAMPLE_REAL = `Software Engineer - Microsoft India
Location: Hyderabad, India | Salary: 20-25 LPA
Experience: 3+ years in React and Node.js

We are looking for a skilled Software Engineer to join our Azure team.

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
      initial={{ opacity:0, y:28 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:.6, delay:.4, ease:[.22,1,.36,1] }}
      className="glass-card-solid"
      style={{
        borderRadius:24, overflow:'hidden',
        boxShadow: focused
          ? '0 0 0 1px rgba(124,58,237,.4), 0 0 60px rgba(124,58,237,.14), 0 24px 56px rgba(0,0,0,.55)'
          : '0 0 0 1px rgba(255,255,255,.06), 0 24px 56px rgba(0,0,0,.45)',
        transition:'box-shadow .4s ease',
      }}
    >
      {/* Top gradient line */}
      <div style={{
        height:1, width:'100%',
        background:'linear-gradient(90deg,transparent,rgba(124,58,237,.6),rgba(6,182,212,.4),transparent)'
      }} />

      <div style={{ padding:'clamp(1.25rem, 4vw, 2rem)', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

        {/* Tabs */}
        <div style={{ display:'flex', gap:6, padding:4, borderRadius:16, background:'rgba(255,255,255,.04)' }}>
          {[
            { id:'text', Icon:FileText, label:'Paste Text' },
            { id:'url',  Icon:Globe,    label:'Paste URL'  },
          ].map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                position:'relative', flex:1,
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                padding:'10px 8px', borderRadius:12,
                fontSize:13, fontWeight:500, cursor:'pointer',
                color: tab===id ? '#fff' : 'rgba(148,163,184,.75)',
                background:'transparent', border:'none',
                transition:'color .2s',
              }}
            >
              {tab===id && (
                <motion.div
                  layoutId="tab-bg"
                  className="tab-indicator"
                  style={{ position:'absolute', inset:0, borderRadius:12 }}
                  transition={{ type:'spring', stiffness:400, damping:30 }}
                />
              )}
              <Icon size={14} style={{ position:'relative', zIndex:1, flexShrink:0 }} />
              <span style={{ position:'relative', zIndex:1 }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
          <AnimatePresence mode="wait">
            {tab === 'url' ? (
              <motion.div key="url"
                initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:10 }} transition={{ duration:.2 }}
                style={{ display:'flex', flexDirection:'column', gap:8 }}
              >
                <input
                  type="url" value={url}
                  onChange={e => setUrl(e.target.value)}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  placeholder="https://naukri.com/job-listings/..."
                  className="input-glass"
                  style={{ padding:'13px 16px' }}
                />
                <div style={{
                  display:'flex', alignItems:'flex-start', gap:8,
                  padding:'10px 12px', borderRadius:12,
                  background:'rgba(245,158,11,.06)', border:'1px solid rgba(245,158,11,.18)',
                  color:'rgba(251,191,36,.85)', fontSize:12, lineHeight:1.5,
                }}>
                  <Info size={12} style={{ marginTop:1, flexShrink:0 }} />
                  <span>Works with <strong>Naukri, Internshala, Indeed</strong>. LinkedIn blocks scraping — use Paste Text instead.</span>
                </div>
              </motion.div>
            ) : (
              <motion.div key="text"
                initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-10 }} transition={{ duration:.2 }}
              >
                <div style={{ position:'relative' }}>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    placeholder="Paste the full job description here — title, company, salary, contact details, requirements..."
                    rows={6}
                    className="input-glass"
                    style={{ padding:'14px 16px', paddingRight: text ? 40 : 16 }}
                  />
                  {text && (
                    <button type="button" onClick={() => setText('')}
                      style={{
                        position:'absolute', top:10, right:10,
                        padding:5, borderRadius:8, cursor:'pointer',
                        color:'rgba(148,163,184,.5)', background:'rgba(255,255,255,.07)',
                        border:'none', display:'flex', alignItems:'center',
                      }}>
                      <X size={13} />
                    </button>
                  )}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, padding:'0 2px' }}>
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>Min. 50 characters</span>
                  <span style={{ fontSize:11, color: text.length>5500 ? 'var(--danger)':'var(--text-muted)' }}>
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
                initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                style={{
                  display:'flex', alignItems:'flex-start', gap:10,
                  padding:'12px 14px', borderRadius:16, fontSize:13,
                  background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.22)',
                  color:'#fca5a5', lineHeight:1.5,
                }}
              >
                <AlertCircle size={14} style={{ marginTop:1, flexShrink:0 }} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <motion.button
            type="submit" disabled={!valid}
            whileHover={valid ? { scale:1.01, y:-2 } : {}}
            whileTap={valid ? { scale:.99 } : {}}
            style={{
              width:'100%', padding:'14px 20px',
              borderRadius:18, fontWeight:600, fontSize:14,
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              position:'relative', overflow:'hidden', cursor: valid?'pointer':'not-allowed',
              background: valid
                ? 'linear-gradient(135deg,#7c3aed 0%,#2563eb 60%,#06b6d4 100%)'
                : 'rgba(255,255,255,.05)',
              color: valid ? '#fff':'rgba(148,163,184,.4)',
              border: valid ? 'none':'1px solid rgba(255,255,255,.08)',
              boxShadow: valid ? '0 0 0 1px rgba(124,58,237,.5), 0 4px 28px rgba(124,58,237,.4)':'none',
              transition:'all .3s ease', letterSpacing:'.02em',
            }}
          >
            {valid && (
              <motion.div
                style={{
                  position:'absolute', inset:0,
                  background:'linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)',
                }}
                animate={{ x:['-100%','200%'] }}
                transition={{ duration:2.5, repeat:Infinity, ease:'linear', repeatDelay:1.5 }}
              />
            )}
            <Zap size={15} style={{ position:'relative', zIndex:1 }} />
            <span style={{ position:'relative', zIndex:1 }}>Analyze Job Posting</span>
          </motion.button>
        </form>

        {/* Example buttons */}
        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:12, color:'var(--text-muted)' }}>Try:</span>
          <button onClick={() => loadExample('fake')}
            style={{
              padding:'6px 12px', borderRadius:10, cursor:'pointer',
              background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)',
              color:'#f87171', fontSize:12, fontWeight:500,
            }}>
            🚨 Fake Job
          </button>
          <button onClick={() => loadExample('real')}
            style={{
              padding:'6px 12px', borderRadius:10, cursor:'pointer',
              background:'rgba(16,185,129,.08)', border:'1px solid rgba(16,185,129,.2)',
              color:'#34d399', fontSize:12, fontWeight:500,
            }}>
            ✅ Real Job
          </button>
        </div>
      </div>
    </motion.div>
  );
}