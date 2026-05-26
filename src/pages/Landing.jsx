import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { HelixLogo, Button, Badge } from '@/components/ui'
import { ArrowRight, Zap, Shield, Brain, BarChart3, Users, Mail } from 'lucide-react'

const features = [
  { icon: Brain, label: 'AI-Driven Interviews', desc: 'Dynamic questions that adapt to every answer in real time' },
  { icon: Shield, label: 'Full Proctoring', desc: 'Eye tracking, tab detection, multi-face alerts & copy-paste block' },
  { icon: BarChart3, label: 'Smart Ranking', desc: 'Candidates auto-ranked by knowledge depth across all rounds' },
  { icon: Mail, label: 'Automated Outreach', desc: 'Bulk email scheduling, invites & result notifications' },
  { icon: Users, label: 'Multi-Role Platform', desc: 'Separate dashboards for Admin, HR, and Candidates' },
  { icon: Zap, label: 'Any Industry', desc: 'Medical, Tech, Finance — configure rounds to fit your domain' },
]

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } },
}

export default function LandingPage() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen grid-bg noise-bg relative overflow-hidden">
      <div className="scanline" />

      {/* Ambient glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/3 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-signal/3 blur-[100px] pointer-events-none" />

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-border/50 backdrop-blur-xl bg-void/80">
        <HelixLogo size="md" />
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => nav('/auth/login')}>Sign In</Button>
          <Button onClick={() => nav('/auth/register')}>Get Started <ArrowRight size={14} className="ml-1 inline" /></Button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-28 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Badge label="AI Interview Platform · v1.0" variant="accent" />

          <h1 className="font-display font-extrabold text-text mt-8 mb-6 leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}>
            INTERVIEW
            <br />
            <span className="text-glow text-accent">INTELLIGENCE</span>
            <br />
            REDEFINED
          </h1>

          <p className="font-body text-text-dim text-xl max-w-2xl mx-auto leading-relaxed">
            HELIX MERIDIAN is an end-to-end agentic interview platform — from automated outreach to AI-powered evaluation, proctoring, and ranked selection.
          </p>

          <div className="flex items-center justify-center gap-4 mt-12 flex-wrap">
            <Button onClick={() => nav('/auth/register')} className="text-base px-8 py-4">
              Start for Free <ArrowRight size={16} className="ml-2 inline" />
            </Button>
            <Button variant="ghost" onClick={() => nav('/auth/login')} className="text-base px-8 py-4">
              Admin Login
            </Button>
          </div>
        </motion.div>

        {/* Decorative helix visualization */}
        <motion.div
          className="mt-20 relative mx-auto"
          style={{ width: 500, height: 180 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <svg width="500" height="180" viewBox="0 0 500 180" className="mx-auto opacity-40">
            <defs>
              <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="30%" stopColor="#00d4ff" />
                <stop offset="70%" stopColor="#00ff88" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            {/* Top strand */}
            <path d="M0 90 Q62.5 20 125 90 Q187.5 160 250 90 Q312.5 20 375 90 Q437.5 160 500 90"
              stroke="url(#lg1)" strokeWidth="2" fill="none" />
            {/* Bottom strand */}
            <path d="M0 90 Q62.5 160 125 90 Q187.5 20 250 90 Q312.5 160 375 90 Q437.5 20 500 90"
              stroke="url(#lg1)" strokeWidth="2" fill="none" opacity="0.5" />
            {/* Bridges */}
            {[62.5, 125, 187.5, 250, 312.5, 375, 437.5].map((x, i) => (
              <line key={i} x1={x} y1="50" x2={x} y2="130" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs text-muted tracking-[0.5em] uppercase">Adaptive · Intelligent · Secure</span>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <p className="font-mono text-xs text-accent tracking-[0.4em] uppercase mb-4">Platform Capabilities</p>
            <h2 className="font-display font-bold text-4xl text-text">Built for serious hiring</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={stagger.item}
                className="relative card-panel group hover:border-accent/30 transition-colors duration-300"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/30 group-hover:border-accent transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/30 group-hover:border-accent transition-colors" />
                <f.icon size={20} className="text-accent mb-4 group-hover:text-signal transition-colors" />
                <h3 className="font-display font-semibold text-text mb-2">{f.label}</h3>
                <p className="font-body text-text-dim text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto relative card-panel">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-signal/5 rounded-sm" />
          <div className="relative">
            <h2 className="font-display font-bold text-3xl text-text mb-4">Ready to transform hiring?</h2>
            <p className="text-text-dim mb-8">Join companies using HELIX MERIDIAN to run smarter, faster, fairer interviews.</p>
            <Button onClick={() => nav('/auth/register')} className="text-base px-10 py-4">
              Register Your Company <ArrowRight size={16} className="ml-2 inline" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-8 px-8 flex items-center justify-between">
        <HelixLogo size="sm" />
        <p className="font-mono text-xs text-muted">© 2025 HELIX MERIDIAN. All rights reserved.</p>
      </footer>
    </div>
  )
}
