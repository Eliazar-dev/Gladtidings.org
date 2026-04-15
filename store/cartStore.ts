import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (state) => {
        set({ hasHydrated: state })
      },
      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item
              ),
            }
          }
          return { items: [...state.items, { ...product, qty: 1 }] }
        })
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },
      updateQty: (id, qty) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, qty: Math.max(1, qty) } : item
          ),
        }))
      },
      clearCart: () => {
        set({ items: [] })
      },
      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0)
      },
      totalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.qty, 0)
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
