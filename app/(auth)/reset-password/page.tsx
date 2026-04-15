'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setTimeout(() => router.push('/account'), 2000)
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: 20 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px 32px', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ fontSize: 56, marginBottom: 18 }}>✅</div>
          <h2 style={{ fontFamily: 'var(--ff-h)', fontSize: 26, color: 'var(--green)', marginBottom: 12 }}>Password Updated!</h2>
          <p style={{ fontSize: 14, color: 'var(--bark)', opacity: 0.65, lineHeight: 1.8 }}>
            Your password has been successfully updated. Redirecting to your account...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: 20 }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: 'var(--green)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px' }}>🔑</div>
          <h1 style={{ fontFamily: 'var(--ff-h)', fontSize: 26, color: 'var(--green)', marginBottom: 4 }}>Set New Password</h1>
          <p style={{ fontSize: 13, color: 'var(--bark)', opacity: 0.55 }}>Enter your new password below</p>
        </div>

        <form onSubmit={handleReset}>
          {[
            { k: 'password', l: 'New Password', p: '••••••••' },
            { k: 'confirm', l: 'Confirm Password', p: '••••••••' },
          ].map(({ k, l, p }) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--green)', display: 'block', marginBottom: 5 }}>{l}</label>
              <input type="password" value={k === 'password' ? password : confirm} onChange={e => k === 'password' ? setPassword(e.target.value) : setConfirm(e.target.value)} required placeholder={p}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none' }}
                onFocus={e => (e.target.style.borderColor = 'var(--green3)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          ))}

          {error && (
            <div style={{ background: '#ffebee', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 7, padding: '10px 13px', fontSize: 13, color: 'var(--red)', marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: 'var(--green)', color: '#fff', border: 'none', padding: '13px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
