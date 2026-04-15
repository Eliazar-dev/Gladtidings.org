"use client"

import { useState } from 'react'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  bucket?: 'products' | 'blog' | 'avatars'
}

export default function ImageUpload({ onUpload, currentImage, bucket = 'products' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || '')

  const handleFileSelect = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        setPreview(data.url)
        onUpload(data.url)
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlChange = (e: any) => {
    const url = e.target.value
    setPreview(url)
    onUpload(url)
  }

  return (
    <div>
      {preview && (
        <div style={{ marginBottom: 16 }}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              width: '100%', 
              maxWidth: 300, 
              height: 200, 
              objectFit: 'cover', 
              borderRadius: 8 
            }} 
          />
        </div>
      )}
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--bark)' }}>
          Upload from computer
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ width: '100%' }}
        />
        {uploading && <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 4 }}>Uploading...</div>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--bark)' }}>
          Or enter image URL
        </label>
        <input
          type="url"
          value={preview}
          onChange={handleUrlChange}
          placeholder="https://..."
          style={{ 
            width: '100%',
            padding: 10,
            borderRadius: 6,
            border: '1px solid var(--border)',
            fontSize: 14
          }}
        />
      </div>
    </div>
  )
}
