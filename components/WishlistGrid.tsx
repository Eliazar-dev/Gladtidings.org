import React from 'react'
import { useWishlistStore } from '@/store/wishlistStore'
import { KES } from '@/lib/utils'

export default function WishlistGrid() {
  const { items, removeItem, clearWishlist } = useWishlistStore()

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.3 }}>❤️</div>
        <div style={{ fontSize: 16, color: 'var(--bark)', opacity: 0.6, marginBottom: 16 }}>
          Your wishlist is empty
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 14, color: 'var(--bark)', opacity: 0.6 }}>
          {items.length} item{items.length !== 1 ? 's' : ''} in wishlist
        </div>
        <button
          onClick={clearWishlist}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            border: '1px solid var(--border)',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          Clear All
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 16,
              background: '#fff',
              transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={item.img}
                alt={item.name}
                style={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              />
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                title="Remove from wishlist"
              >
                ✕
              </button>
            </div>

            {item.cat && (
              <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600, marginBottom: 4 }}>
                {item.cat}
              </div>
            )}

            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: 'var(--bark)',
                marginBottom: 8,
                height: 40,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {item.name}
            </div>

            <div
              style={{
                fontFamily: 'var(--ff-h)',
                fontSize: 18,
                color: 'var(--gold)',
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              {KES(item.price)}
            </div>

            <button
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 8,
                fontSize: 14,
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
          </div>
        ))}
      </div>
    </div>
  )
}
