"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminGatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const correctPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'gladtidings2025'

    if (passcode === correctPasscode) {
      // Set session cookie
      document.cookie = 'admin-passcode=valid; path=/; max-age=3600'
      // Redirect to the intended destination or default to /admin
      const redirectTo = searchParams.get('redirect') || '/admin'
      router.push(redirectTo)
    } else {
      setError('Invalid passcode')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--green)',
      padding: 20
    }}>
      <div style={{
        background: 'white',
        padding: 40,
        borderRadius: 16,
        maxWidth: 400,
        width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <h1 style={{
            fontFamily: 'var(--ff-h)',
            fontSize: 24,
            color: 'var(--green)',
            marginBottom: 8
          }}>Admin Access</h1>
          <p style={{ fontSize: 14, color: 'var(--bark)', opacity: 0.7 }}>
            Enter passcode to access admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              style={{
                width: '100%',
                padding: 12,
                border: '1.5px solid rgba(0,0,0,0.1)',
                borderRadius: 8,
                fontSize: 16,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--green)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
              autoFocus
            />
          </div>

          {error && (
            <div style={{
              color: 'var(--red)',
              fontSize: 13,
              marginBottom: 16,
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 12,
              background: 'var(--green)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'var(--green2)')}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--green)'}
          >
            {loading ? 'Verifying...' : 'Access Admin Panel'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--green3)',
              fontSize: 13,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Back to Website
          </button>
        </div>
      </div>
    </div>
  )
}
