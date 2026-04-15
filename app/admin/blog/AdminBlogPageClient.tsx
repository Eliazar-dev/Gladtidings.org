"use client"

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ImageUpload from '@/components/admin/ImageUpload'

export default function AdminBlogPageClient() {
  const [tab, setTab] = useState('list')
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tag: '',
    cover_image: '',
    author_name: '',
    published: false,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/blog?includeUnpublished=true')
      const data = await res.json()
      if (data.success) {
        setPosts(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const url = editingPost ? '/api/blog' : '/api/blog'
      const method = editingPost ? 'PUT' : 'POST'
      
      const payload = editingPost 
        ? { ...formData, id: editingPost.id }
        : formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      
      if (data.success) {
        setTab('list')
        setEditingPost(null)
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          tag: '',
          cover_image: '',
          author_name: '',
          published: false,
        })
        fetchPosts()
      }
    } catch (error) {
      console.error('Failed to save blog post:', error)
    }
  }

  const handleEdit = (post: any) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content || '',
      excerpt: post.excerpt || '',
      tag: post.tag || '',
      cover_image: post.cover_image || '',
      author_name: post.author_name || '',
      published: post.published || false,
    })
    setTab('form')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Failed to delete blog post:', error)
    }
  }

  const handleCancel = () => {
    setTab('list')
    setEditingPost(null)
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      tag: '',
      cover_image: '',
      author_name: '',
      published: false,
    })
  }

  return (
    <div className="adm-layout">
      <AdminSidebar />
      <div className="adm-main">
        {tab === 'list' && (
          <>
            <div className="adm-topbar">
              <div className="adm-title">Blog Posts</div>
              <button className="adm-btn" onClick={() => setTab('form')}>+ Add Post</button>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
            ) : (
              <div className="adm-card">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Tag</th>
                      <th>Author</th>
                      <th>Published</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.title}</td>
                        <td>{p.tag || '-'}</td>
                        <td>{p.author_name || '-'}</td>
                        <td>{p.published ? '✓' : '✗'}</td>
                        <td>{new Date(p.created_at).toLocaleDateString()}</td>
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
              <div className="adm-title">{editingPost ? 'Edit Blog Post' : 'Add Blog Post'}</div>
              <button className="adm-btn" onClick={handleCancel}>Cancel</button>
            </div>
            <div className="adm-card">
              <form onSubmit={handleSubmit}>
                <div className="fg">
                  <label className="fl">Title</label>
                  <input
                    className="fi"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="fg">
                  <label className="fl">Excerpt</label>
                  <textarea
                    className="fi"
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                  />
                </div>
                <div className="fg">
                  <label className="fl">Content</label>
                  <textarea
                    className="fi"
                    rows={10}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>
                <div className="fg">
                  <label className="fl">Cover Image</label>
                  <ImageUpload
                    onUpload={(url) => setFormData({ ...formData, cover_image: url })}
                    currentImage={formData.cover_image}
                    bucket="blog"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="fg">
                    <label className="fl">Tag</label>
                    <input
                      className="fi"
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      placeholder="e.g., Nutrition, Health"
                    />
                  </div>
                  <div className="fg">
                    <label className="fl">Author</label>
                    <input
                      className="fi"
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      placeholder="Author name"
                    />
                  </div>
                </div>
                <div className="fg">
                  <label className="fl">Cover Image URL</label>
                  <input
                    className="fi"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    />
                    Published
                  </label>
                </div>
                <div style={{ marginTop: 16 }}>
                  <button type="submit" className="adm-btn">
                    {editingPost ? 'Update Post' : 'Create Post'}
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
