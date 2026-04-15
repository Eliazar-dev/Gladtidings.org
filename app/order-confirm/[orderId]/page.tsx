"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { KES } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { buildWhatsAppMessage } from '@/lib/utils'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254700123456"

export default function OrderConfirmPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string
  const [countdown, setCountdown] = useState(10)
  const [opened, setOpened] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      try {
        console.log('Fetching order:', orderId)
        const res = await fetch(`/api/orders/${orderId}`)
        const data = await res.json()
        console.log('Order data response:', data)
        if (data.success) {
          setOrder(data.order)
          console.log('Order set:', data.order)
        } else {
          console.error('Failed to fetch order:', data.error)
        }
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(t)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (countdown === 0 && !opened && order) {
      setOpened(true)
      const waMessage = buildWhatsAppMessage(order)
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`, "_blank")
    }
  }, [countdown, opened, order])

  const openWA = () => {
    if (!order) {
      console.error('No order data available')
      return
    }
    setOpened(true)
    const waMessage = buildWhatsAppMessage(order)
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`
    console.log('Opening WhatsApp:', waUrl)
    window.open(waUrl, "_blank")
  }

  if (loading) {
    return (
      <>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 18, color: "var(--green)" }}>Loading order details...</div>
        </div>
      </>
    )
  }

  if (!order) {
    return (
      <>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <h2 style={{ fontFamily: "var(--ff-h)", fontSize: 24, color: "var(--green)", marginBottom: 8 }}>Order Not Found</h2>
            <p style={{ fontSize: 14, color: "var(--bark)", opacity: 0.6, marginBottom: 24 }}>We couldn&apos;t find an order with that ID.</p>
            <Link href="/shop" className="btn-p">
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0d3320 0%,var(--green) 50%,#1a5c3a 100%)", padding: "24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", fontSize: 200, opacity: 0.04, userSelect: "none", pointerEvents: "none", top: "-40px", left: "-40px" }}>🌿</div>
        <div style={{ position: "absolute", fontSize: 200, opacity: 0.04, userSelect: "none", pointerEvents: "none", bottom: "-60px", right: "-20px", transform: "rotate(180deg)" }}>🌱</div>

        <div style={{ background: "rgba(254,252,248,0.97)", borderRadius: 20, padding: "40px 36px", maxWidth: 520, width: "100%", textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", position: "relative", zIndex: 2, animation: "scaleIn 0.5s ease" }}>
          {/* Check icon */}
          <div style={{ width: 70, height: 70, background: "var(--mist)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>✅</div>

          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--green3)", fontWeight: 700, marginBottom: 8 }}>Order Saved Successfully</div>
          <h1 style={{ fontFamily: "var(--ff-h)", fontSize: "clamp(22px,4vw,32px)", color: "var(--green)", marginBottom: 8, lineHeight: 1.2 }}>Almost done!<br/>Open WhatsApp to confirm.</h1>

          {/* Order ID */}
          <div style={{ background: "var(--mist)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 18px", fontFamily: "var(--ff-h)", fontSize: 22, color: "var(--green)", fontWeight: 700, letterSpacing: "0.06em", display: "inline-block", marginBottom: 20 }}>{orderId}</div>

          {/* Order mini summary */}
          <div style={{ background: "var(--cream)", borderRadius: 10, padding: 16, margin: "20px 0", textAlign: "left" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Your Order</div>
            {(order.items || []).map((item: any) => (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", fontSize: 13, borderBottom: "1px solid rgba(27,67,50,0.08)" }} key={item.id}>
                <span style={{ color: "var(--bark)", opacity: 0.75 }}>{item.product_name} ×{item.quantity}</span>
                <span style={{ fontWeight: 700, color: "var(--gold)" }}>{KES(item.total_price)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800, borderBottom: "none", paddingTop: 10 }}>
              <span style={{ color: "var(--green)", fontWeight: 800 }}>TOTAL</span>
              <span style={{ fontFamily: "var(--ff-h)", fontSize: 19, color: "var(--green)", fontWeight: 700 }}>{KES(order.total)}</span>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ background: "var(--mist)", borderRadius: 10, padding: 18, margin: "20px 0", textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#1b3320", marginBottom: 12 }}>📲 What happens next:</div>
            {[
              ["Open the WhatsApp message below", "Your order details are pre-filled"],
              ["Tap Send", "We receive your order instantly"],
              ["We send M-Pesa prompt", "To your number: " + order.customerPhone],
              ["Confirm payment", "Your order is dispatched within 24hrs"],
            ].map(([title, sub], i) => (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }} key={i}>
                <div style={{ width: 22, height: 22, background: "var(--wa)", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{i+1}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1b3320" }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#1b3320", opacity: 0.65 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main CTA */}
          <button 
            onClick={openWA}
            style={{ 
              background: "var(--wa)", 
              color: "#fff", 
              border: "none", 
              padding: "16px 32px", 
              borderRadius: 10, 
              fontSize: 15, 
              fontWeight: 800, 
              letterSpacing: "0.02em", 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 12, 
              justifyContent: "center", 
              width: "100%", 
              boxShadow: "0 8px 24px rgba(37,211,102,0.35)", 
              cursor: "pointer" 
            }}
          >
            <span style={{ fontSize: 24 }}>💬</span>
            Open WhatsApp & Send Order
          </button>

          {!opened && countdown > 0 && (
            <div style={{ fontSize: 12, color: "var(--bark)", opacity: 0.5, marginTop: 14 }}>
              WhatsApp opens automatically in <span style={{ color: "var(--green)", fontWeight: 700 }}>{countdown}s</span>
            </div>
          )}

          {opened && (
            <div style={{ marginTop: 12, fontSize: 13, color: "var(--green3)", fontWeight: 700 }}>
              ✓ WhatsApp opened — please send the message!
            </div>
          )}

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" className="btn-p">
              Back to Home
            </Link>
            <Link href="/shop" className="btn-p">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
