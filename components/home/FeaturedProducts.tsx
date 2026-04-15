"use client"

import Link from 'next/link'
import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  products: Product[]
  onAdd: (product: Product) => void
}

export default function FeaturedProducts({ products, onAdd }: FeaturedProductsProps) {
  return (
    <section className="sec" style={{ background: 'var(--white)' }}>
      <div className="sec-inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div className="sec-label">Natural Remedies</div>
            <h2 className="sec-title">Featured Products</h2>
          </div>
          <Link href="/shop" className="btn-o">
            View All →
          </Link>
        </div>
        <div className="g4">
          {products.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} p={p} onAdd={onAdd} priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
