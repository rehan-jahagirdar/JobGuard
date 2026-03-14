import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Aurora from './components/Aurora';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative">
        <Aurora />

        <motion.header
          initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:.5}}
          className="relative z-10 px-6 py-5"
          style={{borderBottom:'1px solid var(--border)'}}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  background:'linear-gradient(135deg,#7c5cfc,#36b8f5)',
                  boxShadow:'0 0 24px rgba(124,92,252,.55)',
                  fontFamily:'Syne,sans-serif',
                }}>
                JG
              </div>
              <span className="font-bold text-lg" style={{fontFamily:'Syne,sans-serif',letterSpacing:'-.01em'}}>
                JobGuard
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full hidden sm:block"
                style={{
                  background:'rgba(124,92,252,.12)',
                  border:'1px solid rgba(124,92,252,.25)',
                  color:'#a78bfa',
                  fontFamily:'DM Sans,sans-serif',
                }}>
                AI Powered
              </span>
            </div>
            <span className="text-xs hidden sm:block" style={{color:'var(--muted)'}}>
              Check before you apply
            </span>
          </div>
        </motion.header>

        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}}
          className="relative z-10 text-center py-6"
          style={{borderTop:'1px solid var(--border)',color:'var(--muted)',fontSize:12}}>
          Built with ❤️ for Indian job seekers · JobGuard 2026
        </motion.footer>
      </div>
    </BrowserRouter>
  );
}