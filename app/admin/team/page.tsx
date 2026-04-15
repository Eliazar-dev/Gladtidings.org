'use client'

import { useState, useEffect } from 'react'
import ImageUpload from '@/components/admin/ImageUpload'

interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  image_url: string
  sort_order: number
  active: boolean
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    sort_order: 0,
    active: true
  })

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/team')
      const { data } = await res.json()
      setTeam(data || [])
    } catch (error) {
      console.error('Failed to fetch team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingMember) {
        await fetch(`/api/team/${editingMember.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      setModalOpen(false)
      setEditingMember(null)
      resetForm()
      fetchTeam()
    } catch (error) {
      console.error('Failed to save team member:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    try {
      await fetch(`/api/team/${id}`, { method: 'DELETE' })
      fetchTeam()
    } catch (error) {
      console.error('Failed to delete team member:', error)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image_url: member.image_url,
      sort_order: member.sort_order,
      active: member.active
    })
    setModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      image_url: '',
      sort_order: 0,
      active: true
    })
  }

  if (loading) {
    return <div style={{ padding: 32, textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--ff-h)', fontSize: 26, color: 'var(--green)' }}>Team Members</h2>
        <button
          onClick={() => { setEditingMember(null); resetForm(); setModalOpen(true) }}
          style={{
            background: 'var(--green)',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          + Add Member
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {team.map((member) => (
          <div key={member.id} className="adm-card" style={{ textAlign: 'center' }}>
            {member.image_url && (
              <img
                src={member.image_url}
                alt={member.name}
                style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }}
              />
            )}
            <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 18, color: 'var(--green)', marginBottom: 4 }}>
              {member.name}
            </h3>
            <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--green3)', fontWeight: 700, marginBottom: 8 }}>
              {member.role}
            </p>
            <p style={{ fontSize: 13, color: 'var(--bark)', opacity: 0.65, lineHeight: 1.6, marginBottom: 16 }}>
              {member.bio}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button
                onClick={() => handleEdit(member)}
                className="adm-btn-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="adm-btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-bg" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-title">
              <h2 style={{ fontFamily: 'var(--ff-h)', fontSize: 22, color: 'var(--green)' }}>
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="fg" style={{ marginBottom: 16 }}>
                <label className="fl">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="adm-input"
                />
              </div>
              <div className="fg" style={{ marginBottom: 16 }}>
                <label className="fl">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="adm-input"
                />
              </div>
              <div className="fg" style={{ marginBottom: 16 }}>
                <label className="fl">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="adm-input"
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="fg" style={{ marginBottom: 16 }}>
                <label className="fl">Image</label>
                <ImageUpload
                  onUpload={(url) => setFormData({ ...formData, image_url: url })}
                  currentImage={formData.image_url}
                  bucket="avatars"
                />
              </div>
              <div className="fg" style={{ marginBottom: 16 }}>
                <label className="fl">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                  className="adm-input"
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={e => setFormData({ ...formData, active: e.target.checked })}
                    style={{ width: 18, height: 18 }}
                  />
                  <span style={{ fontSize: 14, color: 'var(--bark)' }}>Active</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="adm-btn">
                  {editingMember ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: 'transparent',
                    color: 'var(--bark)',
                    border: '1px solid var(--border)'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
