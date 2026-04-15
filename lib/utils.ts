// KES currency formatter
export const KES = (amount: number): string =>
  `KES ${Number(amount).toLocaleString('en-KE')}`

// Generate unique order ID: GT-2025-XXXX
export const generateOrderId = (): string => {
  const year = new Date().getFullYear()
  const num = Math.floor(Math.random() * 9000) + 1000
  return `GT-${year}-${num}`
}

// Build WhatsApp message from order
export const buildWhatsAppMessage = (order: {
  id: string
  customerName: string
  customerPhone: string
  address?: string | null
  city?: string | null
  items: Array<{ product_name: string; quantity: number; unit_price: number; total_price: number }>
  subtotal: number
  shipping: number
  discount: number
  total: number
}): string => {
  const itemLines = order.items
    .map(i => `  • ${i.product_name} x${i.quantity} — ${KES(i.total_price)}`)
    .join('\n')

  const deliveryLine = order.address
    ? `📍 *Delivery:* ${order.address}${order.city ? ', ' + order.city : ''}`
    : `📍 *Delivery:* Self Pickup — Awendo, Migori - Skyrider House`

  return `🌿 *GLADTIDINGS HEALTH — NEW ORDER*

📋 *Order ID:* ${order.id}
👤 *Customer:* ${order.customerName}
📞 *Phone:* ${order.customerPhone}
${deliveryLine}

─────────────────────────
🛒 *ORDER ITEMS:*
${itemLines}
─────────────────────────
Subtotal:   ${KES(order.subtotal)}
Shipping:   ${order.shipping === 0 ? 'FREE' : KES(order.shipping)}${order.discount > 0 ? `\nDiscount:   - ${KES(order.discount)}` : ''}
*TOTAL:     ${KES(order.total)}*
─────────────────────────

💳 *Please send M-PESA payment request to this number.*

Once payment is confirmed, we will process and dispatch your order within 24 hours.

_Thank you for choosing Gladtidings Health! 🙏_`
}

// Slug generator
export const toSlug = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// Calculate shipping fee
export const calcShipping = (subtotal: number, method: string, settings?: Record<string, string>): number => {
  if (method === 'pickup') return 0
  if (method === 'express') return Number(settings?.express_shipping_fee ?? 650)
  const threshold = Number(settings?.free_shipping_threshold ?? 5000)
  if (subtotal >= threshold) return 0
  return Number(settings?.standard_shipping_fee ?? 350)
}

// Validate Kenyan phone number
export const isKenyanPhone = (phone: string): boolean =>
  /^(\+?254|0)[17]\d{8}$/.test(phone.replace(/\s/g, ''))

// Truncate text
export const truncate = (text: string, length = 120): string =>
  text.length > length ? text.substring(0, length) + '...' : text
