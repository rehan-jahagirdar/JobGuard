// client/src/App.jsx
import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Github, Sun, Moon, Menu, X, History, Info, Search, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Aurora from './components/Aurora';
import Home from './pages/Home';
import HistoryPage from './pages/History';
import About from './pages/About';
import { AuthProvider, useAuth } from './context/AuthContext';

/* ── Profile dropdown ── */
function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen]  = useState(false);
  const ref              = useRef();
  const navigate         = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: .96 }}
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '6px 10px 6px 6px', borderRadius: 12, cursor: 'pointer',
          background: 'var(--glass)', border: '1px solid var(--glass-border)',
          color: 'var(--text-primary)', transition: 'all .2s',
        }}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="avatar"
            style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(124,58,237,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={13} color="#fff" />
          </div>
        )}
        <span style={{ fontSize: 13, fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.displayName?.split(' ')[0] || 'User'}
        </span>
        <ChevronDown size={13} style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: .96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: .96 }}
            transition={{ duration: .18 }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              minWidth: 180, borderRadius: 14, overflow: 'hidden',
              background: 'var(--card-bg)', border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(24px)', boxShadow: '0 16px 40px rgba(0,0,0,.4)', zIndex: 200,
            }}
          >
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--glass-border)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.displayName}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{user.email}</p>
            </div>
            {[
              { label: 'History', icon: History, action: () => { navigate('/history'); setOpen(false); } },
              { label: 'Sign Out', icon: LogOut,  action: () => { logout(); setOpen(false); }, danger: true },
            ].map((item) => (
              <button key={item.label} onClick={item.action}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                  padding: '10px 14px', background: 'transparent', border: 'none',
                  cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all .15s',
                  color: item.danger ? 'var(--danger)' : 'var(--text-primary)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = item.danger ? 'rgba(239,68,68,.08)' : 'var(--glass)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <item.icon size={14} />
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sign In button ── */
function SignInButton() {
  const { login } = useAuth();
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: .97 }}
      onClick={login}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '8px 16px', borderRadius: 11, cursor: 'pointer',
        background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
        border: 'none', color: '#fff', fontSize: 13, fontWeight: 600,
        boxShadow: '0 0 20px rgba(124,58,237,.35)', whiteSpace: 'nowrap',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24">
        <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#ffffff99" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#ffffff66" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign In
    </motion.button>
  );
}

/* ── Navbar ── */
function Navbar({ theme, toggleTheme }) {
  const [open, setOpen]   = useState(false);
  const location          = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => { setOpen(false); }, [location]);

  const navLinks = [
    { to: '/',        label: 'Analyze Job', icon: Search  },
    { to: '/history', label: 'History',     icon: History },
    { to: '/about',   label: 'About',       icon: Info    },
  ];

  const linkStyle = (isActive) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 13px', borderRadius: 10,
    fontSize: 13, fontWeight: 500, cursor: 'pointer',
    textDecoration: 'none', transition: 'all .2s ease',
    color: isActive ? '#a78bfa' : 'var(--text-secondary)',
    background: isActive ? 'rgba(124,58,237,.12)' : 'transparent',
    border: isActive ? '1px solid rgba(124,58,237,.2)' : '1px solid transparent',
  });

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .5 }}
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          borderBottom: '1px solid var(--glass-border)',
          backdropFilter: 'blur(24px)',
          background: 'var(--navbar-bg)',
        }}
      >
        <div className="navbar-inner" style={{ padding: '10px 1rem' }}>
          {/* Logo */}
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.08, rotate: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                boxShadow: '0 0 20px rgba(124,58,237,.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Shield size={16} color="#fff" strokeWidth={2.5} />
            </motion.div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontWeight: 900, fontSize: '1.08rem', letterSpacing: '-.02em', color: 'var(--text-primary)' }}>
                JobGuard
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: 'rgba(124,58,237,.12)', border: '1px solid rgba(124,58,237,.25)', color: '#a78bfa' }}>
                AI
              </span>
            </div>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 3 }}>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => linkStyle(isActive)}>
                <Icon size={13} />{label}
              </NavLink>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 7px rgba(16,185,129,.8)', display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live</span>
            </div>

            {/* Theme */}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }}
              onClick={toggleTheme}
              style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass)', border: '1px solid var(--glass-border)', cursor: 'pointer', color: 'var(--text-primary)' }}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </motion.button>

            {/* GitHub */}
            <a href="https://github.com" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              <Github size={13} />
              <span className="hidden sm:inline">GitHub</span>
            </a>

            {/* Auth */}
            {!loading && (user ? <ProfileMenu /> : <SignInButton />)}

            {/* Hamburger */}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }}
              onClick={() => setOpen(true)}
              className="md:hidden"
              style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass)', border: '1px solid var(--glass-border)', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              <Menu size={15} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(2,6,23,.97)', backdropFilter: 'blur(24px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}
          >
            <button onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={22} />
            </button>
            {navLinks.map(({ to, label, icon: Icon }, i) => (
              <motion.div key={to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .08 }}>
                <NavLink to={to} end={to === '/'} style={({ isActive }) => ({ ...linkStyle(isActive), fontSize: 17, padding: '12px 28px' })}>
                  <Icon size={17} />{label}
                </NavLink>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 8 }}>
              {!loading && !user && <SignInButton />}
              <button onClick={toggleTheme}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 14 }}>
                {theme === 'dark' ? <><Sun size={15} /> Light Mode</> : <><Moon size={15} /> Dark Mode</>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── App ── */
export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('jg-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jg-theme', theme);
  }, [theme]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <Aurora />
          <Navbar theme={theme} toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
          <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
            <Routes>
              <Route path="/"        element={<Home />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/about"   element={<About />} />
            </Routes>
          </main>
          <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '1rem', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: 12 }}>
            Built with ❤️ for Indian job seekers · JobGuard 2026 · Powered by Gemini AI
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}