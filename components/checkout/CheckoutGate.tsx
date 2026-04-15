'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

interface CheckoutGateProps {
  isOpen: boolean
  onClose: () => void
}

export default function CheckoutGate({ isOpen, onClose }: CheckoutGateProps) {
  const router = useRouter()

  const handleGoogleAuth = () => {
    router.push('/login?redirect=/checkout')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="gate-overlay" onClick={onClose}>
      <div className="gate-card" onClick={e => e.stopPropagation()}>
        <div className="gate-icon">🔐</div>
        <h2 className="gate-title">Sign In to Checkout</h2>
        <p className="gate-sub">
          To complete your purchase, please sign in to your account. This helps us track your orders and provide you with better service.
        </p>

        <div className="gate-benefits">
          <div className="gate-benefit">✓ Track your orders in real-time</div>
          <div className="gate-benefit">✓ Receive WhatsApp order updates</div>
          <div className="gate-benefit">✓ Save items to your wishlist</div>
          <div className="gate-benefit">✓ Get exclusive discounts</div>
        </div>

        <button onClick={handleGoogleAuth} className="google-btn-primary" style={{ marginBottom: 12 }}>
          <GoogleIcon />
          Continue with Google
        </button>

        <Link href="/login?redirect=/checkout" className="btn-p btn-full" onClick={onClose} style={{ background: 'transparent', color: 'var(--green)', border: '2px solid var(--green)' }}>
          Sign In / Create Account
        </Link>

        <button onClick={onClose} style={{ marginTop: 16, background: 'none', border: 'none', color: 'var(--bark)', opacity: 0.6, fontSize: 13, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}
