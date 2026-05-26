import { motion } from 'framer-motion'
import { HelixLogo, CornerDots } from '@/components/ui'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen grid-bg noise-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-accent/4 blur-[100px] pointer-events-none" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-md"
      >
        <div className="relative helix-border rounded-sm p-8 md:p-10">
          <CornerDots />

          {/* Logo */}
          <div className="flex justify-center mb-10">
            <HelixLogo size="lg" />
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="font-display font-bold text-2xl text-text mb-2">{title}</h1>
            {subtitle && <p className="font-body text-text-dim text-sm">{subtitle}</p>}
          </div>

          {children}
        </div>

        {/* Bottom status line */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
          <span className="font-mono text-xs text-muted tracking-widest">SECURE CONNECTION · AES-256</span>
        </div>
      </motion.div>
    </div>
  )
}
