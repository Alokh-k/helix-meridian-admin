import { motion } from 'framer-motion'
import { Users, CreditCard, Activity, TrendingUp, ArrowUpRight } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { PageMotion, Badge, CornerDots } from '@/components/ui'

const stats = [
  { label: 'Total HRs', value: '—', icon: Users, trend: null, color: 'accent' },
  { label: 'Active Interviews', value: '—', icon: Activity, trend: null, color: 'signal' },
  { label: 'Candidates Processed', value: '—', icon: TrendingUp, trend: null, color: 'accent' },
  { label: 'Current Plan', value: '—', icon: CreditCard, trend: null, color: 'warn' },
]

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
}

export default function Dashboard() {
  const { company } = useAuth()

  const displayStats = [
    { ...stats[0], value: company?.max_hrs ?? '—' },
    { ...stats[1], value: '0' },
    { ...stats[2], value: '0' },
    { ...stats[3], value: company?.plan?.toUpperCase() ?? 'STARTER' },
  ]

  return (
    <PageMotion>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="font-mono text-xs text-accent tracking-[0.3em] uppercase mb-2">Overview</p>
          <h1 className="font-display font-bold text-3xl text-text">
            {company?.name ?? 'Dashboard'}
          </h1>
          <p className="text-text-dim text-sm mt-1">Your interview platform at a glance</p>
        </div>

        {/* Stats */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {displayStats.map((s, i) => (
            <motion.div
              key={i}
              variants={stagger.item}
              className="relative card-panel group"
            >
              <CornerDots />
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-sm border flex items-center justify-center ${
                  s.color === 'accent' ? 'border-accent/30 bg-accent/5 text-accent' :
                  s.color === 'signal' ? 'border-signal/30 bg-signal/5 text-signal' :
                  'border-warn/30 bg-warn/5 text-warn'
                }`}>
                  <s.icon size={16} />
                </div>
                <ArrowUpRight size={14} className="text-muted group-hover:text-accent transition-colors" />
              </div>
              <p className="font-display font-bold text-2xl text-text mb-1">{s.value}</p>
              <p className="font-mono text-xs text-muted tracking-wider uppercase">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-panel relative">
            <CornerDots />
            <h3 className="font-display font-semibold text-text mb-1">Quick Setup</h3>
            <p className="text-text-dim text-sm mb-4">Get your platform ready in 3 steps</p>
            <div className="space-y-3">
              {[
                { step: '01', label: 'Set your plan', done: !!company?.plan, link: '/admin/pricing' },
                { step: '02', label: 'Add HR accounts', done: false, link: '/admin/hrs' },
                { step: '03', label: 'Configure interviews', done: false, link: '/admin/settings' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-sm border border-border hover:border-accent/30 transition-colors cursor-pointer group">
                  <span className={`font-mono text-xs ${item.done ? 'text-signal' : 'text-muted'}`}>{item.step}</span>
                  <span className={`font-body text-sm flex-1 ${item.done ? 'line-through text-muted' : 'text-text'}`}>{item.label}</span>
                  <ArrowUpRight size={13} className="text-muted group-hover:text-accent transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="card-panel relative">
            <CornerDots />
            <h3 className="font-display font-semibold text-text mb-1">System Status</h3>
            <p className="text-text-dim text-sm mb-4">All services operational</p>
            <div className="space-y-3">
              {[
                { svc: 'AI Interview Engine', status: 'operational' },
                { svc: 'Proctoring System', status: 'operational' },
                { svc: 'Email Service', status: 'operational' },
                { svc: 'Resume Parser', status: 'operational' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="font-body text-sm text-text-dim">{s.svc}</span>
                  <Badge label={s.status} variant="active" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageMotion>
  )
}
