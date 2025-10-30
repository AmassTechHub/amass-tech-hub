-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('tool', 'tutorial', 'service', 'knowledge_base', 'faq')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id column to tools table
ALTER TABLE public.tools 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  DROP COLUMN IF EXISTS category;

-- Add category_id to other tables
ALTER TABLE public.tutorials 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE public.services 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE public.knowledge_base 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE public.faqs 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_type ON public.categories(type);
CREATE INDEX IF NOT EXISTS idx_tools_category_id ON public.tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tutorials_category_id ON public.tutorials(category_id);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category_id ON public.knowledge_base(category_id);
CREATE INDEX IF NOT EXISTS idx_faqs_category_id ON public.faqs(category_id);

-- Create trigger for categories
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories
CREATE POLICY "Enable read access for all users" 
ON public.categories 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Enable all access for admins"
ON public.categories
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated' AND 
       EXISTS (
         SELECT 1 FROM auth.users 
         WHERE id = auth.uid() AND 
         (raw_user_meta_data->>'role')::text = 'admin'
       ));

-- Create default categories
INSERT INTO public.categories (name, slug, description, type)
VALUES 
  ('Web Development', 'web-development', 'Tools and resources for web development', 'tool'),
  ('Mobile Development', 'mobile-development', 'Tools for mobile app development', 'tool'),
  ('Design', 'design', 'Design tools and resources', 'tool'),
  ('Productivity', 'productivity', 'Productivity tools and apps', 'tool'),
  ('Getting Started', 'getting-started', 'Beginner tutorials and guides', 'tutorial'),
  ('Advanced Topics', 'advanced-topics', 'Advanced tutorials and guides', 'tutorial'),
  ('Web Services', 'web-services', 'Web development services', 'service'),
  ('Mobile Services', 'mobile-services', 'Mobile app development services', 'service'),
  ('General', 'general', 'General knowledge base articles', 'knowledge_base'),
  ('Technical', 'technical', 'Technical documentation', 'knowledge_base'),
  ('Account', 'account', 'Account related questions', 'faq'),
  ('Billing', 'billing', 'Billing and payment questions', 'faq')
ON CONFLICT (slug) DO NOTHING;
