import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, FileText, AlertCircle, Sparkles, Info } from 'lucide-react';

export default function InputForm({ onSubmit, error }) {
  const [tab, setTab]         = useState('text');
  const [url, setUrl]         = useState('');
  const [text, setText]       = useState('');
  const [focused, setFocused] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const content = tab==='url' ? url.trim() : text.trim();
    if (!content) return;
    onSubmit({ type:tab, content });
  };

  const valid = tab==='url' ? url.trim().startsWith('http') : text.trim().length>50;

  const inputStyle = {
    background: focused ? 'rgba(255,255,255,0.06)':'rgba(255,255,255,0.03)',
    border: `1px solid ${focused ? 'rgba(124,92,252,.5)':'rgba(255,255,255,0.08)'}`,
    boxShadow: focused ? '0 0 0 3px rgba(124,92,252,.12)':'none',
    outline:'none',
    transition:'all .3s ease',
    color:'var(--text)',
    borderRadius:16,
    width:'100%',
    fontSize:14,
    fontFamily:'DM Sans,sans-serif',
  };

  return (
    <motion.div
      initial={{opacity:0,y:28}}
      animate={{opacity:1,y:0}}
      transition={{duration:.6,delay:.3,ease:[.22,1,.36,1]}}
      className="glass-hi rounded-3xl p-1"
      style={{
        boxShadow: focused
          ? '0 0 0 1px rgba(124,92,252,.3), 0 0 80px rgba(124,92,252,.12)'
          : '0 20px 60px rgba(0,0,0,.5)',
        transition:'box-shadow .4s ease',
      }}
    >
      <div className="rounded-3xl p-6 space-y-5"
        style={{background:'rgba(8,0,22,.65)'}}>

        {/* Tabs */}
        <div className="flex gap-1.5 p-1 rounded-2xl"
          style={{background:'rgba(255,255,255,0.04)'}}>
          {[{id:'text',icon:FileText,label:'Paste Text'},{id:'url',icon:Globe,label:'Paste URL'}].map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              className="relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all"
              style={{color:tab===t.id?'#fff':'var(--muted)',fontFamily:'DM Sans,sans-serif'}}>
              {tab===t.id && (
                <motion.div layoutId="tab"
                  className="absolute inset-0 rounded-xl"
                  style={{background:'linear-gradient(135deg,#7c5cfc,#36b8f5)'}}
                  transition={{type:'spring',stiffness:380,damping:30}} />
              )}
              <t.icon size={14} className="relative z-10" />
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <AnimatePresence mode="wait">
            {tab==='url' ? (
              <motion.div key="url"
                initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                exit={{opacity:0,x:10}} transition={{duration:.2}}
                className="space-y-2">
                <input type="url" value={url}
                  onChange={e=>setUrl(e.target.value)}
                  onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
                  placeholder="https://naukri.com/job-listings/..."
                  style={{...inputStyle, padding:'14px 20px'}} />
                <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs"
                  style={{background:'rgba(245,166,35,.07)',border:'1px solid rgba(245,166,35,.18)',color:'rgba(245,200,100,.8)'}}>
                  <Info size={12} className="mt-0.5 shrink-0" />
                  Best with <strong>Naukri, Internshala, Indeed</strong>. LinkedIn blocks scraping — use Paste Text instead.
                </div>
              </motion.div>
            ) : (
              <motion.div key="text"
                initial={{opacity:0,x:10}} animate={{opacity:1,x:0}}
                exit={{opacity:0,x:-10}} transition={{duration:.2}}>
                <textarea value={text}
                  onChange={e=>setText(e.target.value)}
                  onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
                  placeholder="Paste the full job description here — title, company, salary, contact details, requirements..."
                  rows={7}
                  style={{...inputStyle, padding:'16px 20px'}} />
                <div className="flex justify-between mt-2 px-1">
                  <span style={{fontSize:12,color:'var(--muted)'}}>Minimum 50 characters</span>
                  <span style={{fontSize:12,color:text.length>5500?'var(--danger)':'var(--muted)'}}
                    className="tabular-nums">{text.length}/6000</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
                className="flex items-start gap-3 rounded-2xl p-4 text-sm"
                style={{background:'rgba(245,86,74,.08)',border:'1px solid rgba(245,86,74,.2)',color:'#fca5a5'}}>
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button type="submit" disabled={!valid}
            whileHover={valid?{scale:1.02,y:-1}:{}}
            whileTap={valid?{scale:.98}:{}}
            className="w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{
              fontFamily:'Syne,sans-serif',
              background: valid ? 'linear-gradient(135deg,#7c5cfc,#36b8f5)':'rgba(255,255,255,0.05)',
              color: valid?'#fff':'var(--muted)',
              cursor: valid?'pointer':'not-allowed',
              boxShadow: valid?'0 0 40px rgba(124,92,252,.4)':'none',
              border: valid?'none':'1px solid rgba(255,255,255,0.08)',
              transition:'all .3s ease',
              letterSpacing:'.02em',
            }}>
            <Sparkles size={15} />
            Analyze Job Posting
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}