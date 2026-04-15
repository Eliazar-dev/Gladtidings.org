"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { KES } from '@/lib/utils'

export default function AdminProductsPage() {
  const router = useRouter()
  const [tab, setTab] = useState('list')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: 0,
    images: [],
    badge: '',
    featured: false,
    active: true,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products?includeInactive=true')
      const data = await res.json()
      if (data.success) {
        setProducts(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const url = editingProduct ? '/api/products' : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const payload = editingProduct 
        ? { ...formData, id: editingProduct.id }
        : formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      
      if (data.success) {
        setTab('list')
        setEditingProduct(null)
        setFormData({
          name: '',
          description: '',
          price: 0,
          stock: 0,
          category_id: 0,
          images: [],
          badge: '',
          featured: false,
          active: true,
        })
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id || 0,
      images: product.images || [],
      badge: product.badge || '',
      featured: product.featured || false,
      active: product.active !== false,
    })
    setTab('form')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const handleCancel = () => {
    setTab('list')
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category_id: 0,
      images: [],
      badge: '',
      featured: false,
      active: true,
    })
  }

  return (
    <div className="adm-layout">
      <AdminSidebar />
      <div className="adm-main">
        {tab === 'list' && (
          <>
            <div className="adm-topbar">
              <div className="adm-title">Products</div>
              <button className="adm-btn" onClick={() => setTab('form')}>+ Add Product</button>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
            ) : (
              <div className="adm-card">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Featured</th>
                      <th>Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.category?.name || 'Uncategorized'}</td>
                        <td>{KES(p.price)}</td>
                        <td>{p.stock}</td>
                        <td>{p.featured ? '✓' : '✗'}</td>
                        <td>{p.active !== false ? '✓' : '✗'}</td>
                        <td>
                          <button className="adm-btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                          <button className="adm-btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'form' && (
          <>
            <div className="adm-topbar">
              <div className="adm-title">{editingProduct ? 'Edit Product' : 'Add Product'}</div>
              <button className="adm-btn" onClick={handleCancel}>Cancel</button>
            </div>
            <div className="adm-card">
              <form onSubmit={handleSubmit}>
                <div className="fg">
                  <label className="fl">Product Name</label>
                  <input
                    className="fi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="fg">
                  <label className="fl">Description</label>
                  <textarea
                    className="fi"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="fg">
                    <label className="fl">Price (KES)</label>
                    <input
                      type="number"
                      className="fi"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="fg">
                    <label className="fl">Stock</label>
                    <input
                      type="number"
                      className="fi"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="fg">
                  <label className="fl">Badge (optional)</label>
                  <input
                    className="fi"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g., Bestseller, New"
                  />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    Featured
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                    Active
                  </label>
                </div>
                <div style={{ marginTop: 16 }}>
                  <button type="submit" className="adm-btn">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
