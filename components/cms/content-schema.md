# Amass Tech Hub - Content Management System Schema

## Database Tables

### Articles
- id (UUID)
- title (String)
- slug (String, unique)
- excerpt (String)
- content (Text)
- category (Enum: Startup News, Infrastructure, AI & Tech, Security, Fintech, Cloud)
- author_id (Foreign Key)
- image_url (String)
- published_at (DateTime)
- updated_at (DateTime)
- featured (Boolean)
- views (Integer)
- tags (Array)

### Reviews
- id (UUID)
- title (String)
- slug (String, unique)
- product (String)
- category (Enum: Software, Hardware, SaaS, Mobile Apps, Cloud Services)
- rating (Decimal 0-5)
- excerpt (String)
- content (Text)
- author_id (Foreign Key)
- image_url (String)
- published_at (DateTime)
- pros (Array)
- cons (Array)
- verdict (Text)

### Tutorials
- id (UUID)
- title (String)
- slug (String, unique)
- excerpt (String)
- content (Text)
- level (Enum: Beginner, Intermediate, Advanced)
- duration (Integer, minutes)
- author_id (Foreign Key)
- image_url (String)
- published_at (DateTime)
- tags (Array)
- resources (JSON Array)

### Tools
- id (UUID)
- name (String)
- slug (String, unique)
- category (Enum: Development, Design, Productivity, Analytics, Security)
- description (String)
- rating (Decimal 0-5)
- url (String)
- image_url (String)
- features (Array)
- pricing (Enum: Free, Freemium, Paid)
- added_at (DateTime)

### Authors
- id (UUID)
- name (String)
- email (String, unique)
- bio (Text)
- avatar_url (String)
- role (Enum: editor, contributor, admin)
- created_at (DateTime)

### Newsletter Subscribers
- id (UUID)
- email (String, unique)
- name (String, nullable)
- subscribed_at (DateTime)
- unsubscribed_at (DateTime, nullable)
- preferences (JSON)

### Newsletter Issues
- id (UUID)
- title (String)
- subject (String)
- content (Text)
- featured_articles (Array of Article IDs)
- published_at (DateTime)
- recipient_count (Integer)
- open_rate (Decimal)
- click_rate (Decimal)

### Testimonials
- id (UUID)
- author (String)
- role (String)
- company (String)
- content (Text)
- rating (Integer 1-5)
- image_url (String)

### Partners
- id (UUID)
- name (String)
- logo_url (String)
- description (String)
- website (String)
- category (String)

## Relationships
- Articles.author_id → Authors.id
- Reviews.author_id → Authors.id
- Tutorials.author_id → Authors.id
- Newsletter Issues.featured_articles → Articles.id (many-to-many)

## Indexes
- Articles: (slug), (category), (published_at), (featured)
- Reviews: (slug), (category), (rating)
- Tutorials: (slug), (level), (published_at)
- Tools: (slug), (category), (rating)
- Newsletter Subscribers: (email), (subscribed_at)
