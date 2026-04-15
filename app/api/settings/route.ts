import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const { data, error } = await supabase.from('settings').select('*')
    if (error) throw error

    // Convert to key-value object
    const settings = (data ?? []).reduce((acc, row) => {
      acc[row.key] = row.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({ success: true, data: settings })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const supabaseAdmin = createAdminClient()

    const updates = Object.entries(body).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabaseAdmin.from('settings').upsert(updates, { onConflict: 'key' })
    if (error) throw error

    return NextResponse.json({ success: true, message: 'Settings updated' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
