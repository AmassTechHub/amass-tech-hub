-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create content table
create table if not exists content (
  id uuid default uuid_generate_v4() primary key,
  type varchar(50) not null,
  title varchar(255) not null,
  slug varchar(255) not null,
  description text,
  content text not null,
  featured_image text,
  status varchar(20) not null default 'draft',
  is_featured boolean not null default false,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  published_at timestamp with time zone,
  author_id uuid references auth.users(id) on delete set null,
  
  constraint content_status_check check (
    status in ('draft', 'published', 'archived')
  ),
  
  constraint content_type_check check (
    type in ('news', 'tutorial', 'tool', 'service', 'podcast', 'event')
  )
);

-- Create indexes for better query performance
create index if not exists idx_content_type on content(type);
create index if not exists idx_content_status on content(status);
create index if not exists idx_content_featured on content(is_featured) where is_featured = true;
create index if not exists idx_content_published on content(published_at) where status = 'published';
create unique index if not exists idx_content_slug on content(slug, type);

-- Set up RLS (Row Level Security)
alter table content enable row level security;

-- Policies for public access (read-only for published content)
create policy "Public content is viewable by everyone"
  on content for select
  using (status = 'published');

-- Policies for authenticated users (authors can manage their own content)
create policy "Users can create content"
  on content for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Users can update their own content"
  on content for update
  to authenticated
  using (auth.uid() = author_id);

create policy "Users can delete their own content"
  on content for delete
  to authenticated
  using (auth.uid() = author_id);

-- Policies for admin users (can manage all content)
create policy "Admins can manage all content"
  on content
  using (exists (
    select 1 from auth.users
    where auth.uid() = id and (auth.jwt() ->> 'user_metadata' ->> 'is_admin')::boolean = true
  ));

-- Set up updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger update_content_updated_at
before update on content
for each row
execute function update_updated_at_column();

-- Set up published_at trigger
create or replace function set_published_at()
returns trigger as $$
begin
  if new.status = 'published' and old.status != 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

create or replace trigger set_content_published_at
before update on content
for each row
execute function set_published_at();

-- Add comments for documentation
comment on table content is 'Stores all content types for the website including news, tutorials, tools, services, podcasts, and events.';
comment on column content.type is 'The type of content (news, tutorial, tool, service, podcast, event)';
comment on column content.status is 'Publication status: draft, published, or archived';
comment on column content.metadata is 'Additional type-specific metadata stored as JSON';
comment on column content.published_at is 'Timestamp when the content was published';
comment on column content.author_id is 'Reference to the user who created the content';

-- Create a view for public content
create or replace view public_content as
select 
  id,
  type,
  title,
  slug,
  description,
  content,
  featured_image,
  status,
  is_featured,
  metadata,
  published_at,
  author_id,
  created_at,
  updated_at
from content
where status = 'published';

-- Grant permissions
grant select on public_content to anon, authenticated;

grant all on content to authenticated;
grant usage, select on all sequences in schema public to authenticated;
