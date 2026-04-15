export default function ProductCardSkeleton() {
  return (
    <div className="sk-card">
      <div className="sk-img" />
      <div className="sk-body">
        <div className="sk-line" style={{ width: "45%", height: 10 }} />
        <div className="sk-line" style={{ width: "80%", height: 14 }} />
        <div className="sk-line" style={{ width: "95%", height: 11 }} />
        <div className="sk-line" style={{ width: "60%", height: 11 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div className="sk-line" style={{ width: "30%", height: 18, margin: 0 }} />
          <div className="sk-line" style={{ width: "35%", height: 34, margin: 0, borderRadius: 7 }} />
        </div>
      </div>
    </div>
  )
}
