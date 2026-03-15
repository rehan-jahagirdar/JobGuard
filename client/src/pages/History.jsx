import { motion } from 'framer-motion';
import { Clock, Search, Trash2, ChevronRight, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHistory, deleteHistoryItem } from '../services/api';

const VCFG = {
  SAFE: { color:'#10b981', bg:'rgba(16,185,129,.08)', border:'rgba(16,185,129,.2)', label:'Safe' },
  SUSPICIOUS: { color:'#f59e0b', bg:'rgba(245,158,11,.08)', border:'rgba(245,158,11,.2)', label:'Suspicious' },
  LIKELY_FAKE: { color:'#ef4444', bg:'rgba(239,68,68,.08)', border:'rgba(239,68,68,.2)', label:'Likely Fake' },
};

export default function HistoryPage() {
  const { user, login } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory(user.uid);
      setHistory(data.map(item => ({
        id: item.id,
        jobTitle: item.jobTitle || 'Unknown',
        company: item.companyName || 'Unknown',
        trustScore: item.trustScore || 0,
        verdict: item.verdict || 'SUSPICIOUS',
        date: item.createdAt?._seconds ? new Date(item.createdAt._seconds * 1000).toLocaleDateString() : 'Recent',
        shareId: item.shareId
      })));
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Permanently delete this record?')) return;
    try {
      await deleteHistoryItem(id, user.uid);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) { alert('Delete failed'); }
  };

  if (!user) return (
    <div className="page-wrapper" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', textAlign:'center'}}>
      <Lock size={40} style={{marginBottom:'1rem', color:'#7c3aed'}} />
      <h2 style={{color:'var(--text-primary)'}}>Sign in to view History</h2>
      <button onClick={login} className="btn-primary" style={{marginTop:'1.5rem', padding:'12px 24px', borderRadius:12, background:'linear-gradient(135deg,#7c3aed,#2563eb)', border:'none', color:'#fff', cursor:'pointer', fontWeight:700}}>
        Sign in with Google
      </button>
    </div>
  );

  const filtered = history.filter(h => 
    h.jobTitle.toLowerCase().includes(search.toLowerCase()) || 
    h.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div style={{marginBottom:'2rem'}}>
        <h1 style={{fontSize:'1.8rem', fontWeight:900, color:'var(--text-primary)'}}>Analysis History</h1>
        <p style={{color:'var(--text-secondary)', fontSize:13}}>Your private records of job scans</p>
      </div>

      <div style={{position:'relative', marginBottom:'1.5rem'}}>
        <Search size={14} style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)'}} />
        <input 
          placeholder="Search history..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          style={{width:'100%', padding:'12px 12px 12px 38px', borderRadius:14, background:'var(--glass)', border:'1px solid var(--glass-border)', color:'var(--text-primary)', fontSize:14}}
        />
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
        {loading ? <p style={{textAlign:'center', color:'var(--text-muted)'}}>Syncing with database...</p> : 
         filtered.length === 0 ? <p style={{textAlign:'center', color:'var(--text-muted)', marginTop:'2rem'}}>No history found.</p> :
         filtered.map((item) => {
          const c = VCFG[item.verdict];
          return (
            <motion.div key={item.id} className="glass-card" onClick={() => window.open(`/result/${item.shareId}`, '_blank')}
              whileHover={{ scale:1.01 }}
              style={{padding:'1rem', display:'flex', alignItems:'center', gap:'1rem', borderRadius:18, cursor:'pointer', border:'1px solid var(--glass-border)', background:'var(--glass)'}}>
              <div style={{width:44, height:44, borderRadius:12, background:c.bg, border:`1px solid ${c.border}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                <span style={{fontWeight:900, color:c.color, fontSize:15}}>{item.trustScore}</span>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <p style={{fontSize:14, fontWeight:600, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{item.jobTitle}</p>
                <p style={{fontSize:12, color:'var(--text-secondary)'}}>{item.company} • {item.date}</p>
              </div>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <button onClick={(e) => handleDelete(e, item.id)} style={{padding:8, borderRadius:10, background:'rgba(239,68,68,0.1)', border:'none', cursor:'pointer', color:'#ef4444'}}>
                  <Trash2 size={15} />
                </button>
                <ChevronRight size={18} style={{color:'var(--text-muted)'}} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}