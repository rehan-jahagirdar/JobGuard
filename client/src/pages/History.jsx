// client/src/pages/History.jsx
import { motion } from 'framer-motion';
import { Clock, Search, Shield, AlertTriangle, XCircle, ChevronRight, Trash2, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const VCFG = {
  SAFE:        { color:'#10b981', bg:'rgba(16,185,129,.08)',  border:'rgba(16,185,129,.2)',  label:'Safe'        },
  SUSPICIOUS:  { color:'#f59e0b', bg:'rgba(245,158,11,.08)', border:'rgba(245,158,11,.2)', label:'Suspicious'  },
  LIKELY_FAKE: { color:'#ef4444', bg:'rgba(239,68,68,.08)',  border:'rgba(239,68,68,.2)',  label:'Likely Fake' },
};

/* ── Auth gate ── */
function AuthGate() {
  const { login } = useAuth();
  return (
    <div className="page-wrapper" style={{ alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
      <motion.div
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        className="glass-card-solid"
        style={{ borderRadius:24, padding:'2.5rem', textAlign:'center', maxWidth:400, width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:'1.25rem' }}
      >
        <div style={{ width:60, height:60, borderRadius:18, background:'rgba(124,58,237,.1)', border:'1px solid rgba(124,58,237,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Lock size={26} style={{ color:'#a78bfa' }} />
        </div>
        <div>
          <h2 style={{ fontSize:'1.25rem', fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>
            Sign in to view History
          </h2>
          <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6 }}>
            Create a free account to save your job analyses and access them anytime.
          </p>
        </div>
        <motion.button
          whileHover={{ scale:1.03, y:-1 }} whileTap={{ scale:.97 }}
          onClick={login}
          style={{
            display:'inline-flex', alignItems:'center', gap:8, padding:'11px 24px',
            borderRadius:12, cursor:'pointer', fontWeight:700, fontSize:14,
            background:'linear-gradient(135deg,#7c3aed,#2563eb)',
            border:'none', color:'#fff', boxShadow:'0 0 24px rgba(124,58,237,.4)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#ffffff99" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#ffffff66" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </motion.button>
        <p style={{ fontSize:12, color:'var(--text-muted)' }}>
          You can still analyze jobs without signing in
        </p>
      </motion.div>
    </div>
  );
}

export default function HistoryPage() {
  const { user }            = useAuth();
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('ALL');
  
  // 1. Start with an empty array
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. Fetch from your backend when the component loads
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        
        // IMPORTANT: Replace import.meta.env.VITE_API_URL with your actual backend URL variable if it's different!
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const response = await fetch(`${API_BASE_URL}/history/${user.uid}`);
        
        if (!response.ok) throw new Error('Failed to fetch history');
        
        const data = await response.json();
        
        // 3. Format the data to match your UI's expected structure
        if (data.history) {
          const formattedData = data.history.map(item => {
            // Safely parse Firestore timestamps
            let dateStr = 'Recent';
            if (item.createdAt && item.createdAt._seconds) {
              dateStr = new Date(item.createdAt._seconds * 1000).toLocaleDateString();
            } else if (item.createdAt) {
              dateStr = new Date(item.createdAt).toLocaleDateString();
            }

            return {
              id: item.id,
              jobTitle: item.jobTitle || 'Unknown Title',
              company: item.companyName || 'Unknown Company',
              trustScore: item.trustScore || 0,
              verdict: item.verdict || 'SUSPICIOUS',
              flags: item.flags?.length || 0, // Fallback if backend doesn't send flag count
              date: dateStr,
              shareId: item.shareId
            };
          });
          setHistory(formattedData);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (!user) return <AuthGate />;

  const filtered = history.filter(h => {
    const ms = h.jobTitle.toLowerCase().includes(search.toLowerCase()) || h.company.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'ALL' || h.verdict === filter;
    return ms && mf;
  });

  const stats = {
    total: history.length,
    safe:  history.filter(h => h.verdict === 'SAFE').length,
    fake:  history.filter(h => h.verdict === 'LIKELY_FAKE').length,
    susp:  history.filter(h => h.verdict === 'SUSPICIOUS').length,
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:'rgba(124,58,237,.1)', border:'1px solid rgba(124,58,237,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Clock size={19} style={{ color:'#a78bfa' }} />
          </div>
          <div>
            <h1 style={{ fontSize:'clamp(1.3rem,3vw,1.8rem)', fontWeight:900, color:'var(--text-primary)' }}>Analysis History</h1>
            <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:2 }}>Your previous job posting checks</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem' }}>
          {[
            { label:'Total', value:stats.total, color:'#a78bfa', bg:'rgba(124,58,237,.08)', border:'rgba(124,58,237,.2)' },
            { label:'Safe',  value:stats.safe,  color:'#34d399', bg:'rgba(16,185,129,.08)', border:'rgba(16,185,129,.2)' },
            { label:'Suspicious', value:stats.susp, color:'#fbbf24', bg:'rgba(245,158,11,.08)', border:'rgba(245,158,11,.2)' },
            { label:'Likely Fake', value:stats.fake, color:'#f87171', bg:'rgba(239,68,68,.08)', border:'rgba(239,68,68,.2)' },
          ].map((s,i) => (
            <motion.div key={i} initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*.07 }}
              style={{ padding:'10px 16px', borderRadius:14, background:s.bg, border:`1px solid ${s.border}`, display:'flex', flexDirection:'column', gap:2, minWidth:80 }}>
              <span style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.value}</span>
              <span style={{ fontSize:11, color:'var(--text-muted)' }}>{s.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Search + filter */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.2 }}
        style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem', alignItems:'center' }}>
        <div style={{ flex:1, minWidth:180, position:'relative' }}>
          <Search size={13} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or company..."
            className="input-glass" style={{ padding:'10px 13px 10px 36px', fontSize:13 }} />
        </div>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
          {['ALL','SAFE','SUSPICIOUS','LIKELY_FAKE'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding:'7px 12px', borderRadius:9, cursor:'pointer', fontSize:12, fontWeight:500,
                background: filter===f ? 'rgba(124,58,237,.15)':'var(--glass)',
                border: filter===f ? '1px solid rgba(124,58,237,.35)':'1px solid var(--glass-border)',
                color: filter===f ? '#a78bfa':'var(--text-secondary)', transition:'all .2s',
              }}>
              {f==='ALL'?'All':f==='LIKELY_FAKE'?'Fake':f.charAt(0)+f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* List */}
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
        {loading ? (
           <div className="glass-card" style={{ borderRadius:18, padding:'2.5rem', textAlign:'center' }}>
             <p style={{ fontSize:14, color:'var(--text-secondary)' }}>Loading your history...</p>
           </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card" style={{ borderRadius:18, padding:'2.5rem', textAlign:'center' }}>
            <p style={{ fontSize:28, marginBottom:8 }}>🔍</p>
            <p style={{ fontSize:14, color:'var(--text-secondary)' }}>No results found</p>
          </div>
        ) : filtered.map((item,i) => {
          const c = VCFG[item.verdict];
          return (
            <motion.div key={item.id}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.06 }}
              className="glass-card"
              style={{ borderRadius:18, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:'1rem', cursor:'pointer' }}
              whileHover={{ scale:1.005, x:3 }}
              onClick={() => window.open(`/result/${item.shareId}`, '_blank')} // Optional: click to open result
            >
              <div style={{ width:46, height:46, borderRadius:14, background:c.bg, border:`1px solid ${c.border}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontSize:14, fontWeight:900, color:c.color, lineHeight:1 }}>{item.trustScore}</span>
                <span style={{ fontSize:9, color:c.color, opacity:.7 }}>/ 100</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' }}>
                  <p style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:280 }}>{item.jobTitle}</p>
                  <span style={{ fontSize:11, padding:'2px 8px', borderRadius:999, fontWeight:600, background:c.bg, color:c.color, border:`1px solid ${c.border}`, whiteSpace:'nowrap' }}>{c.label}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:3, flexWrap:'wrap' }}>
                  <span style={{ fontSize:12, color:'var(--text-secondary)' }}>{item.company}</span>
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>🚩 {item.flags} flag{item.flags!==1?'s':''}</span>
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>📅 {item.date}</span>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
                <button onClick={e => { 
                    e.stopPropagation(); 
                    // Note: This only removes it from the screen. If you want to delete from Firebase, you need a DELETE api endpoint!
                    setHistory(h => h.filter(x => x.id!==item.id)); 
                  }}
                  style={{ padding:6, borderRadius:8, background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex' }}>
                  <Trash2 size={13} />
                </button>
                <ChevronRight size={15} style={{ color:'var(--text-muted)' }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}