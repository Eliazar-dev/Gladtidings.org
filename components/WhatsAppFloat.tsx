import React, { useState, useEffect } from 'react'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    window.open('https://wa.me/254700123456', '_blank')
  }

  if (!visible) return null

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: isMobile ? 16 : 28,
        right: isMobile ? 16 : 28,
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: '#25D366',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.45)',
        transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 1000,
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
      title="Chat with us on WhatsApp"
    >
      <WhatsAppIcon size={30} color="#fff" />
    </button>
  )
}
