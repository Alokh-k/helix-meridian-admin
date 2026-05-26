import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Trash2, Mail, User, X, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { PageMotion, Button, Input, Badge, CornerDots } from '@/components/ui'

export default function HRManagement() {
  const { company, user } = useAuth()
  const [hrs, setHrs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (company?.id) fetchHrs()
  }, [company])

  const fetchHrs = async () => {
    const { data } = await supabase
      .from('hrs')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })
    setHrs(data ?? [])
  }

  const addHR = async (data) => {
    try {
      setLoading(true)
      // Invite HR via Supabase Auth (they'll receive an email)
      const { data: authData, error: authErr } = await supabase.auth.admin.inviteUserByEmail(data.email, {
        data: { company_id: company.id, role: 'hr', name: data.name }
      })
      // Fallback: just insert into hrs table (user accepts invite separately)
      const { error } = await supabase.from('hrs').insert({
        company_id: company.id,
        name: data.name,
        email: data.email,
      })
      if (error) throw error
      toast.success(`Invite sent to ${data.email}`)
      reset()
      setShowModal(false)
      fetchHrs()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteHR = async (id) => {
    try {
      setDeleting(id)
      const { error } = await supabase.from('hrs').delete().eq('id', id)
      if (error) throw error
      setHrs(prev => prev.filter(h => h.id !== id))
      toast.success('HR removed')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(null)
    }
  }

  const canAddMore = !company?.max_hrs || hrs.length < company.max_hrs

  return (
    <PageMotion>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-accent tracking-[0.3em] uppercase mb-2">Team</p>
            <h1 className="font-display font-bold text-3xl text-text">HR Management</h1>
            <p className="text-text-dim text-sm mt-1">
              {hrs.length} / {company?.max_hrs >= 99999 ? '∞' : company?.max_hrs ?? '—'} HR accounts
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            disabled={!canAddMore}
            className="flex items-center gap-2"
          >
            <Plus size={15} /> Add HR
          </Button>
        </div>

        {/* HR List */}
        {hrs.length === 0 ? (
          <div className="card-panel text-center py-16">
            <Shield size={32} className="text-muted mx-auto mb-4" />
            <p className="font-display text-text-dim">No HR accounts yet</p>
            <p className="font-body text-sm text-muted mt-1">Add your first HR to start managing interviews</p>
          </div>
        ) : (
          <div className="space-y-3">
            {hrs.map((hr, i) => (
              <motion.div
                key={hr.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative card-panel flex items-center gap-4 group"
              >
                <CornerDots />
                <div className="w-10 h-10 rounded-sm border border-accent/20 bg-accent/5 flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-accent text-sm">
                    {hr.name?.charAt(0)?.toUpperCase() ?? 'H'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-medium text-text">{hr.name}</p>
                  <p className="font-mono text-xs text-muted">{hr.email}</p>
                </div>
                <Badge label={hr.role || 'hr'} variant="default" />
                <p className="font-mono text-xs text-muted hidden md:block">
                  {new Date(hr.created_at).toLocaleDateString()}
                </p>
                <button
                  onClick={() => deleteHR(hr.id)}
                  disabled={deleting === hr.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-warn p-1"
                >
                  <Trash2 size={15} />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add HR Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-void/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={e => e.target === e.currentTarget && setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="relative helix-border rounded-sm p-8 w-full max-w-md"
              >
                <CornerDots />
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-xl text-text">Add HR Account</h2>
                  <button onClick={() => setShowModal(false)} className="text-muted hover:text-text transition-colors">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(addHR)} className="space-y-5">
                  <Input
                    label="Full Name"
                    icon={User}
                    placeholder="Jane Smith"
                    error={errors.name?.message}
                    {...register('name', { required: 'Name required' })}
                  />
                  <Input
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    placeholder="hr@company.com"
                    error={errors.email?.message}
                    {...register('email', {
                      required: 'Email required',
                      pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                    })}
                  />
                  <p className="font-mono text-xs text-muted">
                    An invitation email will be sent. HR can set their own password.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1 justify-center">
                      Cancel
                    </Button>
                    <Button type="submit" loading={loading} className="flex-1 justify-center">
                      Send Invite
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageMotion>
  )
}
