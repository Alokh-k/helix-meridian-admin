import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Building2, Rocket } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { PageMotion, Button, Badge, CornerDots } from '@/components/ui'

const PLAN_ICONS = { starter: Rocket, growth: Zap, enterprise: Building2 }
const PLAN_COLORS = {
  starter: { border: 'border-border', accent: 'text-text-dim', btn: 'ghost' },
  growth: { border: 'border-accent/40', accent: 'text-accent', btn: 'primary' },
  enterprise: { border: 'border-signal/30', accent: 'text-signal', btn: 'ghost' },
}

export default function PricingPage() {
  const { company } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [selecting, setSelecting] = useState(null)

  useEffect(() => {
    supabase.from('plans').select('*').then(({ data }) => setPlans(data ?? []))
  }, [])

  const selectPlan = async (planId) => {
    if (planId === company?.plan) return
    try {
      setSelecting(planId)
      const { error } = await supabase
        .from('companies')
        .update({ plan: planId })
        .eq('id', company.id)
      if (error) throw error
      toast.success(`Switched to ${planId} plan`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSelecting(null)
    }
  }

  return (
    <PageMotion>
      <div className="space-y-8">
        <div>
          <p className="font-mono text-xs text-accent tracking-[0.3em] uppercase mb-2">Billing</p>
          <h1 className="font-display font-bold text-3xl text-text">Plan & Pricing</h1>
          <p className="text-text-dim text-sm mt-1">Choose the plan that fits your hiring scale</p>
        </div>

        {company?.plan && (
          <div className="flex items-center gap-3 p-4 border border-accent/20 bg-accent/5 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-sm text-accent">
              Current plan: <strong className="uppercase">{company.plan}</strong>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => {
            const Icon = PLAN_ICONS[plan.id] || Zap
            const colors = PLAN_COLORS[plan.id] || PLAN_COLORS.starter
            const isActive = company?.plan === plan.id
            const features = Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features || '[]')

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative card-panel border ${colors.border} flex flex-col ${plan.is_popular ? 'glow-accent' : ''}`}
              >
                <CornerDots />
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge label="Most Popular" variant="accent" />
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon size={18} className={colors.accent} />
                    <span className={`font-display font-bold text-sm uppercase tracking-widest ${colors.accent}`}>
                      {plan.name}
                    </span>
                    {isActive && <Badge label="Active" variant="active" />}
                  </div>

                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-display font-extrabold text-4xl text-text">
                      ${plan.price_monthly}
                    </span>
                    <span className="font-mono text-muted text-sm mb-1">/month</span>
                  </div>
                  {plan.price_monthly === 0 && (
                    <p className="font-mono text-xs text-signal">Free forever</p>
                  )}
                </div>

                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="font-body text-sm text-text-dim">Max candidates</span>
                    <span className="font-mono text-sm text-text">
                      {plan.max_candidates >= 99999 ? 'Unlimited' : plan.max_candidates}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="font-body text-sm text-text-dim">HR accounts</span>
                    <span className="font-mono text-sm text-text">
                      {plan.max_hrs >= 99999 ? 'Unlimited' : plan.max_hrs}
                    </span>
                  </div>
                  {features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2 py-1">
                      <Check size={13} className="text-signal flex-shrink-0" />
                      <span className="font-body text-sm text-text-dim">{f}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={colors.btn}
                  onClick={() => selectPlan(plan.id)}
                  loading={selecting === plan.id}
                  disabled={isActive}
                  className="w-full justify-center"
                >
                  {isActive ? 'Current Plan' : `Choose ${plan.name}`}
                </Button>
              </motion.div>
            )
          })}
        </div>

        <div className="card-panel">
          <p className="font-mono text-xs text-muted text-center tracking-wider">
            All plans include core interview features. Upgrade anytime. No contracts. Cancel anytime.
          </p>
        </div>
      </div>
    </PageMotion>
  )
}
