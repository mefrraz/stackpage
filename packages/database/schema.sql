-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  github_access_token text,
  vercel_access_token text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- SITES
create table sites (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  
  -- Domains
  subdomain text unique, -- meublog.stackpage.app
  custom_domain text unique,
  
  -- GitHub Integration
  github_repo text, -- owner/repo-name
  
  -- Settings
  title text not null default 'Meu Blog',
  description text,
  logo text,
  settings jsonb default '{}'::jsonb,
  
  -- Status
  deployment_status text default 'idle', -- building, ready, error
  deployment_url text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- POSTS
create table posts (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references sites(id) on delete cascade not null,
  
  slug text not null,
  title text not null,
  excerpt text,
  published boolean default false,
  
  -- Content (The Block System)
  content_blocks jsonb not null default '[]'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  
  unique(site_id, slug)
);

-- RLS (Row Level Security) - Basic Setup
alter table profiles enable row level security;
alter table sites enable row level security;
alter table posts enable row level security;

-- Policies
-- 1. Profiles: Users can only read/edit their own profile
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 2. Sites: Users can only CRUD their own sites
create policy "Users can view own sites" on sites for select using (auth.uid() = owner_id);
create policy "Users can insert own sites" on sites for insert with check (auth.uid() = owner_id);
create policy "Users can update own sites" on sites for update using (auth.uid() = owner_id);
create policy "Users can delete own sites" on sites for delete using (auth.uid() = owner_id);

-- 3. Posts: Users can only CRUD posts of their sites
create policy "Users can view posts of own sites" on posts for select using (
  site_id in (select id from sites where owner_id = auth.uid())
);
create policy "Users can insert posts to own sites" on posts for insert with check (
  site_id in (select id from sites where owner_id = auth.uid())
);
create policy "Users can update posts of own sites" on posts for update using (
  site_id in (select id from sites where owner_id = auth.uid())
);
create policy "Users can delete posts of own sites" on posts for delete using (
  site_id in (select id from sites where owner_id = auth.uid())
);

-- Public Access for Blog Reading (via API Key/Anon Key) for PUBLISHED posts
-- This complicates things. For now, let's keep it simple: API will use Service Role for build, or we add a "public" policy for published posts.
create policy "Public can view published posts" on posts for select using (published = true);
create policy "Public can view site settings" on sites for select using (true); -- Needed to resolve site by domain
