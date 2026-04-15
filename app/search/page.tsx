"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { KES } from '@/lib/utils'
import Link from 'next/link'
import type { Product, BlogPost } from '@/types'

const CATEGORIES = [
  { label: "Immunity", icon: "🛡️", count: 3 },
  { label: "Stress Relief", icon: "🧘", count: 2 },
  { label: "Sleep", icon: "🌙", count: 1 },
  { label: "Nutrition", icon: "🥬", count: 2 },
  { label: "Cardiovascular", icon: "❤️", count: 1 },
  { label: "Topical", icon: "🌿", count: 1 },
  { label: "Anti-Inflammatory", icon: "🔥", count: 2 },
  { label: "All Products", icon: "✨", count: 8 },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [searched, setSearched] = useState(!!initialQuery)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ products: Product[], blogs: BlogPost[] }>({ products: [], blogs: [] })

  const popular = ["Moringa", "Immunity", "Ashwagandha", "Herbal Tea", "Sleep", "Kenya Mission"]

  const doSearch = async (q: string) => {
    if (!q.trim()) return
    setQuery(q)
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (data.success) {
        setResults(data.data)
        setSearched(true)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalResults = results.products.length + results.blogs.length

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery)
    }
  }, [initialQuery])

  return (
    <>
      <div className="search-wrap">
        <div className="search-hero">
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--lime)", fontWeight: 700, marginBottom: 12 }}>Search</div>
            <h1 style={{ fontFamily: "var(--ff-h)", fontSize: "clamp(26px,4vw,48px)", color: "#fff", marginBottom: 24 }}>What are you looking for?</h1>
            <div className="search-bar-wrap">
              <input className="search-input" placeholder="Search products, articles, remedies..."
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doSearch(query)} autoFocus />
              <button className="search-icon-btn" onClick={() => doSearch(query)}>🔍</button>
            </div>
            {!searched && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 10, fontWeight: 600 }}>Popular searches:</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {popular.map(t => (
                    <button key={t} className="search-tag" onClick={() => doSearch(t)}>{t}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 28px 80px" }}>
          {loading && (
            <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="result-card" style={{ cursor: "default" }}>
                  <div style={{ width: 80, height: 80, borderRadius: 8, background: "linear-gradient(90deg,#eee 25%,#f5f5f5 37%,#eee 63%)", backgroundSize: "600px 100%", animation: "shimmer 1.4s ease infinite", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="sk-line" style={{ width: "40%", marginBottom: 8 }} />
                    <div className="sk-line" style={{ width: "70%", marginBottom: 8 }} />
                    <div className="sk-line" style={{ width: "55%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {searched && !loading && (
            <>
              <div style={{ marginBottom: 28, fontSize: 14, color: "var(--bark)", opacity: 0.6 }}>
                {totalResults > 0 ? <><strong style={{ color: "var(--green)" }}>{totalResults} results</strong> for &ldquo;{query}&rdquo;</> : <>No results found for &ldquo;<strong>{query}</strong>&rdquo;</>}
              </div>

              {totalResults === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.3 }}>🔍</div>
                  <h2 style={{ fontFamily: "var(--ff-h)", fontSize: 26, color: "var(--green)", marginBottom: 10 }}>Nothing Found</h2>
                  <p style={{ fontSize: 14, color: "var(--bark)", opacity: 0.6, marginBottom: 28 }}>Try different keywords or browse our categories below.</p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/shop"><button className="btn-p">Browse Shop</button></Link>
                    <Link href="/blog"><button className="btn-o">Read Blog</button></Link>
                  </div>
                </div>
              )}

              {results.products.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green3)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 20, height: 2, background: "var(--green3)", display: "inline-block", borderRadius: 2 }} />
                    Products ({results.products.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {results.products.map(p => (
                      <Link href={`/shop/${p.slug}`} key={p.id}>
                        <div className="result-card">
                          <div className="result-card-img" style={{ position: 'relative', width: '100%', height: '100%' }}><Image src={p.images?.[0] || '/placeholder.jpg'} alt={p.name} fill sizes="80px" className="object-cover" unoptimized /></div>
                          <div style={{ flex: 1 }}>
                            <div className="result-type" style={{ color: "var(--green3)" }}>🌿 Product</div>
                            <div className="result-name">{p.name}</div>
                            <div className="result-sub">{p.category?.name || 'All'} · <strong style={{ color: "var(--gold)" }}>{KES(p.price || 0)}</strong></div>
                          </div>
                          <div style={{ fontSize: 12, color: "var(--green3)", fontWeight: 700, flexShrink: 0, alignSelf: "center" }}>View →</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.blogs.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green3)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 20, height: 2, background: "var(--green3)", display: "inline-block", borderRadius: 2 }} />
                    Articles ({results.blogs.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {results.blogs.map(b => (
                      <Link href={`/blog/${b.slug}`} key={b.id}>
                        <div className="result-card">
                          <div className="result-card-img" style={{ position: 'relative', width: '100%', height: '100%' }}><Image src={b.cover_image || '/placeholder.jpg'} alt={b.title} fill sizes="80px" className="object-cover" unoptimized /></div>
                          <div style={{ flex: 1 }}>
                            <div className="result-type" style={{ color: "#D4A017" }}>✍️ Article</div>
                            <div className="result-name">{b.title}</div>
                            <div className="result-sub">{b.tag}</div>
                          </div>
                          <div style={{ fontSize: 12, color: "var(--green3)", fontWeight: 700, flexShrink: 0, alignSelf: "center" }}>Read →</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!searched && !loading && (
            <div style={{ paddingTop: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green3)", marginBottom: 20 }}>Browse Categories</div>
              <div className="g4">
                {CATEGORIES.map(c => (
                  <Link href="/shop" key={c.label}>
                    <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 16px", cursor: "pointer", transition: "all var(--ease)", textAlign: "center" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--green3)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                      <div style={{ fontFamily: "var(--ff-h)", fontSize: 15, color: "var(--green)", marginBottom: 3 }}>{c.label}</div>
                      <div style={{ fontSize: 11, color: "var(--bark)", opacity: 0.45, fontWeight: 600 }}>{c.count} products</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
