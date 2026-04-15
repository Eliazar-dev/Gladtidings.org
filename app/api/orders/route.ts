import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Helper to generate unique order ID
const genOrderId = () => {
  const date = new Date()
  const year = date.getFullYear()
  const num = Math.floor(Math.random() * 9000) + 1000
  return `GT-${year}-${num}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      customerName,
      customerPhone,
      customerEmail,
      delivery,
      address,
      city,
      county,
      notes,
      items,
      subtotal,
      shipping,
      discount,
      total,
    } = body

    // Validate required fields
    if (!customerName || !customerPhone || !customerEmail || !items || !total) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const orderId = genOrderId()
    
    const order = {
      id: orderId,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      delivery_method: delivery || 'standard',
      address: address || '',
      city: city || '',
      county: county || '',
      notes: notes || '',
      items: items,
      subtotal: subtotal,
      shipping: shipping,
      discount: discount,
      total: total,
      status: 'pending_whatsapp',
      whatsapp_sent_at: null,
      payment_sent_at: null,
      paid_at: null,
      completed_at: null,
      cancelled_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Save to Supabase
    const { data, error } = await supabase.from('orders').insert(order).select().single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create order in database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      order: data,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
