import React, { useEffect, useState } from 'react'

export interface ToastMessage {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface ToastProps {
  toasts: ToastMessage[]
  removeToast: (id: number) => void
}

export default function Toast({ toasts, removeToast }: ToastProps) {
  const [visibleToasts, setVisibleToasts] = useState<Set<number>>(new Set())

  useEffect(() => {
    toasts.forEach(toast => {
      if (!visibleToasts.has(toast.id)) {
        setVisibleToasts(prev => new Set(prev).add(toast.id))
        
        const duration = toast.duration || 4000
        const timer = setTimeout(() => {
          removeToast(toast.id)
          setVisibleToasts(prev => {
            const next = new Set(prev)
            next.delete(toast.id)
            return next
          })
        }, duration)

        return () => clearTimeout(timer)
      }
    })
  }, [toasts, visibleToasts, removeToast])

  const getTypeConfig = (type: ToastMessage['type']) => {
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
      {toasts.map(toast => {
        const config = getTypeConfig(toast.type)
        const isVisible = visibleToasts.has(toast.id)
        
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
              animation: isVisible ? 'slideInRight 0.32s ease' : 'slideOutRight 0.32s ease',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
              transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
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

// Hook to manage toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [nextId, setNextId] = useState(0)

  const showToast = (
    message: string,
    type: ToastMessage['type'] = 'info',
    duration?: number
  ) => {
    const id = nextId
    setNextId(prev => prev + 1)
    setToasts(prev => [...prev, { id, message, type, duration }])
    return id
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const success = (message: string, duration?: number) => showToast(message, 'success', duration)
  const error = (message: string, duration?: number) => showToast(message, 'error', duration)
  const warning = (message: string, duration?: number) => showToast(message, 'warning', duration)
  const info = (message: string, duration?: number) => showToast(message, 'info', duration)

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
