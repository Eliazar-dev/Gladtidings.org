import { create } from 'zustand'

export interface ToastMessage {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface ToastStore {
  toasts: ToastMessage[]
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => number
  removeToast: (id: number) => void
  success: (message: string, duration?: number) => number
  error: (message: string, duration?: number) => number
  warning: (message: string, duration?: number) => number
  info: (message: string, duration?: number) => number
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  
  showToast: (message, type = 'info', duration) => {
    const id = Date.now()
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }))
    
    const toastDuration = duration || 4000
    setTimeout(() => {
      get().removeToast(id)
    }, toastDuration)
    
    return id
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
  
  success: (message, duration) => get().showToast(message, 'success', duration),
  error: (message, duration) => get().showToast(message, 'error', duration),
  warning: (message, duration) => get().showToast(message, 'warning', duration),
  info: (message, duration) => get().showToast(message, 'info', duration),
}))
