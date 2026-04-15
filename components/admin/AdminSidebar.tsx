"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminSidebar() {
  const pathname = usePathname()
  
  const navItems = [
    { id: '/admin', icon: '📊', l: 'Dashboard' },
    { id: '/admin/products', icon: '🌿', l: 'Products' },
    { id: '/admin/remedies', icon: '💊', l: 'Remedies' },
    { id: '/admin/orders', icon: '📦', l: 'Orders' },
    { id: '/admin/blog', icon: '✍️', l: 'Blog Posts' },
    { id: '/admin/team', icon: '👥', l: 'Team Members' },
    { id: '/admin/reviews', icon: '⭐', l: 'Reviews' },
    { id: '/admin/settings', icon: '⚙️', l: 'Settings' },
  ]

  return (
    <div className="adm-sidebar">
      <div className="adm-logo">
        <span>🌿</span>
        <div>
          <div>Gladtidings</div>
          <div style={{ fontSize: 10, opacity: 0.55, fontFamily: 'var(--ff-b)', letterSpacing: '0.1em' }}>
            ADMIN PANEL
          </div>
        </div>
      </div>
      <div className="adm-nav">
        {navItems.map((n) => (
          <Link
            key={n.id}
            href={n.id}
            className={`adm-link ${pathname === n.id ? 'active' : ''}`}
          >
            <span className="adm-link-icon">{n.icon}</span>
            {n.l}
          </Link>
        ))}
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
          <Link href="/" className="adm-link">
            <span className="adm-link-icon">↩️</span>
            View Website
          </Link>
        </div>
      </div>
    </div>
  )
}
