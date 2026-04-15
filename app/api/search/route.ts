import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ success: true, products: [], blogs: [] })
    }

    const [productsRes, blogsRes] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, slug, price, images, badge, category:categories(name)')
        .eq('active', true)
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(6),
      supabase
        .from('blog_posts')
        .select('id, title, slug, tag, cover_image')
        .eq('published', true)
        .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,tag.ilike.%${q}%`)
        .limit(4),
    ])

    return NextResponse.json({
      success: true,
      products: productsRes.data ?? [],
      blogs: blogsRes.data ?? [],
      total: (productsRes.data?.length ?? 0) + (blogsRes.data?.length ?? 0),
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
