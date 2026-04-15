import { resend, FROM_EMAIL, FROM_NAME, ADMIN_EMAIL } from '../resend'
import { KES } from '../utils'

// Order confirmation email
export async function sendOrderConfirmationEmail(data: {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{ product_name: string; quantity: number; unit_price: number; total_price: number }>
  subtotal: number
  shipping: number
  discount: number
  total: number
}) {
  const itemLines = data.items
    .map(i => `<li style="margin: 8px 0; padding: 8px; background: #f5f5f5; border-radius: 4px;">
      <strong>${i.product_name}</strong> x${i.quantity} — ${KES(i.total_price)}
    </li>`)
    .join('')

  await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.customerEmail,
    subject: `Order Confirmation - ${data.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2d6a4f;">Order Confirmed! 🌿</h1>
        <p>Hi ${data.customerName},</p>
        <p>Thank you for your order! We've received it and will process it shortly.</p>
        <h2 style="color: #2d6a4f;">Order #${data.orderId}</h2>
        <ul style="list-style: none; padding: 0;">${itemLines}</ul>
        <div style="margin-top: 20px; padding: 15px; background: #f0f7f4; border-radius: 8px;">
          <p><strong>Subtotal:</strong> ${KES(data.subtotal)}</p>
          <p><strong>Shipping:</strong> ${data.shipping === 0 ? 'FREE' : KES(data.shipping)}</p>
          ${data.discount > 0 ? `<p><strong>Discount:</strong> -${KES(data.discount)}</p>` : ''}
          <p style="font-size: 18px; color: #2d6a4f;"><strong>Total:</strong> ${KES(data.total)}</p>
        </div>
        <p style="margin-top: 20px;">We'll send you a WhatsApp message with payment instructions shortly.</p>
        <p>Blessings,<br>Gladtidings Health Team</p>
      </div>
    `,
  })
}

// Order status update email
export async function sendOrderStatusEmail(order: any, status: string) {
  await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: order.customer_email,
    subject: `Order Status Update - ${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2d6a4f;">Order Status Updated</h1>
        <p>Hi ${order.customer_name},</p>
        <p>Your order <strong>#${order.id}</strong> status has been updated to: <strong>${status.toUpperCase()}</strong></p>
        <p>Thank you for choosing Gladtidings Health!</p>
      </div>
    `,
  })
}

// Newsletter welcome email
export async function sendNewsletterWelcomeEmail(email: string) {
  await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: 'Welcome to Gladtidings Health!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2d6a4f;">Welcome! 🌿</h1>
        <p>Thank you for subscribing to our newsletter!</p>
        <p>You'll receive updates on new products, health tips, and exclusive offers.</p>
        <p>Blessings,<br>Gladtidings Health Team</p>
      </div>
    `,
  })
}

// Contact form auto-reply
export async function sendContactAutoReply(data: { name: string; email: string }) {
  await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.email,
    subject: 'Message Received - Gladtidings Health',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2d6a4f;">Message Received</h1>
        <p>Hi ${data.name},</p>
        <p>Thank you for reaching out! We've received your message and will get back to you within 24 hours.</p>
        <p>Blessings,<br>Gladtidings Health Team</p>
      </div>
    `,
  })
}

// Contact form notification to admin
export async function sendContactNotification(data: { name: string; email: string; subject?: string; message: string }) {
  await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `New Contact Message from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2d6a4f;">New Contact Message</h1>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 4px;">${data.message}</p>
      </div>
    `,
  })
}
