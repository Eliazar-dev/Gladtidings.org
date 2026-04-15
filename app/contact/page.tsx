"use client"

import { useState } from 'react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
        setForm({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSent(false), 4000)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', background: 'var(--white)' }}>
        <div style={{ background: 'var(--green)', padding: '48px 28px 40px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div className="sec-label" style={{ color: 'var(--lime)' }}>Get in Touch</div>
            <h1 style={{ fontFamily: 'var(--ff-h)', fontSize: 'clamp(28px,5vw,52px)', color: '#fff', marginBottom: 12 }}>
              Contact Us
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.68)', maxWidth: 480, lineHeight: 1.8 }}>
              Have questions about our remedies or mission? We'd love to hear from you.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 28px 80px' }}>
          <div className="g2">
            <div>
              <h2 style={{ fontFamily: 'var(--ff-h)', fontSize: 26, color: 'var(--green)', marginBottom: 24 }}>Send a Message</h2>
              {sent ? (
                <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 10, padding: 24, textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
                  <div style={{ fontSize: 16, color: '#2e7d32', fontWeight: 600 }}>Message Sent!</div>
                  <div style={{ fontSize: 13, color: '#388e3c', marginTop: 6 }}>We'll get back to you within 24 hours.</div>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className="fr">
                    <div className="fg">
                      <label className="fl">Name</label>
                      <input className="fi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="fg">
                      <label className="fl">Email</label>
                      <input className="fi" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="fg">
                    <label className="fl">Subject</label>
                    <input className="fi" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                  </div>
                  <div className="fg">
                    <label className="fl">Message</label>
                    <textarea className="fi" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn-gold" style={{ marginTop: 12 }} disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--ff-h)', fontSize: 26, color: 'var(--green)', marginBottom: 24 }}>Contact Info</h2>
              <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green3)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Address</div>
                  <a href="https://maps.app.goo.gl/8zEPkg53nedJW7ak6" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: 'var(--green)', textDecoration: 'none' }}>Awendo town, Migori Kenya →</a>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green3)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Phone</div>
                  <a href="tel:+254723730980" style={{ fontSize: 14, color: 'var(--green)', textDecoration: 'none' }}>+254 723 730980</a>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green3)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Email</div>
                  <a href="mailto:glad.tidings.health@gmail.com" style={{ fontSize: 14, color: 'var(--green)', textDecoration: 'none' }}>glad.tidings.health@gmail.com</a>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green3)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Hours</div>
                  <div style={{ fontSize: 14, color: 'var(--bark)' }}>
                    Mon - Fri: 8am - 5pm<br />
                    Sunday: 8am - 5pm<br />
                    Saturday: Closed
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 20, color: 'var(--green)', marginBottom: 16 }}>Quick Links</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href="/shop" style={{ fontSize: 14, color: 'var(--bark)', opacity: 0.72, transition: 'color 0.2s' }}>Shop Remedies →</a>
                  <a href="/about" style={{ fontSize: 14, color: 'var(--bark)', opacity: 0.72, transition: 'color 0.2s' }}>Our Story →</a>
                  <a href="/blog" style={{ fontSize: 14, color: 'var(--bark)', opacity: 0.72, transition: 'color 0.2s' }}>Blog →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
