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
  const [open, setOpen]  = useState(false);
  const ref              = useRef();
  const navigate         = useNavigate();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <motion.button
        whileHover={{ scale:1.03 }} whileTap={{ scale:.95 }}
        onClick={() => setOpen(o => !o)}
        style={{
          display:'flex', alignItems:'center', gap:7,
          padding:'5px 10px 5px 5px', borderRadius:999, cursor:'pointer',
          background:'var(--glass)', border:'1px solid var(--glass-border)',
          color:'var(--text-primary)', transition:'all .2s',
        }}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="avatar" style={{ width:26, height:26, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
        ) : (
          <div style={{ width:26, height:26, borderRadius:'50%', background:'rgba(124,58,237,.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <User size={13} color="#fff" />
          </div>
        )}
        <span style={{ fontSize:13, fontWeight:500, maxWidth:90, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {user.displayName?.split(' ')[0] || 'User'}
        </span>
        <ChevronDown size={12} style={{ transition:'transform .2s', transform: open?'rotate(180deg)':'rotate(0)' }} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:-8, scale:.95 }}
            animate={{ opacity:1, y:0,  scale:1 }}
            exit={{ opacity:0,  y:-8,  scale:.95 }}
            transition={{ duration:.18 }}
            style={{
              position:'absolute', top:'calc(100% + 8px)', right:0,
              minWidth:185, borderRadius:16, overflow:'hidden',
              background:'var(--card-bg)', border:'1px solid var(--glass-border)',
              backdropFilter:'blur(28px)', boxShadow:'0 16px 44px rgba(0,0,0,.38)', zIndex:200,
            }}
          >
            <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--glass-border)' }}>
              <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{user.displayName}</p>
              <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{user.email}</p>
            </div>
            {[
              { label:'History', icon:History, action:() => { navigate('/history'); setOpen(false); } },
              { label:'Sign Out', icon:LogOut, action:() => { logout(); setOpen(false); }, danger:true },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontSize:13, fontWeight:500, color:item.danger?'var(--danger)':'var(--text-primary)', transition:'background .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = item.danger?'rgba(239,68,68,.08)':'var(--glass)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <item.icon size={14} />{item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Google Sign In button ── */
function SignInButton() {
  const { login } = useAuth();
  return (
    <motion.button
      whileHover={{ scale:1.04, y:-1 }} whileTap={{ scale:.96 }}
      onClick={login}
      style={{
        display:'inline-flex', alignItems:'center', gap:7,
        padding:'7px 15px', borderRadius:999, cursor:'pointer',
        background:'linear-gradient(135deg,#7c3aed,#2563eb)',
        border:'none', color:'#fff', fontSize:13, fontWeight:600,
        boxShadow:'0 0 18px rgba(124,58,237,.38)', whiteSpace:'nowrap',
        transition:'all .22s ease',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24">
        <path fill="#fff"       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#ffffff99"  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#ffffff66"  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#fff"       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign In
    </motion.button>
  );
}

/* ── Pill Navbar ── */
function Navbar({ theme, toggleTheme }) {
  const [open, setOpen]   = useState(false);
  const location          = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => { setOpen(false); }, [location]);

  const navLinks = [
    { to:'/',        label:'Analyze Job', icon:Search  },
    { to:'/history', label:'History',     icon:History },
    { to:'/about',   label:'About',       icon:Info    },
  ];

  return (
    <>
      {/* Wrapper gives breathing room around the pill */}
      <div className="nav-wrapper relative z-50">
        <motion.div
          initial={{ opacity:0, y:-24 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.55, ease:[.22,1,.36,1] }}
          className="pill-nav"
        >
          {/* Logo */}
<NavLink to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
  <motion.div
    whileHover={{ scale:1.1, rotate:-5 }}
    transition={{ type:'spring', stiffness:300 }}
    style={{
      width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center',
      filter: theme === 'dark' ? 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.4))' : 'none'
    }}
  >
    <img src="/favicon.svg" alt="JobGuard Logo" style={{ height: '28px', width: '28px' }} />
  </motion.div>
  
  <div className="hidden sm:flex" style={{ alignItems:'center', gap:7 }}>
    <span style={{ 
      fontWeight: 900, 
      fontSize: '1.4rem', 
      letterSpacing: '-1px',
      // This line fixes the visibility issue by using the theme's text color
      color: 'var(--text-primary)' 
    }}>
      JobGuard
    </span>
    <span style={{ 
      fontSize:10, 
      fontWeight:700, 
      padding:'2px 7px', 
      borderRadius:20, 
      background: theme === 'dark' ? 'rgba(124,58,237,.14)' : 'rgba(124,58,237,.08)', 
      border:'1px solid rgba(124,58,237,.28)', 
      color:'#7c3aed' 
    }}>
      AI
    </span>
  </div>
</NavLink>
          {/* Center nav links — desktop */}
          <div className="hidden md:flex" style={{ alignItems:'center', gap:3 }}>
            {navLinks.map(({ to, label, icon:Icon }) => (
              <NavLink
                key={to} to={to} end={to==='/'}
                className={({ isActive }) => `nav-link-pill ${isActive ? 'active' : ''}`}
              >
                <Icon size={13} />{label}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
            {/* Live dot */}
            <div className="hidden sm:flex" style={{ alignItems:'center', gap:5 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 7px rgba(16,185,129,.9)', display:'inline-block' }} />
              <span style={{ fontSize:11, color:'var(--text-muted)' }}>Live</span>
            </div>

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale:1.12 }} whileTap={{ scale:.9 }}
              onClick={toggleTheme}
              style={{ width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--glass)', border:'1px solid var(--glass-border)', cursor:'pointer', color:'var(--text-primary)', transition:'all .2s' }}
              title="Toggle theme"
            >
              {theme==='dark' ? <Sun size={13} /> : <Moon size={13} />}
            </motion.button>

            {/* GitHub */}
            <a href="https://github.com/rehan-jahagirdar/JobGuard" target="_blank" rel="noreferrer"
              className="btn-glass" style={{ padding:'6px 12px', fontSize:12 }}>
              <Github size={13} />
              <span className="hidden sm:inline">GitHub</span>
            </a>

            {/* Auth */}
            {!loading && (user ? <ProfileMenu /> : <SignInButton />)}

            {/* Hamburger */}
            <motion.button
              whileHover={{ scale:1.1 }} whileTap={{ scale:.9 }}
              onClick={() => setOpen(true)}
              className="md:hidden"
              style={{ width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--glass)', border:'1px solid var(--glass-border)', cursor:'pointer', color:'var(--text-primary)' }}
            >
              <Menu size={14} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="mobile-menu"
          >
            <button onClick={() => setOpen(false)}
              style={{ position:'absolute', top:22, right:22, background:'transparent', border:'none', cursor:'pointer', color:'var(--text-secondary)' }}>
              <X size={22} />
            </button>

            {navLinks.map(({ to, label, icon:Icon }, i) => (
              <motion.div key={to} initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.09 }}>
                <NavLink to={to} end={to=='/'}
                  className={({ isActive }) => `nav-link-pill ${isActive?'active':''}`}
                  style={{ fontSize:17, padding:'13px 30px' }}>
                  <Icon size={17} />{label}
                </NavLink>
              </motion.div>
            ))}

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.32 }}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, marginTop:8 }}>
              {!loading && !user && <SignInButton />}
              <button onClick={toggleTheme}
                className="btn-glass"
                style={{ padding:'10px 24px', fontSize:14 }}>
                {theme==='dark' ? <><Sun size={15}/> Light Mode</> : <><Moon size={15}/> Dark Mode</>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Root App ── */
export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('jg-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jg-theme', theme);
  }, [theme]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', position:'relative' }}>
          <Aurora />
          <Navbar theme={theme} toggleTheme={() => setTheme(t => t==='dark'?'light':'dark')} />
          <main style={{ flex:1, position:'relative', zIndex:10 }}>
            <Routes>
              <Route path="/"        element={<Home />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/about"   element={<About />} />
            </Routes>
          </main>
          <footer style={{ position:'relative', zIndex:10, textAlign:'center', padding:'1rem', borderTop:'1px solid var(--glass-border)', color:'var(--text-muted)', fontSize:12 }}>
            Built with ❤️ for Indian job seekers · JobGuard 2026 · Powered by Groq AI
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}