"use client"

import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('./Navbar'), { ssr: false })
const Footer = dynamic(() => import('./Footer'), { ssr: false })
const WhatsAppButton = dynamic(() => import('@/components/global/WhatsAppButton'), { ssr: false })
const ScrollToTopButton = dynamic(() => import('@/components/global/ScrollToTopButton'), { ssr: false })
const CookieBanner = dynamic(() => import('@/components/global/CookieBanner'), { ssr: false })

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && <ScrollToTopButton />}
      {!isAdmin && <CookieBanner />}
    </>
  )
}
