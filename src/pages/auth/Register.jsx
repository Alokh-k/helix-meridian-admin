import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Mail, Lock, Globe, ArrowRight, Check } from 'lucide-react'
import AuthLayout from '@/components/auth/AuthLayout'
import { Input, Select, Button } from '@/components/ui'
import { useAuth } from '@/lib/auth'

const INDUSTRIES = [
  { value: '', label: 'Select industry...' },
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

const steps = ['Company', 'Account', 'Done']

export default function RegisterPage() {
  const { signUp } = useAuth()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm()

  const nextStep = async () => {
    const fields = step === 0 ? ['companyName', 'industry'] : ['email', 'password']
    const ok = await trigger(fields)
    if (ok) setStep(s => s + 1)
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await signUp(data)
      setStep(2)
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={step === 2 ? 'Account Created' : 'Create Company Account'}
      subtitle={
        step === 0 ? 'Tell us about your company' :
        step === 1 ? 'Set up your admin credentials' :
        'Check your email to verify'
      }
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs transition-all duration-300 ${
              i < step ? 'bg-signal border-signal text-void' :
              i === step ? 'border-accent text-accent' :
              'border-border text-muted'
            }`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <span className={`font-mono text-xs tracking-wider ${i <= step ? 'text-text-dim' : 'text-muted'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-px transition-colors ${i < step ? 'bg-signal' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <Input
                label="Company Name"
                icon={Building2}
                placeholder="Acme Corp"
                error={errors.companyName?.message}
                {...register('companyName', { required: 'Company name required' })}
              />
              <Select
                label="Industry"
                options={INDUSTRIES}
                error={errors.industry?.message}
                {...register('industry', { required: 'Select an industry' })}
              />
              <Button type="button" onClick={nextStep} className="w-full justify-center">
                Continue <ArrowRight size={14} className="ml-2 inline" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <Input
                label="Admin Email"
                icon={Mail}
                type="email"
                placeholder="you@company.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                })}
              />
              <Input
                label="Password"
                icon={Lock}
                type="password"
                placeholder="Min. 8 characters"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password required',
                  minLength: { value: 8, message: 'Min. 8 characters' },
                })}
              />
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setStep(0)} className="flex-1 justify-center">
                  Back
                </Button>
                <Button type="submit" loading={loading} className="flex-1 justify-center">
                  Create Account
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full border border-signal bg-signal/10 flex items-center justify-center mx-auto glow-signal">
                <Check size={28} className="text-signal" />
              </div>
              <div>
                <p className="text-text-dim text-sm">
                  We've sent a verification link to your email. Click it to activate your account.
                </p>
              </div>
              <Button onClick={() => nav('/auth/login')} className="w-full justify-center">
                Go to Login <ArrowRight size={14} className="ml-2 inline" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {step < 2 && (
        <p className="text-center font-body text-sm text-text-dim mt-6">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-accent hover:text-white transition-colors font-medium">
            Sign in
          </Link>
        </p>
      )}
    </AuthLayout>
  )
}
