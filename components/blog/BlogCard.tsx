"use client"

import Image from 'next/image'
import type { BlogPost } from '@/types'

interface BlogCardProps {
  b: BlogPost
}

export default function BlogCard({ b }: BlogCardProps) {
  const displayDate = b.published_at || b.created_at
  const formatDate = new Date(displayDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="blog-card">
      <div className="blog-img">
        <Image src={b.cover_image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'} alt={b.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" unoptimized className="object-cover" />
      </div>
      <div className="blog-body">
        <div className="blog-tag">{b.tag}</div>
        <div className="blog-title">{b.title}</div>
        <div className="blog-excerpt">{b.excerpt}</div>
        <div className="blog-meta">
          <span>✍️ {b.author_name}</span>
          <span>📅 {formatDate}</span>
        </div>
      </div>
    </div>
  )
}
