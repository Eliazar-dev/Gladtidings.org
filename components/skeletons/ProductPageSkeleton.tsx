export default function ProductPageSkeleton() {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 28px" }}>
      <div className="sk-line" style={{ width: "30%", height: 12, marginBottom: 28 }} />
      <div className="g2">
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ width: 80, height: 80, borderRadius: 8, background: "linear-gradient(90deg,#e8ede8 25%,#eff3ef 37%,#e8ede8 63%)", backgroundSize: "600px 100%", animation: "shimmer 1.4s ease infinite" }} />
              ))}
            </div>
            <div style={{ borderRadius: 14, background: "linear-gradient(90deg,#e8ede8 25%,#eff3ef 37%,#e8ede8 63%)", backgroundSize: "600px 100%", animation: "shimmer 1.4s ease infinite", aspectRatio: "1" }} />
          </div>
        </div>
        <div>
          {[["25%", 10], ["70%", 18], ["60%", 14], ["45%", 32], ["90%", 12], ["80%", 12], ["60%", 12]].map(([w, h], i) => (
            <div key={i} className="sk-line" style={{ width: w as string, height: h as number }} />
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <div className="sk-line" style={{ flex: 1, height: 48, margin: 0, borderRadius: 8 }} />
            <div className="sk-line" style={{ width: 48, height: 48, margin: 0, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
