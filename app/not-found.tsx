import Link from 'next/link'

const suggestions = [
  { label: "🏠 Home", p: "/" },
  { label: "🌿 Shop", p: "/shop" },
  { label: "ℹ️ About", p: "/about" },
  { label: "📝 Blog", p: "/blog" },
  { label: "📞 Contact", p: "/contact" },
]

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="nf-inner">
        <div className="nf-num-wrap">
          <div className="nf-code">404</div>
          <div className="nf-leaf">🌿</div>
        </div>
        <h1 className="nf-title">Page Not Found</h1>
        <p className="nf-desc">
          Looks like this page wandered off into the forest. Don&apos;t worry — let us guide you back to health and wholeness.
        </p>
        <div className="nf-links">
          <Link href="/"><button className="btn-p">← Back to Home</button></Link>
          <Link href="/shop"><button className="btn-o">Browse Remedies</button></Link>
        </div>
        <div style={{ marginTop: 36, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--bark)", opacity: 0.45, marginBottom: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick Links</div>
          <div className="nf-quick">
            {suggestions.map(s => (
              <Link key={s.p} href={s.p}><button className="nf-quick-link">{s.label}</button></Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
