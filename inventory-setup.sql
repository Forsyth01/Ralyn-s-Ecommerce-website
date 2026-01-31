-- Inventory Tracking System Setup
-- Run this in your Supabase SQL Editor

-- Add inventory columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;

-- Update existing products with initial stock quantities
-- Set reasonable default stock levels based on category
UPDATE products SET
  stock_quantity = CASE
    WHEN category = 'lipgloss' THEN 50
    WHEN category = 'jewelry' THEN 20
    WHEN category = 'gadgets' THEN 30
    WHEN category = 'fashion' THEN 40
    ELSE 25
  END,
  low_stock_threshold = 5
WHERE stock_quantity = 0 OR stock_quantity IS NULL;

-- Create index for faster stock queries
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);

-- Optional: Create a function to check and update stock
CREATE OR REPLACE FUNCTION update_product_stock(product_id UUID, quantity_sold INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  -- Get current stock
  SELECT stock_quantity INTO current_stock
  FROM products
  WHERE id = product_id;

  -- Check if enough stock
  IF current_stock < quantity_sold THEN
    RETURN FALSE;
  END IF;

  -- Decrement stock
  UPDATE products
  SET stock_quantity = stock_quantity - quantity_sold
  WHERE id = product_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
