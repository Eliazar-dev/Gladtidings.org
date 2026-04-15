"use client"

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { KES } from '@/lib/utils'
import { buildWhatsAppMessage } from '@/lib/utils'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [tab, setTab] = useState("orders")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  // Fetch orders from API
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      if (data.success) {
        setOrders(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    // Update local state immediately for responsiveness
    setOrders(oo => oo.map(o => o.id === id ? { ...o, status } : o))

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (!data.success) {
        console.error('Error updating order:', data.error)
        // Revert local state on error
        setOrders(oo => oo.map(o => o.id === id ? { ...o, status: o.status } : o))
      }
    } catch (error) {
      console.error('Error updating order:', error)
      // Revert local state on error
      setOrders(oo => oo.map(o => o.id === id ? { ...o, status: o.status } : o))
    }
  }

  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_phone.includes(search)
  )

  const byStatus = (s: string) => filtered.filter(o => o.status === s)

  const stats = [
    { n: orders.filter(o=>o.status==="pending_whatsapp").length, l:"Pending WhatsApp", icon:"⏳", color:"#e65100" },
    { n: orders.filter(o=>o.status==="payment_sent").length, l:"Payment Sent", icon:"📤", color:"#0d47a1" },
    { n: orders.filter(o=>o.status==="paid").length, l:"Paid", icon:"✅", color:"var(--green)" },
    { n: `${KES(orders.filter(o=>o.status==="completed").reduce((s,o)=>s+o.total,0))}`, l:"Completed Revenue", icon:"💰", color:"var(--gold)" },
  ]

  const statusConfig: any = {
    pending_whatsapp: { label:"Pending WhatsApp", color:"#e65100", bg:"#fff3e0", next:"payment_sent", nextLabel:"Mark Payment Sent", btnClass:"kb-btn-wa" },
    payment_sent:     { label:"Payment Sent", color:"#0d47a1", bg:"#e3f2fd", next:"paid", nextLabel:"Mark as Paid ✓", btnClass:"kb-btn-paid" },
    paid:             { label:"Paid", color:"var(--green)", bg:"var(--mist)", next:"completed", nextLabel:"Mark Completed 🚚", btnClass:"kb-btn-done" },
    completed:        { label:"Completed", color:"#4a148c", bg:"#f3e5f5", next:null, nextLabel:null, btnClass:"" },
  }

  const KANBAN_COLS = [
    { status:"pending_whatsapp", title:"Pending WhatsApp", color:"#e65100" },
    { status:"payment_sent",     title:"Payment Sent",     color:"#1565c0" },
    { status:"paid",             title:"Paid",             color:"var(--green3)" },
    { status:"completed",        title:"Completed",        color:"#7b1fa2" },
  ]

  return (
    <div className="adm-layout">
      <AdminSidebar />
      <div className="adm-main">
        <div className="adm-topbar">
          <div className="adm-title">Orders</div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
        ) : (
          <>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24 }}>
              {stats.map(s => (
                <div key={s.l} className="adm-stat">
                  <div className="adm-stat-n">{s.n}</div>
                  <div className="adm-stat-l">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="adm-card">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td style={{ fontWeight:700,color:"var(--green)" }}>{o.id}</td>
                      <td>{o.customer_name}</td>
                      <td>{KES(o.total)}</td>
                      <td><span className={`adm-badge ${o.status === 'completed' ? 'green' : o.status === 'paid' ? 'gold' : 'red'}`}>{o.status}</span></td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="adm-btn-sm" onClick={() => setSelectedOrder(o)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }} onClick={e => e.target===e.currentTarget && setSelectedOrder(null)}>
            <div style={{ background:"#fff",borderRadius:16,padding:28,width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.2)" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22 }}>
                <div style={{ fontFamily:"var(--ff-h)",fontSize:22,color:"var(--green)" }}>Order Details</div>
                <button style={{ background:"none",border:"none",fontSize:22,cursor:"pointer" }} onClick={() => setSelectedOrder(null)}>✕</button>
              </div>

            <div style={{ marginBottom:20 }}>
              <span style={{ 
                display:"inline-flex",
                alignItems:"center",
                gap:5,
                padding:"4px 12px",
                borderRadius:20,
                fontSize:11,
                fontWeight:700,
                letterSpacing:"0.06em",
                textTransform:"uppercase",
                background: selectedOrder.status==="pending_whatsapp"?"#fff3e0":selectedOrder.status==="payment_sent"?"#e8f5e9":selectedOrder.status==="paid"?"#e3f2fd":"#f3e5f5",
                color: selectedOrder.status==="pending_whatsapp"?"#e65100":selectedOrder.status==="payment_sent"?"#1b5e20":selectedOrder.status==="paid"?"#0d47a1":"#4a148c"
              }}>
                {statusConfig[selectedOrder.status]?.label}
              </span>
            </div>

            {[
              ["Order ID", selectedOrder.id],
              ["Customer", selectedOrder.customer_name],
              ["Phone", selectedOrder.customer_phone],
              ["Delivery", selectedOrder.delivery_method === "pickup" ? "Self Pickup" : `${selectedOrder.address}, ${selectedOrder.city}`],
              ["Subtotal", KES(selectedOrder.subtotal)],
              ["Shipping", selectedOrder.shipping===0 ? "Free" : KES(selectedOrder.shipping)],
              selectedOrder.discount > 0 ? ["Discount", `− ${KES(selectedOrder.discount)}`] : null,
              ["TOTAL", KES(selectedOrder.total)],
              ["Date", new Date(selectedOrder.createdAt).toLocaleString("en-KE")],
            ].filter(Boolean).map(([l,v]: any) => (
              <div style={{ display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)",fontSize:13 }} key={l}>
                <span style={{ color:"var(--bark)",opacity:0.55,fontWeight:600 }}>{l}</span>
                <span style={{ fontWeight:700,color:l==="TOTAL"?"var(--gold)":"var(--bark)",textAlign:"right" }}>{v}</span>
              </div>
            ))}

            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--green)",marginBottom:8 }}>Items</div>
              {(selectedOrder.items || []).map((item: any, i: number) => (
                <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--border)",fontSize:13 }}>
                  <span>{item.product_name} ×{item.quantity}</span>
                  <span style={{ fontWeight:700,color:"var(--gold)" }}>{KES(item.total_price)}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--green)",marginBottom:6 }}>WhatsApp Message Preview</div>
              <div style={{ background:"#e8f5e9",borderRadius:10,padding:16,fontSize:12,color:"#1b3320",lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"monospace",border:"1px solid rgba(37,211,102,0.2)",marginTop:12,maxHeight:200,overflowY:"auto" }}>{buildWhatsAppMessage(selectedOrder)}</div>
            </div>

            <div style={{ display:"flex",gap:10,marginTop:20,flexWrap:"wrap" }}>
              {statusConfig[selectedOrder.status]?.next && (
                <button style={{ flex:2,background:"var(--green)",color:"var(--cream)",border:"none",padding:"13px 28px",borderRadius:8,fontSize:13,fontWeight:700,letterSpacing:"0.04em",display:"inline-flex",alignItems:"center",gap:8,justifyContent:"center",cursor:"pointer" }} onClick={() => { updateStatus(selectedOrder.id, statusConfig[selectedOrder.status].next); setSelectedOrder(null); }}>
                  {statusConfig[selectedOrder.status].nextLabel}
                </button>
              )}
              <button style={{ flex:1,padding:"10px",fontSize:13,background:"var(--wa)",color:"#fff",border:"none",borderRadius:10,fontWeight:800,letterSpacing:"0.02em",display:"inline-flex",alignItems:"center",gap:12,justifyContent:"center",cursor:"pointer" }}
                onClick={() => window.open(`https://wa.me/${selectedOrder.customer_phone.replace(/\D/g,"")}`, "_blank")}>
                💬 Open WA
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
