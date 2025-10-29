-- Create podcasts table
CREATE TABLE IF NOT EXISTS public.podcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  transcript TEXT,
  show_notes TEXT,
  season_number INTEGER,
  episode_number INTEGER,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT FALSE,
  featured_image_url TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create podcast_guests table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.podcast_guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  podcast_id UUID REFERENCES public.podcasts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  author_name TEXT NOT NULL,
  author_title TEXT,
  author_company TEXT,
  author_avatar_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create about page content
CREATE TABLE IF NOT EXISTS public.about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT DEFAULT 'about' UNIQUE,
  content JSONB NOT NULL,
  featured_image_url TEXT,
  team_members JSONB[],
  stats JSONB[],
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies for podcasts
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" 
  ON public.podcasts 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "Enable all access for admin" 
  ON public.podcasts 
  USING (auth.role() = 'authenticated');

-- Create RLS policies for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" 
  ON public.reviews 
  FOR SELECT 
  USING (status = 'approved');

CREATE POLICY "Enable all access for admin" 
  ON public.reviews 
  USING (auth.role() = 'authenticated');

-- Create RLS policies for about
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" 
  ON public.about 
  FOR SELECT 
  USING (true);

CREATE POLICY "Enable all access for admin" 
  ON public.about 
  USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_podcasts_published ON public.podcasts(is_published, published_at);
CREATE INDEX idx_reviews_status ON public.reviews(status, created_at);
CREATE INDEX idx_about_slug ON public.about(slug);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_podcasts_updated_at
BEFORE UPDATE ON public.podcasts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_updated_at
BEFORE UPDATE ON public.about
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
