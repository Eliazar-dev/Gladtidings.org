'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: 20 }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{sent ? '📬' : '🔑'}</div>
        <h1 style={{ fontFamily: 'var(--ff-h)', fontSize: 26, color: 'var(--green)', marginBottom: 10 }}>
          {sent ? 'Check Your Email' : 'Reset Password'}
        </h1>
        {sent ? (
          <>
            <p style={{ fontSize: 14, color: 'var(--bark)', opacity: 0.65, lineHeight: 1.8, marginBottom: 20 }}>
              We sent a password reset link to <strong>{email}</strong>.
            </p>
            <Link href="/login" style={{ color: 'var(--green3)', fontWeight: 700, fontSize: 14 }}>← Back to Login</Link>
          </>
        ) : (
          <form onSubmit={handleReset}>
            <p style={{ fontSize: 13, color: 'var(--bark)', opacity: 0.6, marginBottom: 20, lineHeight: 1.7 }}>
              Enter your email and we&apos;ll send you a reset link.
            </p>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="grace@email.com"
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 14 }} />
            {error && <div style={{ fontSize: 13, color: 'var(--red)', marginBottom: 12 }}>{error}</div>}
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: 'var(--green)', color: '#fff', border: 'none', padding: 13, borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div style={{ marginTop: 16 }}>
              <Link href="/login" style={{ color: 'var(--green3)', fontWeight: 600, fontSize: 13 }}>← Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
