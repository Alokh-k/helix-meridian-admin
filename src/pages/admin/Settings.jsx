import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Building2, Globe, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { PageMotion, Input, Select, Button, CornerDots } from '@/components/ui'

const INDUSTRIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare / Medical' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'legal', label: 'Legal' },
  { value: 'other', label: 'Other' },
]

export default function Settings() {
  const { company } = useAuth()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (company) reset({ name: company.name, industry: company.industry })
  }, [company])

  const save = async (data) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('companies')
        .update({ name: data.name, industry: data.industry })
        .eq('id', company.id)
      if (error) throw error
      toast.success('Settings saved')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageMotion>
      <div className="space-y-8 max-w-2xl">
        <div>
          <p className="font-mono text-xs text-accent tracking-[0.3em] uppercase mb-2">Configuration</p>
          <h1 className="font-display font-bold text-3xl text-text">Settings</h1>
          <p className="text-text-dim text-sm mt-1">Manage your company profile</p>
        </div>

        <div className="relative card-panel">
          <CornerDots />
          <h2 className="font-display font-semibold text-text mb-6 flex items-center gap-2">
            <Building2 size={16} className="text-accent" /> Company Details
          </h2>
          <form onSubmit={handleSubmit(save)} className="space-y-5">
            <Input
              label="Company Name"
              icon={Building2}
              error={errors.name?.message}
              {...register('name', { required: 'Required' })}
            />
            <Select
              label="Industry"
              options={INDUSTRIES}
              {...register('industry')}
            />
            <div className="pt-2">
              <Button type="submit" loading={loading} className="flex items-center gap-2">
                <Save size={14} /> Save Changes
              </Button>
            </div>
          </form>
        </div>

        <div className="relative card-panel">
          <CornerDots />
          <h2 className="font-display font-semibold text-text mb-4 flex items-center gap-2">
            <Globe size={16} className="text-accent" /> Environment Info
          </h2>
          <div className="space-y-3 font-mono text-sm">
            {[
              { key: 'Platform', val: 'HELIX MERIDIAN v1.0' },
              { key: 'Company ID', val: company?.id?.slice(0, 8) + '...' ?? '—' },
              { key: 'Plan', val: company?.plan?.toUpperCase() ?? '—' },
              { key: 'Max Candidates', val: company?.max_candidates ?? '—' },
            ].map((r, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-muted">{r.key}</span>
                <span className="text-text">{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageMotion>
  )
}
