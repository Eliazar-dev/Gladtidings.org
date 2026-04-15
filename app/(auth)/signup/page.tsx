'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { first_name: form.firstName, last_name: form.lastName, role: 'customer' },
      },
    })

    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
  }

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    if (error) setError(error.message)
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 18 }}>📬</div>
          <h2 className="auth-title">Check Your Email!</h2>
          <p className="auth-sub">
            We&apos;ve sent a confirmation link to <strong>{form.email}</strong>. Please click it to activate your account.
          </p>
          <button onClick={() => router.push('/login')} className="btn-p">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <Image
            src="https://i.postimg.cc/yxV8fW46/LOGO-removebg-preview.png"
            alt="Gladtidings Health"
            width={120}
            height={60}
            unoptimized
            priority
          />
        </div>
        
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join the Gladtidings Health family</p>

        {/* Google OAuth - PRIMARY */}
        <button onClick={handleGoogleAuth} className="google-btn-primary">
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">or sign up with email</span>
          <div className="divider-line" />
        </div>

        <form onSubmit={handleSignup}>
          <div className="fr">
            <div className="fg">
              <label className="fl">First Name</label>
              <input 
                value={form.firstName} 
                onChange={e => set('firstName', e.target.value)} 
                required
                className="fi"
                placeholder="Grace" 
              />
            </div>
            <div className="fg">
              <label className="fl">Last Name</label>
              <input 
                value={form.lastName} 
                onChange={e => set('lastName', e.target.value)} 
                required
                className="fi"
                placeholder="Wanjiru" 
              />
            </div>
          </div>

          <div className="fg">
            <label className="fl">Email</label>
            <input 
              type="email"
              value={form.email} 
              onChange={e => set('email', e.target.value)} 
              required
              className="fi"
              placeholder="grace@email.com" 
            />
          </div>
          <div className="fg">
            <label className="fl">Password</label>
            <input 
              type="password"
              value={form.password} 
              onChange={e => set('password', e.target.value)} 
              required
              className="fi"
              placeholder="••••••••" 
            />
          </div>
          <div className="fg">
            <label className="fl">Confirm Password</label>
            <input 
              type="password"
              value={form.confirm} 
              onChange={e => set('confirm', e.target.value)} 
              required
              className="fi"
              placeholder="••••••••" 
            />
          </div>

          {error && (
            <div className="err-box">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-p btn-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--bark)', opacity: 0.6 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--green3)', fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
