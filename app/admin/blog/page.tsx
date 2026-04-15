import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminBlogPageClient from './AdminBlogPageClient'

export default function AdminBlogPage() {
  const cookieStore = cookies()
  const passcodeCookie = cookieStore.get('admin-passcode')?.value

  if (!passcodeCookie || passcodeCookie !== 'valid') {
    redirect('/admin/gate?redirect=/admin/blog')
  }

  return <AdminBlogPageClient />
}
