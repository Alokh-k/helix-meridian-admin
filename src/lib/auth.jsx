import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchCompany(session.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchCompany(session.user)
      else setCompany(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchCompany(user) {
    const companyId = user.user_metadata?.company_id
    if (!companyId) return
    const { data } = await supabase.from('companies').select('*').eq('id', companyId).single()
    setCompany(data)
  }

  async function signUp({ email, password, companyName, industry }) {
    // 1. Create company row first
    const { data: comp, error: compErr } = await supabase
      .from('companies')
      .insert({ name: companyName, email, industry, plan: 'starter' })
      .select()
      .single()
    if (compErr) throw compErr

    // 2. Create auth user with company_id in metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { company_id: comp.id, role: 'admin', name: companyName } },
    })
    if (error) throw error
    return data
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    setCompany(null)
  }

  return (
    <AuthContext.Provider value={{ user, company, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
