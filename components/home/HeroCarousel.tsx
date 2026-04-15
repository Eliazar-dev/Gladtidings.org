"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const HERO_SLIDES = [
  {
    title: "Gladtidings Health\nNatural Remedies",
    sub: "Bringing God&apos;s healing through nature to communities across Kenya and beyond.",
    badge: "Serving Since 2003",
    cta: "Shop Remedies",
    img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1400&q=80",
    accent: "#74C69D",
  },
  {
    title: "From Africa&apos;s Soil\nTo Your Home",
    sub: "Ethically sourced herbal remedies prepared with faith, care, and botanical expertise.",
    badge: "100% Natural",
    cta: "Our Products",
    img: "https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=1400&q=80",
    accent: "#D4A017",
  },
  {
    title: "Healing Communities\nOne Family at a Time",
    sub: "Our missionaries work in 12 countries, delivering free healthcare and natural medicine.",
    badge: "50,000+ Lives Touched",
    cta: "Our Mission",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=80",
    accent: "#74C69D",
  },
  {
    title: "Ancient Wisdom\nModern Wellness",
    sub: "Centuries-old African herbal knowledge, validated by science and blessed by faith.",
    badge: "Faith-Driven Care",
    cta: "Learn More",
    img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1400&q=80",
    accent: "#D4A017",
  },
]

export default function HeroCarousel() {
  const [cur, setCur] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isAnim = useRef(false)

  const goTo = useCallback((i: number) => {
    if (isAnim.current) return
    isAnim.current = true
    setCur(i)
    setAnimKey((k) => k + 1)
    setTimeout(() => {
      isAnim.current = false
    }, 700)
  }, [])

  const next = useCallback(() => goTo((cur + 1) % HERO_SLIDES.length), [cur, goTo])
  const prev = useCallback(() => goTo((cur - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), [cur, goTo])

  useEffect(() => {
    timerRef.current = setInterval(next, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [next])

  const s = HERO_SLIDES[cur]

  return (
    <section className="hero">
      <div className="hero-img-wrap">
        <Image
          src={s.img}
          alt={s.title}
          fill
          priority
          sizes="100vw"
          unoptimized
          className="a-fadein"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="hero-scrim" />

      <div className="hero-content">
        <div className="hero-badge a-fadein" key={`b${animKey}`}>
          ✦ {s.badge}
        </div>
        <h1 className="hero-title a-fadeup" key={`t${animKey}`}>
          {s.title}
        </h1>
        <p className="hero-sub a-fadeup" key={`s${animKey}`} style={{ animationDelay: '0.12s' }}>
          {s.sub}
        </p>
        <div className="hero-btns a-fadeup" key={`c${animKey}`} style={{ animationDelay: '0.22s' }}>
          <button
            style={{
              background: s.accent,
              color: '#fff',
              border: 'none',
              padding: '15px 32px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 8px 24px ${s.accent}55`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <Link href="/shop">{s.cta}</Link>
          </button>
          <Link href="/about" className="btn-ghost">
            Our Story
          </Link>
        </div>
      </div>

      <div className="hero-counter">
        {String(cur + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
      </div>
      <div className="hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === cur ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: i === cur ? s.accent : 'rgba(255,255,255,0.3)',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
      <div className="hero-arrows">
        <button className="hero-arrow" onClick={prev}>
          ←
        </button>
        <button className="hero-arrow" onClick={next}>
          →
        </button>
      </div>
    </section>
  )
}
