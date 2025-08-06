-- Create table for storing generated hairstyle images
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unique_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 hash of image + style + color
  original_image_hash VARCHAR(64) NOT NULL, -- Hash of the original uploaded image
  hairstyle VARCHAR(100) NOT NULL,
  hair_color VARCHAR(7) NOT NULL, -- Hex color code
  generated_image_url TEXT NOT NULL,
  url_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '50 minutes'), -- OpenAI URLs expire in ~1 hour
  is_permanent BOOLEAN DEFAULT FALSE, -- Whether URL is permanent (Supabase) or temporary (OpenAI)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_generated_images_unique_hash ON generated_images(unique_hash);
CREATE INDEX IF NOT EXISTS idx_generated_images_original_hash ON generated_images(original_image_hash);
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at ON generated_images(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_generated_images_updated_at 
    BEFORE UPDATE ON generated_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on generated_images" ON generated_images
    FOR ALL USING (true);
