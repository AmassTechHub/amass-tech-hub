-- Create articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  author_id UUID,
  image_url VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create authors table
CREATE TABLE authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'author',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3C0A6B',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create newsletter subscribers table
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  preferences JSONB
);

-- Create contact submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default author
INSERT INTO authors (name, email, bio, role) VALUES 
('Amass Tech Hub', 'info@amasstechhub.com', 'Africa''s premier tech news and digital solutions hub', 'admin');

-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES 
('Startup News', 'startup-news', 'Latest startup news and funding', '#3C0A6B'),
('Infrastructure', 'infrastructure', 'Tech infrastructure and connectivity', '#D6A51B'),
('AI & Tech', 'ai-tech', 'Artificial intelligence and emerging tech', '#8B5CF6'),
('Security', 'security', 'Cybersecurity and data protection', '#EF4444'),
('Fintech', 'fintech', 'Financial technology and digital payments', '#10B981'),
('Cloud', 'cloud', 'Cloud computing and services', '#06B6D4');

-- Insert sample articles
INSERT INTO articles (title, slug, excerpt, content, category, author_id, published, featured) VALUES 
('African Tech Startups Raise Record $2.5B in 2024', 'african-tech-startups-raise-record-2-5b-2024', 'Investment in African tech ecosystem reaches all-time high, signaling strong growth potential', 'The African tech startup ecosystem has reached a significant milestone with total investments hitting $2.5 billion in 2024. This represents a 40% increase from the previous year, demonstrating growing confidence from global and local investors in African innovation.', 'Startup News', (SELECT id FROM authors LIMIT 1), true, true),
('5G Rollout Accelerates Across Major African Cities', '5g-rollout-accelerates-african-cities', 'Telecommunications companies announce aggressive expansion plans for next-generation connectivity', 'Major telecommunications providers across Africa are accelerating their 5G network deployments. By the end of 2025, over 50 major cities are expected to have 5G coverage, transforming mobile connectivity and enabling new applications.', 'Infrastructure', (SELECT id FROM authors LIMIT 1), true, false),
('AI Integration in African Healthcare: Opportunities and Challenges', 'ai-integration-african-healthcare', 'Exploring how artificial intelligence is transforming medical services across the continent', 'Artificial intelligence is revolutionizing healthcare delivery in Africa. From diagnostic imaging to drug discovery, AI applications are improving patient outcomes while addressing the continent''s healthcare challenges.', 'AI & Tech', (SELECT id FROM authors LIMIT 1), true, false);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to articles" ON articles FOR SELECT USING (published = true);
CREATE POLICY "Allow public read access to authors" ON authors FOR SELECT USING (true);
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);

-- Create policies for admin access (you'll need to set up authentication later)
CREATE POLICY "Allow admin full access to articles" ON articles FOR ALL USING (true);
CREATE POLICY "Allow admin full access to authors" ON authors FOR ALL USING (true);
CREATE POLICY "Allow admin full access to categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow admin full access to subscribers" ON subscribers FOR ALL USING (true);
CREATE POLICY "Allow admin full access to contact_submissions" ON contact_submissions FOR ALL USING (true);
