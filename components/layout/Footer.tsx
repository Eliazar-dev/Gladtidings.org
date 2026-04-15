"use client"

import Link from 'next/link'
import EmailIcon from '@/components/icons/EmailIcon'
import LinkedInIcon from '@/components/icons/LinkedInIcon'
import TikTokIcon from '@/components/icons/TikTokIcon'
import YouTubeIcon from '@/components/icons/YouTubeIcon'
import FacebookIcon from '@/components/icons/FacebookIcon'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-g">
        <div>
          <div style={{ fontFamily: 'var(--ff-h)', fontSize: 20, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: 'var(--gold)', width: 30, height: 30, borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🌿</span>
            Gladtidings Health
          </div>
          <p style={{ fontSize: 13, opacity: 0.58, lineHeight: 1.85, maxWidth: 240 }}>
            Bringing God&apos;s healing through nature to communities across Kenya and beyond.
          </p>
          <div style={{ marginTop: 16, fontSize: 12, opacity: 0.45 }}>
            📍 Awendo town, Migori Kenya<br />
            📞 +254 723 730980
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <a href="mailto:glad.tidings.health@gmail.com" style={{ color: 'var(--green3)', opacity: 0.6, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}>
              <EmailIcon size={20} />
            </a>
            <a href="https://www.linkedin.com/in/glad-tidings-85b3883a9" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green3)', opacity: 0.6, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}>
              <LinkedInIcon size={20} />
            </a>
            <a href="https://www.tiktok.com/@gladtidingshealth" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green3)', opacity: 0.6, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}>
              <TikTokIcon size={20} />
            </a>
            <a href="https://www.youtube.com/@GladTidingsHealth" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green3)', opacity: 0.6, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}>
              <YouTubeIcon size={20} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61587257731253" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green3)', opacity: 0.6, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}>
              <FacebookIcon size={20} />
            </a>
          </div>
        </div>
        {[
          { title: 'Shop', links: ['All Products', 'Herbal Teas', 'Tinctures', 'Supplements', 'New Arrivals'] },
          { title: 'Mission', links: ['Our Story', 'Field Reports', 'Blog', 'Donate', 'Volunteer'] },
          { title: 'Support', links: ['Contact Us', 'Shipping', 'Returns', 'FAQ', 'Privacy Policy'] },
        ].map((col) => (
          <div key={col.title}>
            <div className="footer-col-title">{col.title}</div>
            {col.links.map((link) => (
              <Link key={link} href="#" className="footer-link">
                {link}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© 2025 Gladtidings Health. Nairobi, Kenya. All rights reserved.</span>
      </div>
    </footer>
  )
}
