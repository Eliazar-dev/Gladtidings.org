"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/types'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog/${params.slug}`)
        const data = await res.json()
        if (data.success) {
          setPost(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch blog post:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [params.slug])

  const copy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading || !post) {
    return (
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    )
  }

  const imgUrl = post.cover_image || '/placeholder.jpg'
  const authorImgUrl = post.author_image || '/placeholder-avatar.jpg'

  return (
    <>
      <div style={{ background: "var(--white)", minHeight: "100vh" }}>
        {/* Hero */}
        <div className="bp-hero" style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image src={imgUrl} alt={post.title} fill priority sizes="100vw" unoptimized className="object-cover" />
          <div className="bp-hero-scrim" />
          <div className="bp-hero-content">
            <div className="bp-hero-inner">
              {/* Breadcrumb */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 12, flexWrap: "wrap" }}>
                <Link href="/"><span style={{ cursor: "pointer" }}>Home</span></Link>
                <span>›</span>
                <Link href="/blog"><span style={{ cursor: "pointer" }}>Blog</span></Link>
                <span>›</span>
                <span style={{ color: "rgba(255,255,255,0.8)" }}>Article</span>
              </div>
              <span className="bp-tag">{post.tag}</span>
              <h1 className="bp-title">{post.title}</h1>
              <div className="bp-meta">
                <span>✍️ {post.author_name}</span>
                <span>📅 {new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                <span>⏱ {post.read_time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="bp-body">
          <div className="bp-content" dangerouslySetInnerHTML={{ __html: post.content || '' }} />

          {/* Share */}
          <div className="bp-share">
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", marginRight: 4 }}>Share:</span>
            {[
              ["📘", "Facebook"],
              ["🐦", "Twitter"],
              ["💬", "WhatsApp"],
              ["📋", copied ? "Copied!" : "Copy Link"]
            ].map(([icon, label]) => (
              <button key={label} className="bp-share-btn" onClick={label.includes("Copy") ? copy : undefined}>
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Author card */}
          <div className="bp-author-card">
            <div className="bp-author-img" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image src={authorImgUrl} alt={post.author_name} fill sizes="80px" className="object-cover" unoptimized />
            </div>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--green3)", fontWeight: 700, marginBottom: 5 }}>About the Author</div>
              <div style={{ fontFamily: "var(--ff-h)", fontSize: 19, color: "var(--green)", marginBottom: 6 }}>{post.author_name}</div>
              <div style={{ fontSize: 13, color: "var(--bark)", opacity: 0.68, lineHeight: 1.75 }}>{post.author_bio || ''}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
