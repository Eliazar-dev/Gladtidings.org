"use client"

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    whatsapp_number: '',
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    shipping_standard: 0,
    shipping_express: 0,
    free_shipping_threshold: 0,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.success && data.data) {
        setSettings(data.data)
        setFormData({
          site_name: data.data.site_name || '',
          site_description: data.data.site_description || '',
          contact_email: data.data.contact_email || '',
          contact_phone: data.data.contact_phone || '',
          whatsapp_number: data.data.whatsapp_number || '',
          social_facebook: data.data.social_facebook || '',
          social_instagram: data.data.social_instagram || '',
          social_twitter: data.data.social_twitter || '',
          shipping_standard: data.data.shipping_standard || 0,
          shipping_express: data.data.shipping_express || 0,
          free_shipping_threshold: data.data.free_shipping_threshold || 0,
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setSettings(data.data)
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="adm-layout">
      <AdminSidebar />
      <div className="adm-main">
        <div className="adm-topbar">
          <div className="adm-title">Settings</div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
        ) : (
          <div className="adm-card">
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 18, color: 'var(--green)', marginBottom: 16 }}>General Settings</h3>
              
              <div className="fg">
                <label className="fl">Site Name</label>
                <input
                  className="fi"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                />
              </div>
              
              <div className="fg">
                <label className="fl">Site Description</label>
                <textarea
                  className="fi"
                  rows={3}
                  value={formData.site_description}
                  onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                />
              </div>

              <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 18, color: 'var(--green)', marginBottom: 16, marginTop: 32 }}>Contact Information</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="fg">
                  <label className="fl">Contact Email</label>
                  <input
                    type="email"
                    className="fi"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  />
                </div>
                <div className="fg">
                  <label className="fl">Contact Phone</label>
                  <input
                    className="fi"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="fg">
                <label className="fl">WhatsApp Number</label>
                <input
                  className="fi"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  placeholder="254700123456"
                />
              </div>

              <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 18, color: 'var(--green)', marginBottom: 16, marginTop: 32 }}>Social Media</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div className="fg">
                  <label className="fl">Facebook</label>
                  <input
                    className="fi"
                    value={formData.social_facebook}
                    onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="fg">
                  <label className="fl">Instagram</label>
                  <input
                    className="fi"
                    value={formData.social_instagram}
                    onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="fg">
                  <label className="fl">Twitter</label>
                  <input
                    className="fi"
                    value={formData.social_twitter}
                    onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>

              <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 18, color: 'var(--green)', marginBottom: 16, marginTop: 32 }}>Shipping</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div className="fg">
                  <label className="fl">Standard Shipping (KES)</label>
                  <input
                    type="number"
                    className="fi"
                    value={formData.shipping_standard}
                    onChange={(e) => setFormData({ ...formData, shipping_standard: Number(e.target.value) })}
                  />
                </div>
                <div className="fg">
                  <label className="fl">Express Shipping (KES)</label>
                  <input
                    type="number"
                    className="fi"
                    value={formData.shipping_express}
                    onChange={(e) => setFormData({ ...formData, shipping_express: Number(e.target.value) })}
                  />
                </div>
                <div className="fg">
                  <label className="fl">Free Shipping Threshold (KES)</label>
                  <input
                    type="number"
                    className="fi"
                    value={formData.free_shipping_threshold}
                    onChange={(e) => setFormData({ ...formData, free_shipping_threshold: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <button type="submit" className="adm-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
