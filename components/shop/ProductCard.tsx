"use client"

import { useState } from 'react'
import Image from 'next/image'
import { KES } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  p: Product
  onAdd: (product: Product) => void
  priority?: boolean
}

export default function ProductCard({ p, onAdd, priority = false }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const handle = () => {
    onAdd(p)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="pc">
      <div className="pc-img">
        <Image
          src={p.images?.[0] || '/placeholder.jpg'}
          alt={p.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          unoptimized
          className="object-cover"
        />
        {p.badge && <span className="pc-badge">{p.badge}</span>}
      </div>
      <div className="pc-body">
        <div className="pc-cat">{p.category?.name || 'All'}</div>
        <div className="pc-name">{p.name}</div>
        <div className="pc-desc">{p.description || ''}</div>
        <div className="pc-foot">
          <span className="pc-price">{KES(p.price)}</span>
          <button className={`pc-btn ${added ? 'added' : ''}`} onClick={handle}>
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
