import { motion } from 'framer-motion'
import { clsx } from 'clsx'

// ─── LOGO ───────────────────────────────────────────────────────────────────
export function HelixLogo({ size = 'md', showText = true }) {
  const sizes = { sm: 28, md: 36, lg: 48 }
  const s = sizes[size]
  return (
    <div className="flex items-center gap-3">
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className="helix-icon flex-shrink-0">
        <defs>
          <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#00ff88" />
          </linearGradient>
        </defs>
        {/* DNA Helix strands */}
        <path d="M14 6 Q24 14 14 22 Q24 30 14 38 Q24 46 34 42" stroke="url(#hg1)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M34 6 Q24 14 34 22 Q24 30 34 38 Q24 46 14 42" stroke="url(#hg1)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
        {/* Cross bridges */}
        <line x1="14" y1="14" x2="34" y2="14" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6"/>
        <line x1="14" y1="22" x2="34" y2="22" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6"/>
        <line x1="14" y1="30" x2="34" y2="30" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6"/>
        {/* Node dots */}
        <circle cx="14" cy="14" r="2.5" fill="#00d4ff"/>
        <circle cx="34" cy="22" r="2.5" fill="#00ff88"/>
        <circle cx="14" cy="30" r="2.5" fill="#00d4ff"/>
      </svg>
      {showText && (
        <div>
          <div className="font-display font-bold text-text leading-none tracking-widest" style={{ fontSize: size === 'lg' ? 20 : size === 'md' ? 16 : 13 }}>
            HELIX
          </div>
          <div className="font-mono text-accent leading-none tracking-[0.3em]" style={{ fontSize: size === 'lg' ? 10 : 8 }}>
            MERIDIAN
          </div>
        </div>
      )}
    </div>
  )
}

// ─── BUTTON ─────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', className, loading, disabled, ...props }) {
  return (
    <button
      className={clsx(
        variant === 'primary' ? 'btn-primary' : 'btn-ghost',
        (loading || disabled) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Processing...
        </span>
      ) : children}
    </button>
  )
}

// ─── INPUT ───────────────────────────────────────────────────────────────────
export function Input({ label, error, icon: Icon, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block font-mono text-xs text-text-dim uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <Icon size={15} />
          </div>
        )}
        <input
          className={clsx('input-field', Icon && 'pl-10', error && 'border-warn')}
          {...props}
        />
      </div>
      {error && <p className="font-mono text-xs text-warn">{error}</p>}
    </div>
  )
}

// ─── SELECT ──────────────────────────────────────────────────────────────────
export function Select({ label, error, options = [], ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block font-mono text-xs text-text-dim uppercase tracking-widest">
          {label}
        </label>
      )}
      <select
        className={clsx('input-field appearance-none cursor-pointer', error && 'border-warn')}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-surface">
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="font-mono text-xs text-warn">{error}</p>}
    </div>
  )
}

// ─── STATUS BADGE ────────────────────────────────────────────────────────────
export function Badge({ label, variant = 'default' }) {
  const variants = {
    default: 'border-border text-text-dim',
    active: 'border-signal text-signal bg-signal/5',
    warn: 'border-warn text-warn bg-warn/5',
    accent: 'border-accent text-accent bg-accent/5',
  }
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 border font-mono text-xs px-2.5 py-1 tracking-widest uppercase',
      variants[variant]
    )}>
      <span className={clsx(
        'w-1.5 h-1.5 rounded-full',
        variant === 'active' ? 'bg-signal animate-pulse' :
        variant === 'warn' ? 'bg-warn' :
        variant === 'accent' ? 'bg-accent' : 'bg-muted'
      )} />
      {label}
    </span>
  )
}

// ─── DIVIDER ─────────────────────────────────────────────────────────────────
export function Divider({ label }) {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex-1 h-px bg-border" />
      {label && <span className="font-mono text-xs text-muted tracking-widest">{label}</span>}
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

// ─── PAGE TRANSITION ─────────────────────────────────────────────────────────
export function PageMotion({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

// ─── CORNER DECORATOR ────────────────────────────────────────────────────────
export function CornerDots() {
  return (
    <>
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/40" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/40" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-accent/40" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent/40" />
    </>
  )
}
