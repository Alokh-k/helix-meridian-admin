import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  LayoutDashboard, CreditCard, Users, Settings,
  LogOut, Menu, X, ChevronRight
} from 'lucide-react'
import { HelixLogo, Badge } from '@/components/ui'
import { useAuth } from '@/lib/auth'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/pricing', icon: CreditCard, label: 'Plan & Billing' },
  { to: '/admin/hrs', icon: Users, label: 'HR Management' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout() {
  const { user, company, signOut } = useAuth()
  const nav = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleSignOut = async () => {
    await signOut()
    nav('/auth/login')
  }

  return (
    <div className="min-h-screen flex bg-void">
      {/* ── SIDEBAR ── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative flex-shrink-0 border-r border-border bg-surface flex flex-col overflow-hidden"
      >
        {/* Logo area */}
        <div className="h-16 flex items-center px-4 border-b border-border flex-shrink-0">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div key="logo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <HelixLogo size="sm" />
              </motion.div>
            ) : (
              <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <HelixLogo size="sm" showText={false} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-sm font-display text-sm font-medium transition-all duration-200 group relative',
              isActive
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-text-dim hover:text-text hover:bg-panel border border-transparent'
            )}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent rounded-r"
                    />
                  )}
                  <Icon size={16} className="flex-shrink-0" />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Company info + logout */}
        <div className="border-t border-border p-3 space-y-2">
          {sidebarOpen && company && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-2 py-2"
            >
              <p className="font-display font-semibold text-sm text-text truncate">{company.name}</p>
              <Badge label={company.plan || 'starter'} variant="accent" />
            </motion.div>
          )}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-muted hover:text-warn hover:bg-warn/5 transition-all duration-200 font-display text-sm"
          >
            <LogOut size={16} className="flex-shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(s => !s)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-panel border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-all z-10"
        >
          <motion.div animate={{ rotate: sidebarOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronRight size={12} />
          </motion.div>
        </button>
      </motion.aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-surface/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
            <span className="font-mono text-xs text-muted tracking-widest uppercase">Admin Console</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted">{user?.email}</span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 grid-bg">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
