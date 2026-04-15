"use client"

import Link from 'next/link'

export default function OrderSuccessPage() {
  return (
    <>
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty" style={{ maxWidth: 500 }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>✓</div>
          <div className="empty-title">Order Placed Successfully!</div>
          <div className="empty-desc">
            Thank you for your purchase. We&apos;ll send you a confirmation email shortly with your order details and tracking information.
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-p">
              Return Home
            </Link>
            <Link href="/shop" className="btn-o">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
