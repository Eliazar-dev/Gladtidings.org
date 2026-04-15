"use client"

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const pathname = usePathname()
  const heroPages = ['/']
  const cartCount = useCartStore((state) => state.totalItems())
  const hasHydrated = useCartStore((state) => state.hasHydrated)

  // Mock user state - replace with actual auth state from your auth store
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null)

  useEffect(() => {
    setMounted(true)
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const isTransparent = mounted && heroPages.includes(pathname) && !scrolled

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ]

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase()
  }

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <Image
              src="https://i.postimg.cc/yxV8fW46/LOGO-removebg-preview.png"
              alt="Gladtidings Health"
              width={160}
              height={52}
              unoptimized
              priority
            />
          </Link>

          <ul className="nav-links">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <Link
              href="/search"
              className="nav-icon-btn"
              title="Search"
            >
              🔍
            </Link>
            <Link
              href="/cart"
              className="nav-icon-btn"
            >
              🛒
              <span 
                className="nav-badge" 
                style={{ 
                  opacity: hasHydrated && cartCount > 0 ? 1 : 0 
                }}
              >
                {hasHydrated ? (cartCount > 9 ? '9+' : cartCount) : ''}
              </span>
            </Link>
            
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  className="nav-avatar"
                  onClick={() => setAvatarOpen(!avatarOpen)}
                >
                  {getInitials(user.email)}
                </button>
                {avatarOpen && (
                  <div className="nav-avatar-menu">
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green)' }}>
                        {user.name || user.email}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--bark)', opacity: 0.6 }}>
                        {user.email}
                      </div>
                    </div>
                    <Link href="/account" className="nav-avatar-menu-item" onClick={() => setAvatarOpen(false)}>
                      📋 My Orders
                    </Link>
                    <Link href="/account" className="nav-avatar-menu-item" onClick={() => setAvatarOpen(false)}>
                      👤 My Account
                    </Link>
                    <div className="nav-avatar-divider" />
                    <button
                      className="nav-avatar-menu-item danger"
                      onClick={() => {
                        setUser(null)
                        setAvatarOpen(false)
                      }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="nav-login-btn">
                <UserIcon />
                <span>Login</span>
              </Link>
            )}
            
            <Link href="/shop" className="nav-shop-btn">
              Shop Now
            </Link>
            
            <button
              className={`burger ${open ? 'open' : ''}`}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="mob-drawer">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="mob-drawer-divider" />
          <Link href="/cart" onClick={() => setOpen(false)}>
            🛒 Cart <span style={{ opacity: hasHydrated && cartCount > 0 ? 1 : 0 }}>({hasHydrated ? cartCount : 0})</span>
          </Link>
          <div className="mob-drawer-actions">
            {user ? (
              <button
                className="mob-login-btn"
                onClick={() => {
                  setUser(null)
                  setOpen(false)
                }}
              >
                🚪 Sign Out
              </button>
            ) : (
              <Link href="/login" className="mob-login-btn" onClick={() => setOpen(false)}>
                <UserIcon />
                Login
              </Link>
            )}
            <Link href="/shop" className="mob-shop-btn" onClick={() => setOpen(false)}>
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
