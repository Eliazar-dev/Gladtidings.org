"use client"

import { useState, useEffect } from 'react'

export default function ScrollToTopButton() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted || !visible) return null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: '#fff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        color: 'var(--green)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 998,
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
      title="Scroll to top"
    >
      ↑
    </button>
  )
}
