export type OrderStatus = 'pending_whatsapp' | 'payment_sent' | 'paid' | 'completed' | 'cancelled'
export type DeliveryMethod = 'standard' | 'express' | 'pickup'
export type UserRole = 'customer' | 'admin'
export type CouponType = 'percent' | 'fixed'

// Supabase User type (simplified)
export interface User {
  id: string
  email: string
  user_metadata: Record<string, any>
  created_at: string
}

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
  active: boolean
}

export interface Product {
  id: number
  name: string
  slug: string
  category_id: number
  category?: Category
  price: number
  compare_price: number | null
  description: string | null
  ingredients: string | null
  usage_instructions: string | null
  images: string[]
  badge: string | null
  stock: number
  low_stock_threshold: number
  sku: string | null
  active: boolean
  featured: boolean
  rating_avg: number
  rating_count: number
  created_at: string
  updated_at: string
}

// Legacy Product type for compatibility with existing code
export interface LegacyProduct {
  id: number
  name: string
  cat: string
  price: number
  img: string
  badge: string | null
  desc: string
  stock: number
}

export interface CartItem {
  id: number
  name: string
  slug: string
  price: number
  images: string[]
  category_id: number
  qty: number
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: number | null
  product_name: string
  product_image: string | null
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: string
  user_id: string | null
  customer_name: string
  customer_phone: string
  customer_email: string
  delivery_method: DeliveryMethod
  address: string | null
  city: string | null
  county: string | null
  notes: string | null
  subtotal: number
  shipping: number
  discount: number
  total: number
  coupon_code: string | null
  status: OrderStatus
  whatsapp_sent_at: string | null
  payment_sent_at: string | null
  paid_at: string | null
  completed_at: string | null
  cancelled_at: string | null
  cancel_reason: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface Coupon {
  code: string
  type: CouponType
  value: number
  min_order: number
  max_uses: number | null
  uses: number
  active: boolean
  expires_at: string | null
}

export interface Review {
  id: string
  product_id: number
  user_id: string | null
  author_name: string
  author_email: string | null
  author_location: string | null
  rating: number
  review_text: string
  verified_purchase: boolean
  approved: boolean
  created_at: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  tag: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  author_name: string
  author_bio: string | null
  author_image: string | null
  read_time: string
  published: boolean
  featured: boolean
  views: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string
  street: string
  city: string
  county: string
  country: string
  is_default: boolean
}

export interface Setting {
  key: string
  value: string
  updated_at: string
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

// Form types
export interface CheckoutForm {
  firstName: string
  lastName: string
  phone: string
  email: string
  deliveryMethod: DeliveryMethod
  address: string
  city: string
  county: string
  notes: string
  couponCode: string
}

export interface CreateOrderPayload {
  customerName: string
  customerPhone: string
  customerEmail: string
  deliveryMethod: DeliveryMethod
  address?: string
  city?: string
  county?: string
  notes?: string
  items: Array<{
    productId: number
    productName: string
    productImage?: string
    quantity: number
    unitPrice: number
  }>
  subtotal: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
}

