"use client"

import { useState, useEffect } from 'react'
import BlogCard from '@/components/blog/BlogCard'
import NewsletterSection from '@/components/home/NewsletterSection'
import type { BlogPost } from '@/types'

export default function BlogPage() {
  const [filter, setFilter] = useState('All')
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blog?published=true')
        const data = await res.json()
        if (data.success) {
          setBlogs(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const tags = ['All', ...Array.from(new Set(blogs.map((b) => b.tag).filter(Boolean)))]
  const filtered = filter === 'All' ? blogs : blogs.filter((b) => b.tag === filter)

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
            <div className="sec-label" style={{ color: 'var(--lime)' }}>News & Insights</div>
            <h1 style={{ fontFamily: 'var(--ff-h)', fontSize: 'clamp(28px,5vw,52px)', color: '#fff', marginBottom: 12 }}>
              Our Blog
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.68)', maxWidth: 480, lineHeight: 1.8 }}>
              Wellness tips, mission stories, and the science behind African natural remedies.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 80px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 40,
                  border: `1.5px solid ${filter === t ? 'var(--green)' : 'var(--border)'}`,
                  background: filter === t ? 'var(--green)' : 'transparent',
                  color: filter === t ? 'var(--cream)' : 'var(--bark)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="g3">
            {filtered.map((b) => (
              <BlogCard key={b.id} b={b} />
            ))}
          </div>
        </div>
      </div>
      <NewsletterSection />
    </>
  )
}
