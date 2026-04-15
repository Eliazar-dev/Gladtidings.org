"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KES } from '@/lib/utils'

const statusConfig: any = {
  pending_whatsapp: { 
    label:"Pending WhatsApp", 
    color:"#e65100", 
    bg:"#fff3e0",
    icon:"⏳",
    desc:"Order received. Waiting for customer to send WhatsApp message."
  },
  payment_sent:     { 
    label:"Payment Sent", 
    color:"#0d47a1", 
    bg:"#e3f2fd",
    icon:"📤",
    desc:"Customer has sent payment. Verifying transaction."
  },
  paid:             { 
    label:"Paid", 
    color:"var(--green)", 
    bg:"var(--mist)",
    icon:"✅",
    desc:"Payment confirmed. Order is being prepared for dispatch."
  },
  completed:        { 
    label:"Completed", 
    color:"#4a148c", 
    bg:"#f3e5f5",
    icon:"🚚",
    desc:"Order has been delivered successfully."
  },
  cancelled:        { 
    label:"Cancelled", 
    color:"var(--red)", 
    bg:"#ffebee",
    icon:"✕",
    desc:"Order has been cancelled."
  },
}

export default function TrackOrderPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrack = async () => {
    if (!orderId.trim()) {
      setError("Please enter an order ID")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/orders/${orderId}`)
      const data = await res.json()
      if (data.success) {
        setOrder(data.data)
      } else {
        setError("Order not found. Please check your order ID and try again.")
      }
    } catch (err) {
      setError("Failed to fetch order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:"100vh",padding:"40px 20px",background:"var(--cream)" }}>
      <div style={{ maxWidth:800,margin:"0 auto" }}>
        {/* Header */}
        <div style={{ textAlign:"center",marginBottom:40 }}>
          <h1 style={{ fontFamily:"var(--ff-h)",fontSize:36,color:"var(--green)",marginBottom:12 }}>Track Your Order</h1>
          <p style={{ fontSize:16,color:"var(--bark)",opacity:0.6 }}>Enter your order ID to check the status of your delivery</p>
        </div>

        {/* Search Box */}
        <div style={{ background:"#fff",borderRadius:16,padding:24,border:"1px solid rgba(0,0,0,0.06)",marginBottom:32 }}>
          <div style={{ display:"flex",gap:12,marginBottom:16 }}>
            <input
              type="text"
              placeholder="Enter Order ID (e.g., GT-2025-4821)"
              value={orderId}
              onChange={e => setOrderId(e.target.value.toUpperCase())}
              style={{
                flex:1,
                padding:"14px 18px",
                border:"1.5px solid var(--border)",
                borderRadius:8,
                fontSize:15,
                outline:"none",
                transition:"border-color 0.32s cubic-bezier(0.4,0,0.2,1)",
                fontFamily:"var(--ff-h)",
                fontWeight:600,
                textTransform:"uppercase",
              }}
              onKeyDown={e => e.key === "Enter" && handleTrack()}
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              style={{
                padding:"14px 32px",
                borderRadius:8,
                fontSize:15,
                fontWeight:700,
                border:"none",
                background:"var(--green)",
                color:"#fff",
                cursor:loading?"not-allowed":"pointer",
                transition:"background 0.32s cubic-bezier(0.4,0,0.2,1)",
                opacity:loading?0.6:1,
              }}
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </div>

          {error && (
            <div style={{ background:"#ffebee",color:"var(--red)",padding:"12px 16px",borderRadius:8,fontSize:14,fontWeight:600 }}>
              {error}
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div style={{ background:"#fff",borderRadius:16,padding:32,border:"1px solid rgba(0,0,0,0.06)",animation:"fadeIn 0.32s ease" }}>
            {/* Status Banner */}
            <div style={{ 
              background:statusConfig[order.status]?.bg,
              border:"1px solid rgba(0,0,0,0.06)",
              borderRadius:12,
              padding:20,
              marginBottom:24,
              display:"flex",
              alignItems:"center",
              gap:16
            }}>
              <span style={{ fontSize:48 }}>{statusConfig[order.status]?.icon}</span>
              <div>
                <div style={{ fontSize:20,fontWeight:700,color:statusConfig[order.status]?.color,marginBottom:4 }}>
                  {statusConfig[order.status]?.label}
                </div>
                <div style={{ fontSize:14,color:"var(--bark)",opacity:0.7 }}>
                  {statusConfig[order.status]?.desc}
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div style={{ marginBottom:24 }}>
              <h3 style={{ fontFamily:"var(--ff-h)",fontSize:18,color:"var(--green)",marginBottom:16 }}>Order Information</h3>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16 }}>
                <div>
                  <div style={{ fontSize:12,color:"var(--bark)",opacity:0.5,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:4 }}>Order ID</div>
                  <div style={{ fontSize:16,fontWeight:700,color:"var(--bark)" }}>{order.id}</div>
                </div>
                <div>
                  <div style={{ fontSize:12,color:"var(--bark)",opacity:0.5,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:4 }}>Order Date</div>
                  <div style={{ fontSize:16,color:"var(--bark)" }}>{new Date(order.createdAt).toLocaleDateString("en-KE",{dateStyle:"full"})}</div>
                </div>
                <div>
                  <div style={{ fontSize:12,color:"var(--bark)",opacity:0.5,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:4 }}>Customer</div>
                  <div style={{ fontSize:16,color:"var(--bark)" }}>{order.customerName}</div>
                </div>
                <div>
                  <div style={{ fontSize:12,color:"var(--bark)",opacity:0.5,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:4 }}>Phone</div>
                  <div style={{ fontSize:16,color:"var(--bark)" }}>{order.customerPhone}</div>
                </div>
                <div style={{ gridColumn:"span 2" }}>
                  <div style={{ fontSize:12,color:"var(--bark)",opacity:0.5,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:4 }}>Delivery Address</div>
                  <div style={{ fontSize:16,color:"var(--bark)" }}>{order.address}, {order.city}, {order.county}</div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom:24 }}>
              <h3 style={{ fontFamily:"var(--ff-h)",fontSize:18,color:"var(--green)",marginBottom:16 }}>Order Items</h3>
              <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                {(order.items || []).map((item: any, i: number) => (
                  <div key={i} style={{ display:"flex",gap:16,padding:16,border:"1px solid var(--border)",borderRadius:8 }}>
                    <img src={item.product_image || '/placeholder.jpg'} alt={item.product_name} style={{ width:80,height:80,objectFit:"cover",borderRadius:6 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700,fontSize:15,color:"var(--bark)",marginBottom:4 }}>{item.product_name}</div>
                      <div style={{ fontSize:13,color:"var(--bark)",opacity:0.6,marginBottom:8 }}>Quantity: {item.quantity}</div>
                      <div style={{ fontFamily:"var(--ff-h)",fontSize:16,color:"var(--gold)",fontWeight:700 }}>{KES(item.total_price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{ background:"var(--mist)",borderRadius:12,padding:20 }}>
              <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:14 }}>
                <span style={{ color:"var(--bark)",opacity:0.6 }}>Subtotal</span>
                <span style={{ fontWeight:700,color:"var(--bark)" }}>{KES(order.subtotal)}</span>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:14 }}>
                <span style={{ color:"var(--bark)",opacity:0.6 }}>Shipping</span>
                <span style={{ fontWeight:700,color:"var(--bark)" }}>{order.shipping===0?"Free":KES(order.shipping)}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:14 }}>
                  <span style={{ color:"var(--bark)",opacity:0.6 }}>Discount</span>
                  <span style={{ fontWeight:700,color:"var(--green)" }}>− {KES(order.discount)}</span>
                </div>
              )}
              <div style={{ display:"flex",justifyContent:"space-between",padding:"12px 0",borderTop:"1px solid var(--border)",marginTop:8 }}>
                <span style={{ fontSize:16,fontWeight:700,color:"var(--bark)" }}>Total</span>
                <span style={{ fontFamily:"var(--ff-h)",fontSize:20,color:"var(--gold)",fontWeight:700 }}>{KES(order.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop:24,display:"flex",gap:12,flexWrap:"wrap" }}>
              <button
                onClick={() => router.push('/')}
                style={{
                  flex:1,
                  padding:"12px 24px",
                  borderRadius:8,
                  fontSize:14,
                  fontWeight:700,
                  border:"1px solid var(--border)",
                  background:"transparent",
                  cursor:"pointer",
                  transition:"all 0.32s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                Continue Shopping
              </button>
              {order.status === "pending_whatsapp" && (
                <button
                  onClick={() => window.open(`https://wa.me/254700123456?text=${encodeURIComponent(`Hello, I'm checking on my order ${order.id}`)}`, "_blank")}
                  style={{
                    flex:1,
                    padding:"12px 24px",
                    borderRadius:8,
                    fontSize:14,
                    fontWeight:700,
                    border:"none",
                    background:"var(--wa)",
                    color:"#fff",
                    cursor:"pointer",
                    transition:"background 0.32s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  Contact via WhatsApp
                </button>
              )}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div style={{ marginTop:32,textAlign:"center" }}>
          <div style={{ fontSize:14,color:"var(--bark)",opacity:0.6,marginBottom:8 }}>Need help?</div>
          <button
            onClick={() => window.open(`https://wa.me/254700123456`, "_blank")}
            style={{
              padding:"10px 20px",
              borderRadius:8,
              fontSize:13,
              fontWeight:700,
              border:"none",
              background:"var(--wa)",
              color:"#fff",
              cursor:"pointer",
              transition:"background 0.32s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            Chat with Support
          </button>
        </div>
      </div>
    </div>
  )
}
