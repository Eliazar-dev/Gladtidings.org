"use client"

import { useCartStore } from '@/store/cartStore'
import { KES } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import CheckoutGate from '@/components/checkout/CheckoutGate'

const deliveryOptions = [
  { id:"standard", label:"Standard Delivery", desc:"3–5 business days", price:350, icon:"🚚" },
  { id:"express",  label:"Express Delivery",  desc:"1–2 business days", price:650, icon:"⚡" },
  { id:"pickup",   label:"Self Pickup",        desc:"Ngong Road, Nairobi", price:0, icon:"🏪" },
]

export default function CartPage() {
  const { items, updateQty, removeItem, totalPrice, clearCart, hasHydrated } = useCartStore()
  const [delivery, setDelivery] = useState("standard")
  const [coupon, setCoupon] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState("")
  const [mounted, setMounted] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Mock auth state - replace with real auth check

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !hasHydrated) {
    return null
  }

  const subtotal = totalPrice()
  const deliveryFee = subtotal >= 5000 && delivery !== "express" ? 0 : deliveryOptions.find(d => d.id === delivery)?.price || 0
  const discount = couponApplied ? Math.floor(subtotal * 0.1) : 0
  const total = subtotal + deliveryFee - discount

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "MISSION10") {
      setCouponApplied(true)
      setCouponError("")
    } else {
      setCouponError("Invalid coupon code")
    }
  }

  if (items.length === 0) {
    return (
      <>
        <div className="cart-page">
          <div className="empty">
            <div className="empty-icon">🛒</div>
            <div className="empty-title">Your cart is empty</div>
            <div className="empty-desc">Browse our natural remedies to add items to your cart.</div>
            <Link href="/shop" className="btn-p">
              Start Shopping
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="cart-page">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px 80px' }}>
          <div className="cart-layout">
            <div>
              <h2 style={{ fontFamily: 'var(--ff-h)', fontSize: 26, color: 'var(--green)', marginBottom: 24 }}>Shopping Cart</h2>
              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="ci-img" style={{ position: 'relative' }}>
                    <Image src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" unoptimized className="object-cover" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="ci-name">{item.name}</div>
                    <div className="ci-cat">{item.slug}</div>
                  </div>
                  <div className="ci-qty">
                    <button className="ci-qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                    <input className="ci-qty-n" value={item.qty} readOnly />
                    <button className="ci-qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <div className="ci-price">{KES(item.price * item.qty)}</div>
                  <button className="ci-rm" onClick={() => removeItem(item.id)}>✕</button>
                </div>
              ))}

              {/* Delivery Options */}
              <div style={{ marginTop: 32, background: '#fff', padding: 20, borderRadius: 12, border: '1px solid var(--border)' }}>
                <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 18, color: 'var(--green)', marginBottom: 16 }}>Delivery Method</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {deliveryOptions.map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => setDelivery(opt.id)}
                      style={{
                        border: delivery === opt.id ? '2px solid var(--green)' : '1px solid var(--border)',
                        borderRadius: 10,
                        padding: 16,
                        cursor: 'pointer',
                        transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
                        background: delivery === opt.id ? 'var(--mist)' : '#fff',
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{opt.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--bark)', marginBottom: 4 }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--bark)', opacity: 0.6, marginBottom: 8 }}>{opt.desc}</div>
                      <div style={{ fontFamily: 'var(--ff-h)', fontSize: 16, color: 'var(--gold)', fontWeight: 700 }}>
                        {opt.price === 0 ? 'FREE' : KES(opt.price)}
                      </div>
                    </div>
                  ))}
                </div>
                {subtotal >= 5000 && delivery !== "express" && (
                  <div style={{ marginTop: 12, fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                    🎉 Free standard delivery on orders over KES 5,000!
                  </div>
                )}
              </div>

              {/* Coupon Code */}
              <div style={{ marginTop: 16, background: '#fff', padding: 20, borderRadius: 12, border: '1px solid var(--border)' }}>
                <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 18, color: 'var(--green)', marginBottom: 16 }}>Coupon Code</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    disabled={couponApplied}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 14,
                      outline: 'none',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponApplied}
                    style={{
                      padding: '12px 24px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 700,
                      border: 'none',
                      background: couponApplied ? 'var(--mist)' : 'var(--green)',
                      color: couponApplied ? 'var(--green)' : '#fff',
                      cursor: couponApplied ? 'default' : 'pointer',
                    }}
                  >
                    {couponApplied ? 'Applied ✓' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <div style={{ marginTop: 8, fontSize: 12, color: 'var(--red)', fontWeight: 600 }}>
                    {couponError}
                </div>
                )}
                {couponApplied && (
                  <div style={{ marginTop: 8, fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                    10% discount applied!
                  </div>
                )}
              </div>
            </div>

            <div className="order-box">
              <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 18, color: 'var(--green)', marginBottom: 16 }}>Order Summary</h3>
              <div className="sum-row">
                <span>Subtotal</span>
                <span>{KES(subtotal)}</span>
              </div>
              <div className="sum-row">
                <span>Shipping</span>
                <span>{deliveryFee === 0 ? 'FREE' : KES(deliveryFee)}</span>
              </div>
              {discount > 0 && (
                <div className="sum-row">
                  <span style={{ color: 'var(--green)' }}>Discount</span>
                  <span style={{ color: 'var(--green)', fontWeight: 700 }}>− {KES(discount)}</span>
                </div>
              )}
              <div className="sum-total">
                <div className="sum-row" style={{ fontWeight: 700, color: 'var(--green)' }}>
                  <span>Total</span>
                  <span>{KES(total)}</span>
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                {isLoggedIn ? (
                  <Link href="/checkout" className="btn-gold">
                    Proceed to Checkout
                  </Link>
                ) : (
                  <button onClick={() => setGateOpen(true)} className="btn-gold">
                    Proceed to Checkout
                  </button>
                )}
              </div>
              <button
                style={{
                  width: '100%',
                  padding: 10,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--bark)',
                  opacity: 0.5,
                  fontSize: 12,
                  cursor: 'pointer',
                  marginTop: 12,
                }}
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <CheckoutGate isOpen={gateOpen} onClose={() => setGateOpen(false)} />
    </>
  )
}
