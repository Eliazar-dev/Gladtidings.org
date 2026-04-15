"use client"

import { useEffect, useState } from 'react'
import HeroCarousel from '@/components/home/HeroCarousel'
import MissionSection from '@/components/home/MissionSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import Testimonials from '@/components/home/Testimonials'
import BlogCard from '@/components/blog/BlogCard'
import NewsletterSection from '@/components/home/NewsletterSection'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem)
  const [products, setProducts] = useState<Product[]>([])
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch featured remedies
        const productsRes = await fetch('/api/remedies?featured=true&limit=8')
        const productsData = await productsRes.json()
        if (productsData.success) {
          setProducts(productsData.data)
        }

        // Fetch featured blog posts
        const blogsRes = await fetch('/api/blog?published=true&limit=3')
        const blogsData = await blogsRes.json()
        if (blogsData.success) {
          setBlogs(blogsData.data)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <>
        <HeroCarousel />
        <MissionSection />
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>Loading...</div>
      </>
    )
  }

  return (
    <>
      <HeroCarousel />
      <MissionSection />
      <FeaturedProducts products={products} onAdd={addItem} />
      <Testimonials />
      <section className="sec" style={{ background: 'var(--cream)' }}>
        <div className="sec-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div className="sec-label">News & Insights</div>
              <h2 className="sec-title">From Our Blog</h2>
            </div>
          </div>
          <div className="g3">
            {blogs.map((b) => (
              <BlogCard key={b.id} b={b} />
            ))}
          </div>
        </div>
      </section>
      <NewsletterSection />
    </>
  )
}
