import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface WishlistItem {
  id: number
  name: string
  price: number
  img: string
  cat?: string
}

interface WishlistStore {
  items: WishlistItem[]
  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  addItem: (item: WishlistItem) => void
  removeItem: (id: number) => void
  isInWishlist: (id: number) => boolean
  clearWishlist: () => void
  totalItems: number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (state) => {
        set({ hasHydrated: state })
      },
      
      addItem: (item) => {
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id)
          if (exists) return state
          return { items: [...state.items, item] }
        })
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },
      
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id)
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
      
      get totalItems() {
        return get().items.length
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
