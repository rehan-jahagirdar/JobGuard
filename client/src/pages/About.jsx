import { motion } from 'framer-motion';
import { Shield, Zap, Database, Globe, Brain, Users, Code2, Award } from 'lucide-react';

const TECH_STACK = [
  { icon:'⚛️',  name:'React + Vite',    desc:'Frontend framework'         },
  { icon:'🎨',  name:'Tailwind CSS',    desc:'Utility-first styling'      },
  { icon:'🤖',  name:'Groq AI',   desc:'AI scam detection engine'   },
  { icon:'🔥',  name:'Firebase',        desc:'Database & authentication'  },
  { icon:'🟢',  name:'Node.js + Express', desc:'Backend API server'       },
  { icon:'🚀',  name:'Vercel + Railway', desc:'Deployment platform'       },
];

const HOW_IT_WORKS = [
  { step:'01', icon:Globe,    title:'Input',   desc:'Paste a job URL, description text, or upload a screenshot from WhatsApp/Telegram.' },
  { step:'02', icon:Brain,    title:'Analyze', desc:'Groq AI scans the content against 50+ known scam patterns and signals.' },
  { step:'03', icon:Database, title:'Compare', desc:'Cross-references with our community database of previously reported scam postings.' },
  { step:'04', icon:Shield,   title:'Report',  desc:'Delivers a Trust Score, red flags breakdown, and actionable advice in seconds.' },
];

const STATS = [
  { value:'50+',    label:'Scam patterns detected'       },
  { value:'10 sec', label:'Average analysis time'        },
  { value:'92%',    label:'Detection accuracy'           },
  { value:'Free',   label:'Always free for job seekers'  },
];

export default function About() {
  return (
    <div className="page-wrapper" style={{ gap:'3rem' }}>

      {/* Hero */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem' }}
      >
        {/* Hackathon badge */}
        <motion.div
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:260, damping:20, delay:.2 }}
          style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 16px', borderRadius:999, background:'linear-gradient(135deg,rgba(124,58,237,.15),rgba(6,182,212,.15))', border:'1px solid rgba(124,58,237,.3)', color:'#a78bfa', fontSize:12, fontWeight:700 }}
        >
          <Award size={13} />
          Built for Hackathon 🏆
        </motion.div>

        <div>
          <h1 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, letterSpacing:'-.03em', color:'var(--text-primary)', lineHeight:1.1 }}>
            About <span style={{ background:'linear-gradient(135deg,#a78bfa,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>JobGuard</span>
          </h1>
          <p style={{ fontSize:'clamp(.9rem,1.8vw,1.1rem)', color:'var(--text-secondary)', maxWidth:560, margin:'1rem auto 0', lineHeight:1.7 }}>
            An AI-powered platform that helps Indian job seekers instantly detect fake job postings,
            verify company legitimacy, and protect themselves from scams.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'1rem 2.5rem' }}>
          {STATS.map((s,i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:.4 + i*.1 }}
              style={{ textAlign:'center' }}>
              <p style={{ fontSize:'clamp(1.4rem,3.5vw,2rem)', fontWeight:900, color:'var(--text-primary)' }}>{s.value}</p>
              <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* The Problem */}
      <motion.section initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}>
        <SectionHeader icon={Users} color="#ef4444" bg="rgba(239,68,68,.1)" border="rgba(239,68,68,.2)"
          title="The Problem" subtitle="Fake job scams are destroying lives of young Indians" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1rem', marginTop:'1.25rem' }}>
          {[
            { icon:'💸', title:'Registration Fees',    desc:'Scammers demand ₹499–₹5,000 as "registration" or "training" fees before hiring.' },
            { icon:'🪪', title:'Identity Theft',       desc:'Fake job forms collect Aadhaar, PAN, and bank details for identity fraud.' },
            { icon:'📱', title:'WhatsApp Scams',       desc:'Scam jobs spread rapidly through WhatsApp and Telegram groups with fake offers.' },
            { icon:'🏢', title:'Brand Impersonation',  desc:'Scammers impersonate TCS, Infosys, Amazon using fake websites and emails.' },
          ].map((item,i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:.5 + i*.08, type:'spring', stiffness:280, damping:20 }}
              className="glass-card"
              style={{ borderRadius:18, padding:'1.25rem', display:'flex', flexDirection:'column', gap:10 }}
              whileHover={{ scale:1.05, y:-6 }}
              
            >
              <span style={{ fontSize:28 }}>{item.icon}</span>
              <div>
                <p style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', marginBottom:5 }}>{item.title}</p>
                <p style={{ fontSize:13, lineHeight:1.6, color:'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4 }}>
        <SectionHeader icon={Zap} color="#a78bfa" bg="rgba(124,58,237,.1)" border="rgba(124,58,237,.2)"
          title="How It Works" subtitle="Four simple steps to instant scam detection" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1rem', marginTop:'1.25rem' }}>
          {HOW_IT_WORKS.map((step,i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:.5 + i*.08, type:'spring', stiffness:280, damping:20 }}
              className="glass-card"
              style={{ borderRadius:18, padding:'1.25rem', display:'flex', flexDirection:'column', gap:12, position:'relative', overflow:'hidden' }}
              whileHover={{ scale:1.05, y:-6 }}

            >
              <span style={{ position:'absolute', top:12, right:14, fontSize:28, fontWeight:900, color:'rgba(124,58,237,.12)', lineHeight:1 }}>
                {step.step}
              </span>
              <div style={{ width:38, height:38, borderRadius:10, background:'rgba(124,58,237,.1)', border:'1px solid rgba(124,58,237,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <step.icon size={17} style={{ color:'#a78bfa' }} />
              </div>
              <div>
                <p style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', marginBottom:5 }}>{step.title}</p>
                <p style={{ fontSize:13, lineHeight:1.6, color:'var(--text-secondary)' }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tech stack */}
      <motion.section initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.5 }}>
        <SectionHeader icon={Code2} color="#67e8f9" bg="rgba(6,182,212,.08)" border="rgba(6,182,212,.18)"
          title="Tech Stack" subtitle="Built with modern, production-grade technologies" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'0.875rem', marginTop:'1.25rem' }}>
          {TECH_STACK.map((t,i) => (
            <motion.div key={i}
              initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay:.7 + i*.07 }}
              className="glass-card"
              style={{ borderRadius:16, padding:'1rem', display:'flex', alignItems:'center', gap:10 }}
              whileHover={{ scale:1.03, y:-2 }}
            >
              <span style={{ fontSize:22, flexShrink:0 }}>{t.icon}</span>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{t.name}</p>
                <p style={{ fontSize:11, color:'var(--text-secondary)', marginTop:1 }}>{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.6 }}
        className="glass-card-solid"
        style={{ borderRadius:24, padding:'2rem', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'1.25rem',
          background:'linear-gradient(135deg,rgba(124,58,237,.1),rgba(6,182,212,.08))' }}>
        <div style={{ fontSize:42 }}>🛡️</div>
        <div>
          <h2 style={{ fontSize:'clamp(1.2rem,3vw,1.6rem)', fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>
            Protect yourself today
          </h2>
          <p style={{ fontSize:14, color:'var(--text-primary)', maxWidth:420, margin:'0 auto', lineHeight:1.7 }}>
            Your first job search shouldn't cost you your savings. Check before you apply — it takes 10 seconds.
          </p>
        </div>
        <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 28px', borderRadius:14, fontWeight:700, fontSize:14, textDecoration:'none', background:'linear-gradient(135deg,#7c3aed,#06b6d4)', color:'#fff', boxShadow:'0 0 30px rgba(124,58,237,.4)' }}>
          <Shield size={16} /> Analyze a Job Now
        </a>
      </motion.div>
    </div>
  );
}

function SectionHeader({ icon: Icon, color, bg, border, title, subtitle }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:40, height:40, borderRadius:12, background:bg, border:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon size={17} style={{ color }} />
      </div>
      <div>
        <h2 style={{ fontSize:'clamp(1.1rem,2.5vw,1.35rem)', fontWeight:800, color:'var(--text-primary)' }}>{title}</h2>
        <p style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>{subtitle}</p>
      </div>
    </div>
  );
}