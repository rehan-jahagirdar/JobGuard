import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Aurora from './components/Aurora';
import Home from './pages/Home';
import { Shield } from 'lucide-react';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative flex flex-col">
        <Aurora />

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.5, ease:[.22,1,.36,1] }}
          className="relative z-10 px-6 py-4"
          style={{ borderBottom:'1px solid var(--border)', backdropFilter:'blur(20px)' }}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            {/* logo */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale:1.08, rotate:-4 }}
                transition={{ type:'spring', stiffness:300 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg,#7c3aed,#0891b2)',
                  boxShadow: '0 0 28px rgba(124,58,237,.55)',
                }}
              >
                <Shield size={17} color="#fff" strokeWidth={2.5} />
              </motion.div>

              <div className="flex items-center gap-2.5">
                <span className="font-bold text-lg tracking-tight"
                  style={{ fontFamily:'Syne,sans-serif' }}>
                  JobGuard
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full hidden sm:block"
                  style={{
                    background: 'rgba(139,92,246,.12)',
                    border: '1px solid rgba(139,92,246,.25)',
                    color: '#a78bfa',
                  }}>
                  AI Powered
                </span>
              </div>
            </div>

            {/* right side */}
            <div className="flex items-center gap-3">
              {/* live indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs"
                style={{ color:'var(--muted)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ animation:'pulse 2s ease-in-out infinite',
                    boxShadow:'0 0 6px rgba(52,211,153,.7)' }} />
                Live
              </div>
              <span className="text-xs" style={{ color:'var(--faint)' }}>
                Check before you apply
              </span>
            </div>
          </div>
        </motion.header>

        {/* ── Main ── */}
        <main className="relative z-10 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>

        {/* ── Footer ── */}
        <motion.footer
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}
          className="relative z-10 text-center py-5 text-xs"
          style={{
            borderTop: '1px solid var(--border)',
            color: 'var(--faint)',
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