import Link from 'next/link'
import Image from 'next/image'
import { KES } from '@/lib/utils'

async function getRemedies() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/remedies`, {
    cache: 'no-store',
  })
  const data = await res.json()
  return data.data || []
}

export default async function RemediesPage() {
  const remedies = await getRemedies()

  return (
    <div className="pg">
      <div className="pg-h">
        <div>
          <h1>Natural Remedies</h1>
          <p>Discover our collection of natural health remedies and traditional healing solutions.</p>
        </div>
      </div>

      <div className="g3">
        {remedies.map((remedy: any) => (
          <Link key={remedy.id} href={`/remedies/${remedy.slug}`} className="c3">
            {remedy.images && remedy.images[0] && (
              <div className="c3i" style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image src={remedy.images[0]} alt={remedy.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" unoptimized />
              </div>
            )}
            <div className="c3b">
              <div className="c3t">{remedy.name}</div>
              <div className="c3c">{remedy.category || 'General'}</div>
              <div className="c3p">{KES(remedy.price)}</div>
            </div>
          </Link>
        ))}
      </div>

      {remedies.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--bark)', opacity: 0.6 }}>
          No remedies available at the moment.
        </div>
      )}
    </div>
  )
}
