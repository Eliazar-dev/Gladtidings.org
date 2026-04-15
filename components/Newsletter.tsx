import React, { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSubscribed(true)
    setEmail("")
  }

  if (subscribed) {
    return (
      <div style={{
        background: 'var(--mist)',
        borderRadius: 12,
        padding: 24,
        textAlign: 'center',
        border: '1px solid var(--green)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--green)', marginBottom: 8 }}>
          Successfully Subscribed!
        </div>
        <div style={{ fontSize: 14, color: 'var(--bark)', opacity: 0.7 }}>
          Thank you for joining our newsletter. You'll receive updates on our latest products and health tips.
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--green)',
      borderRadius: 16,
      padding: 40,
      textAlign: 'center',
      color: '#fff',
    }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>📧</div>
      <h2 style={{
        fontFamily: 'var(--ff-h)',
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 12,
        color: '#fff',
      }}>
        Subscribe to Our Newsletter
      </h2>
      <p style={{
        fontSize: 16,
        opacity: 0.9,
        marginBottom: 24,
        maxWidth: 500,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        Get exclusive offers, health tips, and be the first to know about new natural remedies.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, maxWidth: 450, margin: '0 auto' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            flex: 1,
            padding: '14px 18px',
            borderRadius: 8,
            fontSize: 15,
            border: 'none',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 28px',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: '#fff',
            color: 'var(--green)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 16 }}>
        By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
      </div>
    </div>
  )
}
