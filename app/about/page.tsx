"use client"

import NewsletterSection from '@/components/home/NewsletterSection'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  image_url: string
}

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(({ data }) => {
        setTeam(data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch team:', err)
        setLoading(false)
      })
  }, [])

  const timeline = [
    { year: "2003", icon: "🌱", t: "Founded in Nairobi", d: "Pastor James Kamau founded Gladtidings Health from a small clinic in Kibera, Nairobi." },
    { year: "2008", icon: "🌍", t: "Regional Expansion", d: "Expanded operations to Uganda, Tanzania, and Rwanda, reaching 15,000 families." },
    { year: "2015", icon: "🔬", t: "Research Partnership", d: "Partnered with the University of Nairobi for botanical research and product validation." },
    { year: "2020", icon: "💻", t: "Online Store Launched", d: "Launched our e-commerce platform to fund free clinic programs worldwide." },
    { year: "2025", icon: "🏥", t: "50,000 Lives Reached", d: "Gladtidings Health has now touched over 50,000 lives across 12 countries." },
  ]

  return (
    <>
      <div style={{ background: 'var(--white)', minHeight: '100vh' }}>
        <div className="about-hero">
          <Image src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=80" alt="Mission" fill priority sizes="100vw" unoptimized className="object-cover" />
          <div className="about-hero-scrim" />
          <div className="about-hero-content">
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px 52px', width: '100%' }}>
              <div style={{ fontFamily: 'var(--ff-h)', fontSize: 'clamp(32px,5vw,60px)', color: '#fff', fontWeight: 700, marginBottom: 14 }}>
                Our Story & Mission
              </div>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', maxWidth: 500, lineHeight: 1.75 }}>
                Two decades of faith, healing, and nature&apos;s medicine across Africa and beyond.
              </p>
            </div>
          </div>
        </div>

        <section className="sec" style={{ background: 'var(--cream)' }}>
          <div className="sec-inner">
            <div className="g2">
              <div>
                <div className="sec-label">Our Story</div>
                <h2 className="sec-title" style={{ marginBottom: 18 }}>
                  Born From a Vision<br />
                  <em>of Healing</em>
                </h2>
                <p style={{ fontSize: 14, color: 'var(--bark)', opacity: 0.72, lineHeight: 1.9, marginBottom: 16 }}>
                  In 2003, Pastor James Kamau had a vision: to combine faith-based missionary work with the incredible healing power of Africa&apos;s natural botanical heritage. Starting from a small clinic in Kibera, Nairobi, Gladtidings Health was born.
                </p>
                <p style={{ fontSize: 14, color: 'var(--bark)', opacity: 0.72, lineHeight: 1.9, marginBottom: 28 }}>
                  Today, we operate in 12 countries, run free rural clinics, and prepare over 200 natural remedies — each one backed by both traditional knowledge and modern science.
                </p>
                <Link href="/shop" className="btn-p">
                  Support Our Mission →
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Image src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80" alt="Mission" width={600} height={380} unoptimized className="rounded-xl object-cover" />
                <div style={{ position: 'absolute', bottom: -18, right: -18, background: 'var(--green)', color: 'var(--cream)', padding: '18px 22px', borderRadius: 10, boxShadow: 'var(--shadow-lg)' }}>
                  <div style={{ fontFamily: 'var(--ff-h)', fontSize: 32, fontWeight: 700, lineHeight: 1 }}>20+</div>
                  <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Years of Service</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sec" style={{ background: 'var(--white)' }}>
          <div className="sec-inner" style={{ maxWidth: 760 }}>
            <div className="sec-label">Our Journey</div>
            <h2 className="sec-title" style={{ marginBottom: 40 }}>Milestones of Grace</h2>
            {timeline.map((t) => (
              <div className="timeline-item" key={t.year}>
                <div className="tl-dot">{t.icon}</div>
                <div>
                  <div className="tl-year">{t.year}</div>
                  <div className="tl-title">{t.t}</div>
                  <div className="tl-desc">{t.d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="sec" style={{ background: 'var(--cream)' }}>
          <div className="sec-inner">
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}>The People</div>
              <h2 className="sec-title">Meet Our Team</h2>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>Loading team...</div>
            ) : (
              <div className="g3">
                {team.map((m) => (
                  <div className="team-card" key={m.id}>
                    <div className="team-img">
                      <Image src={m.image_url} alt={m.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" unoptimized className="object-cover" />
                    </div>
                    <div className="team-body">
                      <div className="team-name">{m.name}</div>
                      <div className="team-role">{m.role}</div>
                      <div className="team-bio">{m.bio}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <NewsletterSection />
      <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid var(--border)', marginTop: 40 }}>
        <Link href="/admin" style={{ fontSize: 13, color: 'var(--green3)', cursor: 'pointer' }}>
          ⚙️ Admin
        </Link>
      </div>
    </>
  )
}
