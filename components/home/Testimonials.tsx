"use client"

import { useState, useEffect } from 'react'

const TESTIMONIALS = [
  {
    quote: "Gladtidings Health has transformed how my family approaches wellness. The moringa capsules have given my children energy and strength we never had before.",
    name: "Mary Wanjiku",
    loc: "Nairobi, Kenya",
  },
  {
    quote: "I was sceptical at first, but the Ashwagandha Tincture genuinely helped me through a very difficult and stressful season. God bless this ministry.",
    name: "James Ochieng",
    loc: "Kisumu, Kenya",
  },
  {
    quote: "Knowing every purchase supports free healthcare for rural communities makes buying feel like a double blessing. The products work and the mission is real.",
    name: "Sarah Mutua",
    loc: "Mombasa, Kenya",
  },
]

export default function Testimonials() {
  const [cur, setCur] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCur((c) => (c + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const t = TESTIMONIALS[cur]

  return (
    <section className="test-sec">
      <div style={{ maxWidth: 660, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--ff-h)', fontSize: 56, color: 'var(--gold)', opacity: 0.35, lineHeight: 1, marginBottom: 18 }}>
          &ldquo;
        </div>
        <blockquote
          className="a-fadeup"
          key={cur}
          style={{
            fontFamily: 'var(--ff-h)',
            fontSize: 'clamp(17px, 2.4vw, 24px)',
            color: 'var(--cream)',
            fontStyle: 'italic',
            lineHeight: 1.6,
            marginBottom: 26,
          }}
        >
          {t.quote}
        </blockquote>
        <div style={{ fontSize: 13, color: 'var(--lime)', fontWeight: 700 }}>{t.name}</div>
        <div style={{ fontSize: 12, color: 'rgba(248,244,238,0.38)', marginTop: 4 }}>{t.loc}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              style={{
                width: i === cur ? 22 : 7,
                height: 7,
                borderRadius: 4,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background: i === cur ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
