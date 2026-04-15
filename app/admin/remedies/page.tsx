"use client"

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ImageUpload from '@/components/admin/ImageUpload'
import { KES } from '@/lib/utils'

export default function AdminRemediesPage() {
  const [tab, setTab] = useState('list')
  const [remedies, setRemedies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRemedy, setEditingRemedy] = useState<any>(null)
  const [formData, setFormData] = useState<{
    name: string
    category: string
    description: string
    ingredients: string
    benefits: string
    usage_instructions: string
    precautions: string
    images: string[]
    price: number
    stock: number
    featured: boolean
    active: boolean
  }>({
    name: '',
    category: '',
    description: '',
    ingredients: '',
    benefits: '',
    usage_instructions: '',
    precautions: '',
    images: [],
    price: 0,
    stock: 0,
    featured: false,
    active: true,
  })

  useEffect(() => {
    fetchRemedies()
  }, [])

  const fetchRemedies = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/remedies?includeInactive=true')
      const data = await res.json()
      if (data.success) {
        setRemedies(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch remedies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const url = editingRemedy ? '/api/remedies' : '/api/remedies'
      const method = editingRemedy ? 'PUT' : 'POST'
      
      const payload = editingRemedy 
        ? { ...formData, id: editingRemedy.id }
        : formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      
      if (data.success) {
        setTab('list')
        setEditingRemedy(null)
        setFormData({
          name: '',
          category: '',
          description: '',
          ingredients: '',
          benefits: '',
          usage_instructions: '',
          precautions: '',
          images: [],
          price: 0,
          stock: 0,
          featured: false,
          active: true,
        })
        fetchRemedies()
      }
    } catch (error) {
      console.error('Failed to save remedy:', error)
    }
  }

  const handleEdit = (remedy: any) => {
    setEditingRemedy(remedy)
    setFormData({
      name: remedy.name,
      category: remedy.category || '',
      description: remedy.description || '',
      ingredients: remedy.ingredients || '',
      benefits: remedy.benefits || '',
      usage_instructions: remedy.usage_instructions || '',
      precautions: remedy.precautions || '',
      images: remedy.images || [],
      price: remedy.price || 0,
      stock: remedy.stock || 0,
      featured: remedy.featured || false,
      active: remedy.active !== false,
    })
    setTab('form')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this remedy?')) return
    
    try {
      const res = await fetch(`/api/remedies?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchRemedies()
      }
    } catch (error) {
      console.error('Failed to delete remedy:', error)
    }
  }

  const handleCancel = () => {
    setTab('list')
    setEditingRemedy(null)
    setFormData({
      name: '',
      category: '',
      description: '',
      ingredients: '',
      benefits: '',
      usage_instructions: '',
      precautions: '',
      images: [],
      price: 0,
      stock: 0,
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
              <div className="adm-title">Remedies</div>
              <button className="adm-btn" onClick={() => setTab('form')}>+ Add Remedy</button>
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
                    {remedies.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.name}</td>
                        <td>{r.category || '-'}</td>
                        <td>{KES(r.price)}</td>
                        <td>{r.stock}</td>
                        <td>{r.featured ? '✓' : '✗'}</td>
                        <td>{r.active !== false ? '✓' : '✗'}</td>
                        <td>
                          <button className="adm-btn-sm" onClick={() => handleEdit(r)}>Edit</button>
                          <button className="adm-btn-danger" onClick={() => handleDelete(r.id)}>Delete</button>
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
              <div className="adm-title">{editingRemedy ? 'Edit Remedy' : 'Add Remedy'}</div>
              <button className="adm-btn" onClick={handleCancel}>Cancel</button>
            </div>
            <div className="adm-card">
              <form onSubmit={handleSubmit}>
                <div className="fg">
                  <label className="fl">Remedy Name</label>
                  <input
                    className="fi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="fg">
                  <label className="fl">Category</label>
                  <input
                    className="fi"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Superfoods, Stress Relief, Heart Health"
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
                <div className="fg">
                  <label className="fl">Ingredients</label>
                  <textarea
                    className="fi"
                    rows={3}
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="List the ingredients..."
                  />
                </div>
                <div className="fg">
                  <label className="fl">Benefits</label>
                  <textarea
                    className="fi"
                    rows={3}
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    placeholder="Health benefits..."
                  />
                </div>
                <div className="fg">
                  <label className="fl">Usage Instructions</label>
                  <textarea
                    className="fi"
                    rows={3}
                    value={formData.usage_instructions}
                    onChange={(e) => setFormData({ ...formData, usage_instructions: e.target.value })}
                    placeholder="How to use this remedy..."
                  />
                </div>
                <div className="fg">
                  <label className="fl">Precautions</label>
                  <textarea
                    className="fi"
                    rows={3}
                    value={formData.precautions}
                    onChange={(e) => setFormData({ ...formData, precautions: e.target.value })}
                    placeholder="Any warnings or precautions..."
                  />
                </div>
                <div className="fg">
                  <label className="fl">Images</label>
                  <ImageUpload
                    onUpload={(url) => setFormData({ ...formData, images: [...formData.images, url] })}
                    currentImage={formData.images[0]}
                    bucket="products"
                  />
                  {formData.images.length > 0 && (
                    <div style={{ marginTop: 8, fontSize: 12 }}>
                      {formData.images.length} image(s) added
                    </div>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="fg">
                    <label className="fl">Price (KES)</label>
                    <input
                      type="number"
                      className="fi"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="fg">
                    <label className="fl">Stock</label>
                    <input
                      type="number"
                      className="fi"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    />
                  </div>
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
                    {editingRemedy ? 'Update Remedy' : 'Create Remedy'}
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
