import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, History as HistoryIcon, Github } from 'lucide-react';
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
          transition={{ duration:.5, ease:[.22,1,.36,1] }}
          className="relative z-10 px-4 md:px-6 py-4"
          style={{
            borderBottom: '1px solid rgba(255,255,255,.06)',
            backdropFilter: 'blur(24px)',
            background: 'rgba(2,6,23,.6)',
          }}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 no-underline">
              <motion.div
                whileHover={{ scale:1.1, rotate:-6 }}
                transition={{ type:'spring', stiffness:300 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                  boxShadow: '0 0 24px rgba(124,58,237,.55)',
                }}
              >
                <Shield size={17} color="#fff" strokeWidth={2.5} />
              </motion.div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight"
                  style={{ color:'var(--text-primary)' }}>
                  JobGuard
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full hidden sm:block font-semibold"
                  style={{
                    background: 'rgba(124,58,237,.12)',
                    border: '1px solid rgba(124,58,237,.25)',
                    color: '#a78bfa',
                  }}>
                  AI
                </span>
              </div>
            </a>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Live indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs mr-2"
                style={{ color:'var(--text-muted)' }}>
                <span className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: '#10b981',
                    boxShadow: '0 0 6px rgba(16,185,129,.8)',
                    animation: 'pulse 2s infinite',
                  }} />
                Live
              </div>

              <a href="https://github.com" target="_blank" rel="noreferrer"
                className="btn-glass px-3 py-2 text-xs">
                <Github size={13} />
                <span className="hidden sm:block">GitHub</span>
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
        <motion.footer
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
          className="relative z-10 text-center py-5 text-xs"
          style={{
            borderTop: '1px solid rgba(255,255,255,.06)',
            color: 'var(--text-muted)',
          }}
        >
          <span>Built with ❤️ for Indian job seekers</span>
          <span className="mx-2 opacity-30">·</span>
          <span>JobGuard 2026</span>
          <span className="mx-2 opacity-30">·</span>
          <span>Powered by Gemini AI</span>
        </motion.footer>
      </div>
    </BrowserRouter>
  );
}