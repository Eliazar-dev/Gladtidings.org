import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { ContactSchema } from '@/lib/validations'
import { sendContactAutoReply, sendContactNotification } from '@/lib/emails'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = ContactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const supabase = createAdminClient()
    await supabase.from('contact_messages').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject ?? null,
      message: parsed.data.message,
    })

    // Send emails (non-blocking)
    sendContactAutoReply(parsed.data).catch(console.error)
    sendContactNotification(parsed.data).catch(console.error)

    return NextResponse.json({ success: true, message: 'Message sent successfully!' }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
