import type { Metadata } from 'next'
import { Playfair_Display, Nunito } from 'next/font/google'
import '@/styles/globals.css'
import dynamic from 'next/dynamic'
import AuthProvider from '@/components/providers/AuthProvider'
import ConditionalLayout from '@/components/layout/ConditionalLayout'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--ff-h',
  display: 'swap',
  preload: true,
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--ff-b',
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
})

const Toast = dynamic(() => import('@/components/global/Toast'), { ssr: false })

export const metadata: Metadata = {
  title: 'Gladtidings Health - Natural Remedies',
  description: 'Bringing God\'s healing through nature to communities across Kenya and beyond.',
  icons: {
    icon: 'https://i.postimg.cc/yxV8fW46/LOGO-removebg-preview.png',
  },
  openGraph: {
    title: 'Gladtidings Health - Natural Remedies',
    description: 'Bringing God\'s healing through nature to communities across Kenya and beyond.',
    url: 'https://gladtidingshealth.org',
    siteName: 'Gladtidings Health',
    images: [
      {
        url: 'https://i.postimg.cc/yxV8fW46/LOGO-removebg-preview.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${nunito.variable}`}>
      <body>
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toast />
        </AuthProvider>
      </body>
    </html>
  )
}
