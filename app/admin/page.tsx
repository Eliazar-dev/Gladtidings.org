import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminPageClient from './AdminPageClient'

export default function AdminPage() {
  const cookieStore = cookies()
  const passcodeCookie = cookieStore.get('admin-passcode')?.value

  if (!passcodeCookie || passcodeCookie !== 'valid') {
    redirect('/admin/gate?redirect=/admin')
  }

  return <AdminPageClient />
}
