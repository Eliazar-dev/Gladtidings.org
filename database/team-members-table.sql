-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Public can read active team members
CREATE POLICY "public_read_team" ON team_members 
  FOR SELECT TO anon, authenticated 
  USING (active = true);

-- Admins can manage team members
CREATE POLICY "admin_manage_team" ON team_members 
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert seed data
INSERT INTO team_members (name, role, bio, image_url, sort_order) VALUES
  ('Pastor James Kamau', 'Founder & Director', '20 years in medical missions across East Africa. Ordained pastor and trained herbalist.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 1),
  ('Dr. Grace Wambui', 'Chief Herbalist', 'PhD in Ethnobotany from University of Nairobi. Specialist in African traditional medicine.', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400', 2),
  ('Nurse Mary Akinyi', 'Field Clinic Lead', 'Registered nurse leading our rural outreach clinics in Turkana, Samburu, and West Pokot.', 'https://images.unsplash.com/photo-1614436163996-25cee5f54290?w=400', 3)
ON CONFLICT DO NOTHING;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_team_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_team_members_updated_at();
