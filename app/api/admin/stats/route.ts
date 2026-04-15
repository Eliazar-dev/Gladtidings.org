import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient()

    const [ordersRes, productsRes, reviewsRes, subscribersRes] = await Promise.all([
      supabase.from('orders').select('status, total'),
      supabase.from('products').select('id, stock, low_stock_threshold').eq('active', true),
      supabase.from('reviews').select('id, approved').eq('approved', false),
      supabase.from('newsletter_subscribers').select('id').eq('active', true),
    ])

    const orders = ordersRes.data ?? []
    const products = productsRes.data ?? []
    const pendingReviews = reviewsRes.data ?? []
    const subscribers = subscribersRes.data ?? []

    const totalRevenue = orders
      .filter(o => ['paid', 'completed'].includes(o.status))
      .reduce((s, o) => s + o.total, 0)

    const pendingOrders = orders.filter(o => o.status === 'pending_whatsapp').length
    const lowStockProducts = products.filter(p => p.stock <= p.low_stock_threshold)

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
        paidOrders: orders.filter(o => o.status === 'paid').length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        totalProducts: products.length,
        lowStockProducts: lowStockProducts.length,
        pendingReviews: pendingReviews.length,
        newsletterSubscribers: subscribers.length,
        ordersByStatus: {
          pending_whatsapp: orders.filter(o => o.status === 'pending_whatsapp').length,
          payment_sent: orders.filter(o => o.status === 'payment_sent').length,
          paid: orders.filter(o => o.status === 'paid').length,
          completed: orders.filter(o => o.status === 'completed').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length,
        },
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
