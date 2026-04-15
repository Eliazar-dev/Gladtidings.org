"use client"

import { useState, useEffect } from 'react'
import { useToastStore } from '@/store/toastStore'

export default function Toast() {
  const [mounted, setMounted] = useState(false)
  const { toasts, removeToast } = useToastStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getTypeConfig = (type: 'success' | 'error' | 'info' | 'warning') => {
    switch (type) {
      case 'success':
        return { bg: '#e8f5e9', color: '#1b5e20', icon: '✓' }
      case 'error':
        return { bg: '#ffebee', color: '#c62828', icon: '✕' }
      case 'warning':
        return { bg: '#fff3e0', color: '#e65100', icon: '⚠️' }
      case 'info':
      default:
        return { bg: '#e3f2fd', color: '#1565c0', icon: 'ℹ️' }
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {toasts.map((toast) => {
        const config = getTypeConfig(toast.type)
        
        return (
          <div
            key={toast.id}
            style={{
              background: config.bg,
              color: config.color,
              padding: '16px 20px',
              borderRadius: 10,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minWidth: 300,
              maxWidth: 400,
              animation: 'slideInRight 0.32s ease',
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 700 }}>{config.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                opacity: 0.6,
                padding: 4,
                lineHeight: 1,
                transition: 'opacity 0.32s cubic-bezier(0.4,0,0.2,1)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.6'}
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}
