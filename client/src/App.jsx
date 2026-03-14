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
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', position:'relative' }}>
        <Aurora />

        {/* Navbar */}
        <motion.nav
          initial={{ opacity:0, y:-20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.5 }}
          className="relative z-10"
          style={{ borderBottom:'1px solid rgba(255,255,255,.06)', backdropFilter:'blur(24px)', background:'rgba(2,6,23,.65)' }}
        >
          <div className="navbar-inner" style={{ padding:'12px 1rem' }}>
            <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
              <motion.div
                whileHover={{ scale:1.08, rotate:-5 }}
                transition={{ type:'spring', stiffness:300 }}
                style={{
                  width:38, height:38, borderRadius:10, flexShrink:0,
                  background:'linear-gradient(135deg,#7c3aed,#06b6d4)',
                  boxShadow:'0 0 22px rgba(124,58,237,.5)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}
              >
                <Shield size={17} color="#fff" strokeWidth={2.5} />
              </motion.div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontWeight:900, fontSize:'1.15rem', letterSpacing:'-.02em', color:'var(--text-primary)' }}>
                  JobGuard
                </span>
                <span style={{
                  fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:20,
                  background:'rgba(124,58,237,.12)', border:'1px solid rgba(124,58,237,.25)', color:'#a78bfa',
                }}>
                  AI
                </span>
              </div>
            </a>

            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{
                  width:7, height:7, borderRadius:'50%', background:'#10b981',
                  boxShadow:'0 0 8px rgba(16,185,129,.8)', display:'inline-block',
                }} />
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>Live</span>
              </div>
              <span style={{ fontSize:12, color:'var(--text-muted)' }} className="hidden md:block">
                Check before you apply
              </span>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-glass" style={{ padding:'8px 14px' }}>
                <Github size={14} />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>
        </motion.nav>

        {/* Main */}
        <main className="relative z-10" style={{ flex:1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result/:shareId" element={<Result />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center py-4"
          style={{ borderTop:'1px solid rgba(255,255,255,.06)', color:'var(--text-muted)', fontSize:12 }}>
          Built with ❤️ for Indian job seekers
          <span style={{ margin:'0 8px', opacity:.3 }}>·</span>
          JobGuard 2026
          <span style={{ margin:'0 8px', opacity:.3 }}>·</span>
          Powered by Gemini AI
        </footer>
      </div>
    </BrowserRouter>
  );
}