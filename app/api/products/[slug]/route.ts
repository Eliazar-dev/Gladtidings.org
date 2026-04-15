import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name, slug), reviews(id, author_name, author_location, rating, review_text, verified_purchase, created_at)')
      .eq('slug', params.slug)
      .eq('active', true)
      .eq('reviews.approved', true)
      .single()

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    // Increment view (fire and forget)
    supabase.rpc('increment_product_views', { p_id: data.id }).then()

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
