import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Github } from 'lucide-react';
import Aurora from './components/Aurora';
import Home from './pages/Home';
import Result from './pages/Result';
import History from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative flex flex-col">
        <Aurora />

        {/* ── Navbar ── */}
        <motion.nav
          initial={{ opacity:0, y:-20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.5 }}
          className="relative z-10 py-3"
          style={{
            borderBottom: '1px solid rgba(255,255,255,.06)',
            backdropFilter: 'blur(24px)',
            background: 'rgba(2,6,23,.65)',
          }}
        >
          <div style={{ maxWidth:672, margin:'0 auto', padding:'0 1rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            {/* Logo */}
            <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
              <motion.div
                whileHover={{ scale:1.08, rotate:-5 }}
                transition={{ type:'spring', stiffness:300 }}
                style={{
                  width:36, height:36, borderRadius:10,
                  background:'linear-gradient(135deg,#7c3aed,#06b6d4)',
                  boxShadow:'0 0 22px rgba(124,58,237,.5)',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}
              >
                <Shield size={16} color="#fff" strokeWidth={2.5} />
              </motion.div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontWeight:900, fontSize:'1.1rem', letterSpacing:'-.02em', color:'var(--text-primary)' }}>
                  JobGuard
                </span>
                <span className="hidden sm:block" style={{
                  fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:20,
                  background:'rgba(124,58,237,.12)', border:'1px solid rgba(124,58,237,.25)', color:'#a78bfa',
                }}>
                  AI
                </span>
              </div>
            </a>

            {/* Right */}
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div className="hidden sm:flex" style={{ alignItems:'center', gap:6, marginRight:4 }}>
                <span style={{
                  width:6, height:6, borderRadius:'50%', background:'#10b981',
                  boxShadow:'0 0 6px rgba(16,185,129,.8)', display:'inline-block',
                  animation:'pulse 2s infinite',
                }} />
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>Live</span>
              </div>
              <a
                href="https://github.com" target="_blank" rel="noreferrer"
                className="btn-glass"
                style={{ padding:'8px 12px' }}
              >
                <Github size={13} />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>
        </motion.nav>

        {/* ── Main ── */}
        <main className="relative z-10 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result/:shareId" element={<Result />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>

        {/* ── Footer ── */}
        <footer
          className="relative z-10 text-center py-4"
          style={{ borderTop:'1px solid rgba(255,255,255,.06)', color:'var(--text-muted)', fontSize:12 }}
        >
          <span>Built with ❤️ for Indian job seekers</span>
          <span style={{ margin:'0 8px', opacity:.3 }}>·</span>
          <span>JobGuard 2026</span>
          <span style={{ margin:'0 8px', opacity:.3 }}>·</span>
          <span>Powered by Gemini AI</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}