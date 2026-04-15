import { z } from 'zod'

export const CreateOrderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().refine(
    (v) => /^(\+?254|0)[17]\d{8}$/.test(v.replace(/\s/g, '')),
    'Enter a valid Kenyan phone number'
  ),
  customerEmail: z.string().email('Invalid email address'),
  deliveryMethod: z.enum(['standard', 'express', 'pickup']),
  address: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.number(),
    productName: z.string(),
    productImage: z.string().optional(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
  })).min(1, 'Cart cannot be empty'),
  subtotal: z.number().min(0),
  shipping: z.number().min(0),
  discount: z.number().min(0),
  total: z.number().min(0),
  couponCode: z.string().optional(),
})

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['payment_sent', 'paid', 'completed', 'cancelled']),
  cancelReason: z.string().optional(),
})

export const ReviewSchema = z.object({
  productId: z.number(),
  authorName: z.string().min(2),
  authorEmail: z.string().email().optional(),
  authorLocation: z.string().optional(),
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(10, 'Review must be at least 10 characters'),
})

export const NewsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional(),
})

export const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10),
})

export const CouponValidateSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be positive'),
  category_id: z.number().optional(),
  images: z.array(z.string()).optional(),
  badge: z.string().optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
})

export const blogPostSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().optional(),
  content: z.string().min(10, 'Content is required'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  tag: z.string().optional(),
  cover_image: z.string().optional(),
  author_name: z.string().optional(),
  published: z.boolean().default(false),
})

export const remedySchema = z.object({
  name: z.string().min(2, 'Remedy name is required'),
  slug: z.string().optional(),
  category: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
  ingredients: z.string().optional(),
  benefits: z.string().optional(),
  usage_instructions: z.string().optional(),
  precautions: z.string().optional(),
  images: z.array(z.string()).optional(),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be positive'),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
})
