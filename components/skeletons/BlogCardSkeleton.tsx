export default function BlogCardSkeleton() {
  return (
    <div className="sk-card">
      <div className="sk-img" />
      <div className="sk-body">
        <div className="sk-line" style={{ width: "30%", height: 10 }} />
        <div className="sk-line" style={{ width: "85%", height: 15 }} />
        <div className="sk-line" style={{ width: "70%", height: 15 }} />
        <div className="sk-line" style={{ width: "95%", height: 11 }} />
        <div className="sk-line" style={{ width: "80%", height: 11 }} />
        <div className="sk-line" style={{ width: "45%", height: 10, marginTop: 4 }} />
      </div>
    </div>
  )
}
