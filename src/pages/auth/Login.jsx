import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import AuthLayout from '@/components/auth/AuthLayout'
import { Input, Button, Divider } from '@/components/ui'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const { signIn } = useAuth()
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await signIn(data)
      toast.success('Welcome back')
      nav('/admin/dashboard')
    } catch (err) {
      toast.error(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your admin account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="admin@company.com"
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
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'Password required' })}
        />

        <div className="flex justify-end">
          <Link to="/auth/forgot" className="font-mono text-xs text-accent hover:text-white transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full justify-center text-center">
          Sign In <ArrowRight size={14} className="ml-2 inline" />
        </Button>

        <Divider label="or" />

        <p className="text-center font-body text-sm text-text-dim">
          New company?{' '}
          <Link to="/auth/register" className="text-accent hover:text-white transition-colors font-medium">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
