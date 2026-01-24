-- Create Design Archetypes Table
CREATE TABLE public.design_archetypes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    style_key TEXT UNIQUE NOT NULL,
    visual_dna JSONB NOT NULL DEFAULT '{}'::jsonb,
    negative_patterns TEXT,
    prompt_template TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.design_archetypes ENABLE ROW LEVEL SECURITY;

-- Select Policy (Public Read)
CREATE POLICY "Allow public read access to design_archetypes" 
ON public.design_archetypes FOR SELECT USING (true);

-- Insert Initial Archetypes (Seeding)
INSERT INTO public.design_archetypes (category, style_key, visual_dna, negative_patterns, prompt_template)
VALUES 
(
  'HEALTH', 'NUTRIO', 
  '{"grid": "4-column", "radius": "4px", "colors": "Sage/Mint", "typography": "Clean Sans"}',
  'organic blobs, messy shadows, complex graphics',
  'Professional health product photography on pure white background, soft studio lighting, clean minimal aesthetic'
),
(
  'FURNITURE', '3HOUR', 
  '{"grid": "4-5 column tight", "radius": "0px", "colors": "Pure White/Charcoal", "typography": "Sophisticated Serif/Sans"}',
  'decorative blobs, dot patterns, stock vector art',
  'High-end minimal furniture photography, perfect white isolation, sharp focus on material texture'
),
(
  'FASHION', 'MUSINSA', 
  '{"grid": "4-column editorial", "radius": "2px", "colors": "High contrast B/W", "typography": "Pretendard"}',
  'childish graphics, colorful blobs, messy borders',
  'Editorial K-fashion layout, clean white cards, professional model and detail shots'
),
(
  'BEAUTY', 'BEAUTY_LAB', 
  '{"grid": "3-4 column", "radius": "4px", "colors": "Luxury Earth tones", "typography": "Elegant Serif"}',
  'harsh lighting, synthetic looks, generic stock art',
  'Luxury skincare photography with natural elements, stone and wood textures, premium editorial aesthetic'
);
