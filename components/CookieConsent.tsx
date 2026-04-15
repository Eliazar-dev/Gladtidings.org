import React, { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie-consent')
    if (!hasConsented) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const handleDismiss = () => {
    setDismissed(true)
    setTimeout(() => setVisible(false), 300)
  }

  if (!visible || dismissed) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        right: 24,
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
        background: '#fff',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        zIndex: 1000,
        animation: 'slideUp 0.32s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ fontSize: 15, color: 'var(--bark)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--green)', marginBottom: 4, display: 'block' }}>
          🍪 We use cookies
        </strong>
        We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. By continuing to browse, you consent to our use of cookies.
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          onClick={handleDismiss}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            border: '1px solid var(--border)',
            background: 'transparent',
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
            background: 'var(--green)',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background 0.32s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          Accept All
        </button>
      </div>
    </div>
  )
}
