import { notFound } from 'next/navigation'
import Link from 'next/link'
import { KES } from '@/lib/utils'

async function getRemedyBySlug(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/remedies`, {
    cache: 'no-store',
  })
  const data = await res.json()
  const remedy = (data.data || []).find((r: any) => r.slug === slug)
  return remedy
}

export default async function RemedyDetailPage({ params }: { params: { slug: string } }) {
  const remedy = await getRemedyBySlug(params.slug)

  if (!remedy) {
    notFound()
  }

  return (
    <div className="pg">
      <Link href="/remedies" style={{ display: 'inline-block', marginBottom: 24, color: 'var(--green)' }}>
        ← Back to Remedies
      </Link>

      <div className="g2" style={{ alignItems: 'start' }}>
        {remedy.images && remedy.images[0] && (
          <div style={{ flex: 1 }}>
            <img 
              src={remedy.images[0]} 
              alt={remedy.name} 
              style={{ 
                width: '100%', 
                height: 'auto', 
                borderRadius: 12,
                objectFit: 'cover'
              }} 
            />
          </div>
        )}

        <div style={{ flex: 1 }}>
          {remedy.category && (
            <div style={{ 
              display: 'inline-block', 
              padding: '4px 12px', 
              backgroundColor: 'var(--green)', 
              color: 'white', 
              borderRadius: 20, 
              fontSize: 12, 
              marginBottom: 16 
            }}>
              {remedy.category}
            </div>
          )}
          
          <h1 style={{ fontFamily: 'var(--ff-h)', fontSize: 32, marginBottom: 16 }}>{remedy.name}</h1>
          
          {remedy.price > 0 && (
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--green)', marginBottom: 24 }}>
              {KES(remedy.price)}
            </div>
          )}

          <p style={{ lineHeight: 1.7, marginBottom: 24 }}>{remedy.description}</p>

          {remedy.ingredients && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 18, marginBottom: 8 }}>Ingredients</h3>
              <p style={{ lineHeight: 1.6 }}>{remedy.ingredients}</p>
            </div>
          )}

          {remedy.benefits && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 18, marginBottom: 8 }}>Benefits</h3>
              <p style={{ lineHeight: 1.6 }}>{remedy.benefits}</p>
            </div>
          )}

          {remedy.usage_instructions && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 18, marginBottom: 8 }}>How to Use</h3>
              <p style={{ lineHeight: 1.6 }}>{remedy.usage_instructions}</p>
            </div>
          )}

          {remedy.precautions && (
            <div style={{ marginBottom: 24, padding: 16, backgroundColor: 'var(--bg)', borderRadius: 8 }}>
              <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: 18, marginBottom: 8, color: '#d97706' }}>Precautions</h3>
              <p style={{ lineHeight: 1.6 }}>{remedy.precautions}</p>
            </div>
          )}

          {remedy.stock > 0 ? (
            <button 
              className="btn"
              style={{ width: '100%', marginTop: 16 }}
              onClick={() => alert('Add to cart functionality coming soon!')}
            >
              Add to Cart
            </button>
          ) : (
            <button 
              disabled
              style={{ 
                width: '100%', 
                marginTop: 16,
                padding: 12,
                backgroundColor: '#ccc',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'not-allowed'
              }}
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
