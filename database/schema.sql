-- Gladtidings Health Database Schema
-- PostgreSQL/Supabase compatible

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for authentication and customer data)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  badge VARCHAR(50),
  description TEXT,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY, -- Format: GT-YYYY-XXXX
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  delivery_method VARCHAR(50) DEFAULT 'standard',
  address TEXT,
  city VARCHAR(100),
  county VARCHAR(100),
  notes TEXT,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending_whatsapp', -- pending_whatsapp, payment_sent, paid, completed, cancelled
  whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
  payment_sent_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50), -- Home, Office, etc.
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  county VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  tag VARCHAR(100),
  author VARCHAR(100),
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON wishlist(product_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products (optional)
INSERT INTO products (name, category, price, image_url, badge, description, stock) VALUES
('Elder & Echinacea Blend', 'Immunity', 2800, 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400', 'Best Seller', 'A powerful blend of elderberry and echinacea to support immune health naturally.', 50),
('Moringa Leaf Capsules', 'Superfoods', 3000, 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400', 'Organic', 'Premium moringa leaf capsules packed with essential nutrients and antioxidants.', 35),
('Ashwagandha Tincture', 'Stress Relief', 3400, 'https://images.unsplash.com/photo-1597940791260-fe3bcd0ce85e?w=400', 'Popular', 'Adaptogenic herb to help manage stress and promote relaxation.', 40),
('Black Seed Honey Blend', 'Wellness', 3800, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', NULL, 'Natural black seed infused honey for overall wellness support.', 25),
('Hibiscus Heart Tea', 'Heart Health', 1800, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400', NULL, 'Refreshing hibiscus tea to support cardiovascular health.', 60),
('Valerian Sleep Drops', 'Sleep', 2200, 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=400', NULL, 'Natural sleep aid with valerian root for restful nights.', 45),
('Turmeric Gold Tonic', 'Inflammation', 2600, 'https://images.unsplash.com/photo-1623741179217-4d0639c2740e?w=400', 'Anti-Inflammatory', 'Potent turmeric tonic to reduce inflammation and support joint health.', 30),
('Neem Skin Salve', 'Skincare', 2400, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 'Natural', 'Healing neem salve for skin conditions and minor wounds.', 55),
('Ginger & Honey Soothing Syrup', 'Digestive', 2200, 'https://images.unsplash.com/photo-1587049352846-4a222e784d3f5?w=400', NULL, 'Soothing ginger honey syrup for digestive comfort.', 40),
('Lemon Balm Calm Drops', 'Anxiety', 1900, 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400', NULL, 'Calming lemon balm drops to ease anxiety and promote relaxation.', 35)
ON CONFLICT DO NOTHING;

-- Insert sample blog post (optional)
INSERT INTO blog_posts (title, slug, tag, author, excerpt, content, image_url, is_published) VALUES
('10 Natural Remedies for Better Sleep', '10-natural-remedies-better-sleep', 'Wellness', 'Dr. Grace Wanjiru', 'Discover the best natural herbs and practices to improve your sleep quality without medication.', 'Full article content here...', 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800', true)
ON CONFLICT DO NOTHING;
