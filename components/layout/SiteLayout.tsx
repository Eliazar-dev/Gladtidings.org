"use client"

import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('./Navbar'), { ssr: false })
const Footer = dynamic(() => import('./Footer'), { ssr: false })
const WhatsAppButton = dynamic(() => import('@/components/global/WhatsAppButton'), { ssr: false })
const ScrollToTopButton = dynamic(() => import('@/components/global/ScrollToTopButton'), { ssr: false })
const CookieBanner = dynamic(() => import('@/components/global/CookieBanner'), { ssr: false })

export default function SiteLayout({ children, skipSiteComponents = false }: { children: React.ReactNode; skipSiteComponents?: boolean }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin') || skipSiteComponents

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
