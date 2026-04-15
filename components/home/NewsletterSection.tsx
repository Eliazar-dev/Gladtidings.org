"use client"

import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const submit = async () => {
    if (!email.includes("@")) return
    setStatus("loading")
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.success) {
        setStatus("success")
      } else {
        setStatus("idle")
      }
    } catch (error) {
      console.error('Failed to subscribe:', error)
      setStatus("idle")
    }
  }

  return (
    <section className="newsletter">
      <div className="newsletter-deco" style={{ top: "-40px", left: "-40px" }}>🌿</div>
      <div className="newsletter-deco" style={{ bottom: "-60px", right: "-20px", transform: "rotate(180deg)" }}>🌱</div>

      <div className="newsletter-inner">
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(116,198,157,0.15)", border: "1px solid rgba(116,198,157,0.3)", color: "var(--lime)", padding: "5px 14px", borderRadius: 40, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
          ✦ Stay Connected
        </div>
        <h2 style={{ fontFamily: "var(--ff-h)", fontSize: "clamp(26px,4vw,42px)", color: "#fff", marginBottom: 14, lineHeight: 1.2 }}>
          Natural Healing,<br /><em>Straight to Your Inbox</em>
        </h2>
        <p style={{ fontSize: 14, color: "rgba(248,244,238,0.65)", lineHeight: 1.85, marginBottom: 4 }}>
          Get remedy guides, field reports from our missionaries, exclusive discounts, and wellness tips — delivered weekly.
        </p>

        {status === "success" ? (
          <div style={{ marginTop: 28, background: "rgba(116,198,157,0.15)", border: "1px solid rgba(116,198,157,0.3)", borderRadius: 12, padding: "24px", animation: "scaleIn 0.4s ease" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🙏</div>
            <div style={{ fontFamily: "var(--ff-h)", fontSize: 22, color: "#fff", marginBottom: 8 }}>Welcome to the Family!</div>
            <div style={{ fontSize: 13, color: "rgba(248,244,238,0.65)", lineHeight: 1.75 }}>You&apos;re now subscribed. Check your inbox for a welcome message and your first remedy guide.</div>
          </div>
        ) : (
          <div className="newsletter-form">
            <input className="newsletter-input" type="email" placeholder="Enter your email address"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()} />
            <button className="btn-gold" style={{ width: "auto", padding: "14px 26px", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }} onClick={submit}>
              {status === "loading" ? <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> : null}
              {status === "loading" ? "Joining..." : "Subscribe Free →"}
            </button>
          </div>
        )}

        <div className="newsletter-perks">
          {[
            ["📬", "Weekly remedy guides"],
            ["🎁", "Exclusive discounts"],
            ["🌍", "Mission field reports"],
            ["🔒", "No spam, ever"]
          ].map(([icon, txt]) => (
            <div key={txt} className="newsletter-perk"><span>{icon}</span><span>{txt}</span></div>
          ))}
        </div>
      </div>
    </section>
  )
}
