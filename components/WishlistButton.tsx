import React, { useEffect, useState } from 'react'
import { useWishlistStore } from '@/store/wishlistStore'
import type { Product } from '@/types'

interface WishlistButtonProps {
  product: Product
  className?: string
  style?: React.CSSProperties
}

export default function WishlistButton({ product, className = '', style }: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false)
  const { addItem, removeItem, isInWishlist, hasHydrated } = useWishlistStore()
  const isWishlisted = isInWishlist(product.id)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !hasHydrated) {
    return (
      <button
        className={className}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 8,
          cursor: 'pointer',
          transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        <span style={{ fontSize: 20, color: 'var(--bark)' }}>
          🤍
        </span>
      </button>
    )
  }

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  return (
    <button
      onClick={toggleWishlist}
      className={className}
      style={{
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 8,
        cursor: 'pointer',
        transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <span style={{ fontSize: 20, color: isWishlisted ? 'var(--red)' : 'var(--bark)' }}>
        {isWishlisted ? '❤️' : '🤍'}
      </span>
    </button>
  )
}
