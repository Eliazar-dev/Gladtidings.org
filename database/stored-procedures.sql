-- ═══════════════════════════════════════════════════════════════
-- GLADTIDINGS HEALTH — STORED PROCEDURES
-- Run this in Supabase SQL Editor after running complete-schema.sql
-- ═══════════════════════════════════════════════════════════════

-- Decrement product stock
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id INTEGER, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET stock = GREATEST(0, stock - p_quantity) WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment coupon uses
CREATE OR REPLACE FUNCTION increment_coupon_uses(p_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE coupons SET uses = uses + 1 WHERE code = p_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment product views
CREATE OR REPLACE FUNCTION increment_product_views(p_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET views = views + 1 WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
