import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Aurora from './components/Aurora';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative">
        <Aurora />

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
                }}
              >
                JG
              </div>
              <span className="font-bold text-lg tracking-tight">JobGuard</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full hidden sm:block"
                style={{
                  background: 'rgba(124, 58, 237, 0.15)',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  color: '#a78bfa',
                }}
              >
                AI Powered
              </span>
            </div>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Check before you apply
            </span>
          </div>
        </motion.header>

        {/* Main */}
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}