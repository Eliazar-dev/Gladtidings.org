"use client"

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reviews')
      const data = await res.json()
      if (data.success) {
        setReviews(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      // Need to add DELETE endpoint for reviews
      const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Failed to delete review:', error)
    }
  }

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter((r: any) => r.rating <= (filter === 'low' ? 3 : 5))

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <div className="adm-layout">
      <AdminSidebar />
      <div className="adm-main">
        <div className="adm-topbar">
          <div className="adm-title">Reviews</div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
        ) : (
          <>
            <div className="g3" style={{ marginBottom: 24 }}>
              <div className="adm-stat">
                <div className="adm-stat-n">{reviews.length}</div>
                <div className="adm-stat-l">Total Reviews</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-n">{avgRating}</div>
                <div className="adm-stat-l">Average Rating</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-n">{reviews.filter((r: any) => r.rating >= 4).length}</div>
                <div className="adm-stat-l">5-Star Reviews</div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <select 
                style={{ padding: 8, borderRadius: 6, border: '1px solid var(--border)' }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Reviews</option>
                <option value="low">Low Ratings (1-3)</option>
                <option value="high">High Ratings (4-5)</option>
              </select>
            </div>

            <div className="adm-card">
              {filteredReviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--bark)', opacity: 0.6 }}>
                  No reviews found
                </div>
              ) : (
                filteredReviews.map((review, index) => (
                  <div key={review.id} style={{ 
                    padding: 20, 
                    borderBottom: index === filteredReviews.length - 1 ? 'none' : '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--bark)', marginBottom: 4 }}>
                          {review.author_name}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--bark)', opacity: 0.6 }}>
                          {review.author_email && review.author_email}
                        </div>
                        {review.author_location && (
                          <div style={{ fontSize: 12, color: 'var(--bark)', opacity: 0.5 }}>
                            {review.author_location}
                          </div>
                        )}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        gap: 4,
                        fontSize: 18,
                        color: 'var(--gold)'
                      }}>
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--bark)', lineHeight: 1.6, marginBottom: 12 }}>
                      {review.review_text}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 12, color: 'var(--bark)', opacity: 0.5 }}>
                        {new Date(review.created_at).toLocaleDateString('en-KE')}
                      </div>
                      <button 
                        className="adm-btn-danger"
                        onClick={() => handleDelete(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
