import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { KES } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

interface Product {
  id: number
  name: string
  price: number
  img: string
  cat?: string
  desc?: string
  badge?: string | null
  stock?: number
}

interface ProductQuickViewProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [mounted, setMounted] = useState(false)
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem, isInWishlist, hasHydrated } = useWishlistStore()
  const [quantity, setQuantity] = useState(1)
  const isWishlisted = isInWishlist(product.id)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    onClose()
  }

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeItem(product.id)
    } else {
      addToWishlist(product)
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          width: '100%',
          maxWidth: 900,
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'scaleIn 0.25s ease',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 24,
            color: 'var(--bark)',
            opacity: 0.4,
            cursor: 'pointer',
            transition: 'opacity 0.32s cubic-bezier(0.4,0,0.2,1)',
            lineHeight: 1,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
        >
          ✕
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Image */}
          <div style={{ position: 'relative', width: '100%', height: 400, marginBottom: 16 }}>
            <Image
              src={product.img}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-lg"
              unoptimized
            />
            {product.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  background: 'var(--green)',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div>
            {product.cat && (
              <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700, marginBottom: 8 }}>
                {product.cat}
              </div>
            )}

            <h2
              style={{
                fontFamily: 'var(--ff-h)',
                fontSize: 28,
                color: 'var(--green)',
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              {product.name}
            </h2>

            <div
              style={{
                fontFamily: 'var(--ff-h)',
                fontSize: 32,
                color: 'var(--gold)',
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              {KES(product.price)}
            </div>

            {product.desc && (
              <p
                style={{
                  fontSize: 15,
                  color: 'var(--bark)',
                  opacity: 0.7,
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                {product.desc}
              </p>
            )}

            {product.stock !== undefined && (
              <div style={{ fontSize: 13, color: 'var(--bark)', opacity: 0.6, marginBottom: 20 }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--bark)',
                  marginBottom: 8,
                }}
              >
                Quantity
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    fontSize: 20,
                    cursor: 'pointer',
                    transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  −
                </button>
                <div
                  style={{
                    width: 60,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                  }}
                >
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    fontSize: 20,
                    cursor: 'pointer',
                    transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 2,
                  padding: '14px 28px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  border: 'none',
                  background: 'var(--green)',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'background 0.32s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                Add to Cart
              </button>
              <button
                onClick={toggleWishlist}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  border: '1px solid var(--border)',
                  background: isWishlisted ? 'var(--red)' : 'transparent',
                  color: isWishlisted ? '#fff' : 'var(--bark)',
                  cursor: 'pointer',
                  transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
                }}
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Features */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>🌿</span>
                <span style={{ fontSize: 13, color: 'var(--bark)', opacity: 0.7 }}>100% Natural</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>📦</span>
                <span style={{ fontSize: 13, color: 'var(--bark)', opacity: 0.7 }}>Fast Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>✓</span>
                <span style={{ fontSize: 13, color: 'var(--bark)', opacity: 0.7 }}>Quality Assured</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>💚</span>
                <span style={{ fontSize: 13, color: 'var(--bark)', opacity: 0.7 }}>Herbal Blend</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
