"use client"

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hasConsented = localStorage.getItem('cookie_consent')
    if (!hasConsented) {
      setVisible(true)
    }
  }, [])

  if (!mounted || !visible) return null

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(34, 139, 34, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '20px 24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ fontSize: 14, color: '#fff', maxWidth: 600, lineHeight: 1.5 }}>
        <strong style={{ display: 'block', marginBottom: 4 }}>🍪 We use cookies</strong>
        We use cookies to enhance your experience. By continuing to browse, you consent to our use of cookies.{' '}
        <a href="/privacy" style={{ color: '#fff', textDecoration: 'underline' }}>
          Privacy Policy
        </a>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleDecline}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'transparent',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            border: 'none',
            background: '#84cc16',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background 0.32s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          Accept All ✓
        </button>
      </div>
    </div>
  )
}
