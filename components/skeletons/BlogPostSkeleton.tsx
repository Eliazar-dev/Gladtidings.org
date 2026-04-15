export default function BlogPostSkeleton() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 28px 80px" }}>
      <div style={{ height: 280, borderRadius: 12, background: "linear-gradient(90deg,#e8ede8 25%,#eff3ef 37%,#e8ede8 63%)", backgroundSize: "600px 100%", animation: "shimmer 1.4s ease infinite", marginBottom: 32 }} />
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div className="sk-line" style={{ width: "20%", height: 10 }} />
        <div className="sk-line" style={{ width: "15%", height: 10 }} />
        <div className="sk-line" style={{ width: "15%", height: 10 }} />
      </div>
      <div className="sk-line" style={{ width: "85%", height: 28, marginBottom: 20 }} />
      {[
        ["95%", 14],
        ["90%", 14],
        ["92%", 14],
        ["88%", 14],
        ["94%", 14],
        ["80%", 14],
        ["75%", 14],
        ["85%", 14],
        ["40%", 14],
      ].map(([w, h], i) => (
        <div key={i} className="sk-line" style={{ width: w as string, height: h as number, marginBottom: 12 }} />
      ))}
    </div>
  )
}
