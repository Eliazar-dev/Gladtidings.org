import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CouponValidateSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = CouponValidateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }

    const { code, subtotal } = parsed.data

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single()

    if (error || !coupon) {
      return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 400 })
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'This coupon has expired' }, { status: 400 })
    }

    // Check max uses
    if (coupon.max_uses && coupon.uses >= coupon.max_uses) {
      return NextResponse.json({ success: false, error: 'This coupon has reached its usage limit' }, { status: 400 })
    }

    // Check minimum order
    if (subtotal < coupon.min_order) {
      return NextResponse.json({
        success: false,
        error: `Minimum order of KES ${coupon.min_order.toLocaleString()} required for this coupon`,
      }, { status: 400 })
    }

    // Calculate discount
    const discount = coupon.type === 'percent'
      ? Math.floor(subtotal * (coupon.value / 100))
      : coupon.value

    return NextResponse.json({
      success: true,
      coupon: { code: coupon.code, type: coupon.type, value: coupon.value },
      discount,
      message: coupon.type === 'percent'
        ? `${coupon.value}% discount applied!`
        : `KES ${coupon.value.toLocaleString()} discount applied!`,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
