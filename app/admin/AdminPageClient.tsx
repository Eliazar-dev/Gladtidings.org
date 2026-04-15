"use client"

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import type { Product, BlogPost } from '@/types'
import { KES } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export default function AdminPageClient() {
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
    fetchData()
  }, [])

  const checkSession = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsRes, ordersRes, blogsRes, statsRes] = await Promise.all([
        supabase.from('products').select('*').range(0, 5),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).range(0, 5),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).range(0, 5),
        fetch('/api/admin/stats').then(r => r.json())
      ])

      if (productsRes.data) setProducts(productsRes.data)
      if (ordersRes.data) setOrders(ordersRes.data)
      if (blogsRes.data) setBlogs(blogsRes.data)
      if (statsRes.success) setStats(statsRes.data)
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="adm-layout">
        <AdminSidebar />
        <div className="adm-main">
          <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="adm-layout">
      <AdminSidebar />
      <div className="adm-main">
        <div className="adm-topbar">
          <div className="adm-title">Dashboard</div>
        </div>

        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div className="adm-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 'bold' }}>{stats.products || 0}</div>
              <div style={{ color: '#666' }}>Products</div>
            </div>
            <div className="adm-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 'bold' }}>{stats.orders || 0}</div>
              <div style={{ color: '#666' }}>Orders</div>
            </div>
            <div className="adm-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 'bold' }}>{stats.blogs || 0}</div>
              <div style={{ color: '#666' }}>Blog Posts</div>
            </div>
            <div className="adm-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 'bold' }}>{KES(stats.revenue || 0)}</div>
              <div style={{ color: '#666' }}>Revenue</div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
          <div className="adm-card">
            <h3 style={{ marginBottom: 16 }}>Recent Orders</h3>
            {orders.length === 0 ? (
              <div style={{ color: '#666' }}>No orders yet</div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer_name}</td>
                      <td>{KES(order.total)}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="adm-card">
            <h3 style={{ marginBottom: 16 }}>Recent Blog Posts</h3>
            {blogs.length === 0 ? (
              <div style={{ color: '#666' }}>No blog posts yet</div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Published</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>{blog.title}</td>
                      <td>{blog.published ? '✓' : '✗'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
