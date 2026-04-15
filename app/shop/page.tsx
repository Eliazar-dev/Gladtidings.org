"use client"

import { useState, useEffect } from 'react'
import ProductCard from '@/components/shop/ProductCard'
import NewsletterSection from '@/components/home/NewsletterSection'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

export default function ShopPage() {
  const [filter, setFilter] = useState('All')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/remedies')
        const data = await res.json()
        if (data.success) {
          setProducts(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Extract unique categories from products
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category?.name || 'All')))
  const cats = ['All', ...uniqueCategories.filter(c => c !== 'All')]
  const filtered = filter === 'All' ? products : products.filter((p) => p.category?.name === filter)

  if (loading) {
    return (
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    )
  }

  return (
    <>
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', background: 'var(--white)' }}>
        <div style={{ background: 'var(--green)', padding: '48px 28px 40px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div className="sec-label" style={{ color: 'var(--lime)' }}>Natural Remedies</div>
            <h1 style={{ fontFamily: 'var(--ff-h)', fontSize: 'clamp(28px,5vw,52px)', color: '#fff', marginBottom: 12 }}>
              Our Remedies Shop
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.68)', maxWidth: 480, lineHeight: 1.8 }}>
              Every product ethically sourced, handcrafted, and backed by faith and science.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 80px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 40,
                  border: `1.5px solid ${filter === c ? 'var(--green)' : 'var(--border)'}`,
                  background: filter === c ? 'var(--green)' : 'transparent',
                  color: filter === c ? 'var(--cream)' : 'var(--bark)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="g4">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} onAdd={addItem} />
            ))}
          </div>
        </div>
      </div>
      <NewsletterSection />
    </>
  )
}
