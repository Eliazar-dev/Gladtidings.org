-- Remedies table
CREATE TABLE IF NOT EXISTS remedies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100),
  description TEXT NOT NULL,
  ingredients TEXT,
  benefits TEXT,
  usage_instructions TEXT,
  precautions TEXT,
  images TEXT[], -- Array of image URLs
  price DECIMAL(10, 2),
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for remedies
CREATE INDEX IF NOT EXISTS idx_remedies_slug ON remedies(slug);
CREATE INDEX IF NOT EXISTS idx_remedies_category ON remedies(category);
CREATE INDEX IF NOT EXISTS idx_remedies_active ON remedies(active);
CREATE INDEX IF NOT EXISTS idx_remedies_featured ON remedies(featured);

-- Create trigger for updated_at on remedies
CREATE TRIGGER update_remedies_updated_at BEFORE UPDATE ON remedies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample remedies
INSERT INTO remedies (name, slug, category, description, ingredients, benefits, usage_instructions, price, stock, featured) VALUES
('Moringa Leaf Powder', 'moringa-leaf-powder', 'Superfoods', 'Premium organic moringa leaf powder packed with essential nutrients, vitamins, and antioxidants.', 'Dried moringa leaves', 'Boosts energy, supports immune system, rich in antioxidants', 'Mix 1 teaspoon with water or smoothie daily', 2500, 100, true),
('Ashwagandha Root Extract', 'ashwagandha-root-extract', 'Stress Relief', 'Adaptogenic herb extract to help manage stress, anxiety, and promote relaxation.', 'Ashwagandha root extract', 'Reduces stress, improves sleep, enhances cognitive function', 'Take 2 drops in water twice daily', 3200, 75, true),
('Black Seed Oil', 'black-seed-oil', 'Wellness', 'Pure cold-pressed black seed oil for overall wellness and immune support.', 'Black cumin seeds oil', 'Supports immune health, promotes healthy digestion, anti-inflammatory', 'Take 1 teaspoon daily with meals', 2800, 60, false),
('Hibiscus Tea Blend', 'hibiscus-tea-blend', 'Heart Health', 'Refreshing hibiscus tea blend to support cardiovascular health and blood pressure.', 'Dried hibiscus flowers, cinnamon, ginger', 'Supports heart health, regulates blood pressure, rich in vitamin C', 'Steep 1 teaspoon in hot water for 5-10 minutes', 1800, 120, false)
ON CONFLICT DO NOTHING;
