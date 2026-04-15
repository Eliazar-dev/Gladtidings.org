import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { NewsletterSchema } from '@/lib/validations'
import { sendNewsletterWelcomeEmail } from '@/lib/emails'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = NewsletterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, active')
      .eq('email', parsed.data.email)
      .single()

    if (existing) {
      if (existing.active) {
        return NextResponse.json({ success: true, message: 'Already subscribed!' })
      }
      // Re-activate
      await supabase.from('newsletter_subscribers')
        .update({ active: true, unsubscribed_at: null })
        .eq('email', parsed.data.email)
    } else {
      await supabase.from('newsletter_subscribers').insert({
        email: parsed.data.email,
        source: parsed.data.source ?? 'website',
      })
    }

    sendNewsletterWelcomeEmail(parsed.data.email).catch(console.error)

    return NextResponse.json({ success: true, message: 'Successfully subscribed!' }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
