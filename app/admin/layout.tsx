"use client"

import '@/styles/globals.css'
import AuthProvider from '@/components/providers/AuthProvider'
import SiteLayout from '@/components/layout/SiteLayout'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for passcode cookie on client side
    const checkAuth = () => {
      const passcodeCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-passcode='))
      
      if (!passcodeCookie && pathname !== '/admin/gate') {
        router.push('/admin/gate')
      }
    }

    checkAuth()
  }, [pathname, router])

  return (
    <AuthProvider>
      <SiteLayout skipSiteComponents={true}>{children}</SiteLayout>
    </AuthProvider>
  )
}
