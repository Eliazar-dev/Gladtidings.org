"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { KES } from '@/lib/utils'
import Link from 'next/link'
import type { Product, Review } from '@/types'

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)
  const [tab, setTab] = useState("description")
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.slug}`)
        const data = await res.json()
        if (data.success) {
          setProduct(data.data.product)
          setReviews(data.data.reviews || [])
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params.slug])

  const addToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      images: product.images,
      category_id: product.category_id,
      qty,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading || !product) {
    return (
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    )
  }

  const ratingBars = [
    { star: 5, pct: 72 },
    { star: 4, pct: 18 },
    { star: 3, pct: 6 },
    { star: 2, pct: 2 },
    { star: 1, pct: 2 },
  ]

  const imgs = product.images?.length ? product.images : ['/placeholder.jpg']

  return (
    <>
      <div style={{ background: "var(--white)", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 28px 80px" }}>
          {/* Breadcrumb */}
          <div className="sp-breadcrumb">
            <Link href="/"><span>Home</span></Link>
            <span className="sep">›</span>
            <Link href="/shop"><span>Shop</span></Link>
            <span className="sep">›</span>
            <span style={{ color: "var(--green)", opacity: 1, fontWeight: 700 }}>{product.name}</span>
          </div>

          {/* Main product grid */}
          <div className="g2" style={{ marginBottom: 64 }}>
            {/* Gallery */}
            <div className="sp-gallery">
              <div className="sp-thumbs">
                {imgs.map((img, i) => (
                  <div key={i} className={`sp-thumb ${activeImg === i ? "active" : ""}`} onClick={() => setActiveImg(i)} style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image src={img} alt={`${product.name} view ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 20vw" className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
              <div className="sp-main-img" style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image src={imgs[activeImg]} alt={product.name} key={activeImg} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" unoptimized style={{ animation: "fadeIn 0.4s ease" }} />
              </div>
            </div>

            {/* Info */}
            <div>
              {product.badge && <span className="sp-badge">{product.badge}</span>}
              <div className="sp-cat">{product.category?.name || 'All'}</div>
              <h1 className="sp-name">{product.name}</h1>

              {/* Stars */}
              <div className="sp-stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className={`sp-star ${s <= Math.floor(product.rating_avg) ? "" : "empty"}`}>★</span>
                ))}
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--green)" }}>{product.rating_avg}</span>
                <span className="sp-rating-count">({product.rating_count} reviews)</span>
              </div>

              <div className="sp-price">{KES(product.price)}</div>
              <p className="sp-desc">{product.description || ''}</p>

              {/* Stock */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, fontWeight: 700 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: product.stock > 10 ? "var(--green3)" : "var(--gold)", display: "inline-block", animation: product.stock <= 5 ? "pulse 1.5s ease infinite" : "none" }} />
                <span style={{ color: product.stock > 10 ? "var(--green3)" : product.stock <= 5 ? "var(--red)" : "var(--gold)" }}>
                  {product.stock > 10 ? "In Stock" : product.stock <= 5 ? `Only ${product.stock} left!` : `${product.stock} units left`}
                </span>
              </div>

              {/* Qty + actions */}
              <div className="sp-qty-row">
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--bark)", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Qty:</div>
                <div className="sp-qty">
                  <button className="sp-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="sp-qty-n">{qty}</span>
                  <button className="sp-qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                </div>
                <div style={{ fontSize: 13, color: "var(--bark)", opacity: 0.55, fontWeight: 600 }}>
                  Total: <strong style={{ color: "var(--gold)" }}>{KES(product.price * qty)}</strong>
                </div>
              </div>

              <div className="sp-actions">
                <button className="btn-p" style={{ background: added ? "var(--green3)" : "", justifyContent: "center" }} onClick={addToCart}>
                  {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                </button>
                <button className={`sp-wishlist ${liked ? "liked" : ""}`} onClick={() => setLiked(l => !l)}>
                  {liked ? "❤️" : "🤍"}
                </button>
              </div>

              <div className="sp-trust">
                {[
                  ["🚚", "Free delivery over KES 5,000"],
                  ["🔒", "Secure payment"],
                  ["↩️", "30-day returns"],
                  ["🌿", "100% Natural"]
                ].map(([icon, txt]) => (
                  <div key={txt} className="sp-trust-item"><span>{icon}</span><span>{txt}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="sp-tabs">
              {[
                ["description", "Description"],
                ["ingredients", "Ingredients"],
                ["usage", "How to Use"],
                ["reviews", `Reviews (${product.rating_count})`]
              ].map(([id, label]) => (
                <div key={id} className={`sp-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</div>
              ))}
            </div>
            <div style={{ maxWidth: 720, fontSize: 14, color: "var(--bark)", opacity: 0.75, lineHeight: 1.9 }}>
              {tab === "description" && <p>{product.description} Our missionaries source this blend from certified organic farms across East Africa, ensuring purity and potency in every bottle. Each batch is third-party tested for contaminants and active compound concentration.</p>}
              {tab === "ingredients" && <div><p style={{ marginBottom: 12 }}><strong>Active Ingredients:</strong> {product.ingredients || 'N/A'}</p><p>All ingredients are ethically sourced, free from pesticides, GMOs, and synthetic additives. Suitable for vegetarians. Not suitable for pregnant women without medical advice.</p></div>}
              {tab === "usage" && <p>{product.usage_instructions || 'N/A'} For best results, use consistently for at least 4–6 weeks. Store in a cool, dry place away from direct sunlight. Keep out of reach of children.</p>}
              {tab === "reviews" && <ReviewsSection reviews={reviews} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const ratingBars = [
    { star: 5, pct: 72 },
    { star: 4, pct: 18 },
    { star: 3, pct: 6 },
    { star: 2, pct: 2 },
    { star: 1, pct: 2 },
  ]

  return (
    <div className="reviews-section">
      {/* Review cards */}
      {reviews.map(r => (
        <div className="rev-card" key={r.id}>
          <div className="rev-header">
            <div>
              <div className="rev-author">{r.author_name} · <span style={{ fontWeight: 400, opacity: 0.5 }}>{r.author_location || 'Kenya'}</span></div>
              <div style={{ display: "flex", gap: 2, margin: "4px 0" }}>
                {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: s <= r.rating ? "var(--gold)" : "rgba(212,160,23,0.2)", fontSize: 13 }}>★</span>)}
              </div>
            </div>
            <div className="rev-date">{new Date(r.created_at).toLocaleDateString()}</div>
          </div>
          <div className="rev-text">{r.review_text}</div>
          {r.verified_purchase && <div className="rev-verified">✓ Verified Purchase</div>}
        </div>
      ))}

      {/* Write a review */}
      <div className="rev-form">
        <h3 style={{ fontFamily: "var(--ff-h)", fontSize: 20, color: "var(--green)", marginBottom: 16 }}>
          {submitted ? "Thank You! 🙏" : "Write a Review"}
        </h3>
        {submitted ? (
          <p style={{ fontSize: 13, color: "var(--bark)", opacity: 0.68, lineHeight: 1.75 }}>
            Your review has been submitted and will appear after moderation. We appreciate your feedback!
          </p>
        ) : (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--green)", marginBottom: 8 }}>Your Rating</div>
              <div className="rev-star-input">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} className="rev-star-btn"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setUserRating(s)}
                    style={{ color: s <= (hoverRating || userRating) ? "var(--gold)" : "rgba(212,160,23,0.2)" }}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--green)" }}>Your Name</label>
              <input style={{ padding: "10px 13px", border: "1.5px solid var(--border)", borderRadius: 8, fontSize: 14, outline: "none", transition: "border-color var(--ease)" }} placeholder="Grace W." onFocus={e => e.currentTarget.style.borderColor = "var(--green3)"} onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--green)" }}>Your Review</label>
              <textarea rows={4} style={{ padding: "10px 13px", border: "1.5px solid var(--border)", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "var(--ff-b)", transition: "border-color var(--ease)" }} placeholder="Share your experience..." onFocus={e => e.currentTarget.style.borderColor = "var(--green3)"} onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
            </div>
            <button className="btn-p" onClick={() => setSubmitted(true)}>Submit Review →</button>
          </>
        )}
      </div>
    </div>
  )
}
