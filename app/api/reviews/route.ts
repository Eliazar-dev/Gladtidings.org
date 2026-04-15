import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { ReviewSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = ReviewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from('reviews').insert({
      product_id: parsed.data.productId,
      author_name: parsed.data.authorName,
      author_email: parsed.data.authorEmail ?? null,
      author_location: parsed.data.authorLocation ?? null,
      rating: parsed.data.rating,
      review_text: parsed.data.reviewText,
      approved: false, // admin must approve
    })

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Review submitted! It will appear after moderation.',
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
