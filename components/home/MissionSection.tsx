"use client"

import Link from 'next/link'

export default function MissionSection() {
  const stats = [
    { n: '20+', l: 'Years Serving' },
    { n: '12', l: 'Countries' },
    { n: '50K+', l: 'Lives Touched' },
    { n: '200+', l: 'Remedies' },
  ]

  const pillars = [
    { icon: '🌿', t: '100% Natural', d: 'No synthetic additives. Every remedy is sourced directly from nature\'s pharmacy.' },
    { icon: '🙏', t: 'Faith-Driven', d: 'Our mission is rooted in Christian service, compassionate care, and healing prayer.' },
    { icon: '🌍', t: 'African Roots', d: 'Ethically sourced from Kenyan and East African botanical traditions.' },
    { icon: '🔬', t: 'Science-Backed', d: 'Traditional remedies validated by modern botanical research and clinical evidence.' },
  ]

  return (
    <section className="sec" style={{ background: 'var(--cream)' }}>
      <div className="sec-inner">
        <div className="g2" style={{ marginBottom: 56 }}>
          <div>
            <div className="sec-label">Our Mission</div>
            <h2 className="sec-title" style={{ marginBottom: 18 }}>
              Healing Kenya &amp;<br />
              <em>the World Through Nature</em>
            </h2>
            <p className="sec-sub" style={{ marginBottom: 16 }}>
              For over two decades, Gladtidings Health missionaries have travelled across Kenya and beyond — learning from traditional healers and bringing affordable natural medicine to families who need it most.
            </p>
            <p className="sec-sub" style={{ marginBottom: 32 }}>
              Every purchase directly funds free clinics and healthcare education in underserved communities.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/about" className="btn-p">
                Our Story →
              </Link>
              <Link href="/shop" className="btn-o">
                Browse Remedies
              </Link>
            </div>
          </div>
          <div className="gs">
            {stats.map((s) => (
              <div
                key={s.l}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '26px 18px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--ff-h)', fontSize: 40, color: 'var(--green)', fontWeight: 700, lineHeight: 1 }}>
                  {s.n}
                </div>
                <div style={{ fontSize: 10, color: 'var(--green3)', marginTop: 8, letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase' }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="g4">
          {pillars.map((p) => (
            <div className="pillar" key={p.t}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
              <div style={{ fontFamily: 'var(--ff-h)', fontSize: 19, color: 'var(--green)', marginBottom: 8 }}>{p.t}</div>
              <div style={{ fontSize: 13, color: 'var(--bark)', opacity: 0.68, lineHeight: 1.7 }}>{p.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
