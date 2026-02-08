-- 1. Update 'sites' table to include configuration
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}'::jsonb;

-- 2. Create 'pages' table (replaces 'posts' concept)
CREATE TABLE IF NOT EXISTS pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'page' CHECK (type IN ('page', 'post')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    content_blocks JSONB DEFAULT '[]'::jsonb,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique slugs per site
    UNIQUE(site_id, slug)
);

-- 3. Enable RLS on 'pages'
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- 4. Policies for 'pages'
-- Allow public read access to published pages
CREATE POLICY "Public pages are viewable by everyone" 
ON pages FOR SELECT 
USING (status = 'published');

-- Allow site owners to manage their own pages
-- (Assuming we verify ownership via the sites table join or simply relying on site_id check if we have an RLS policy on sites that limits access)
-- A simpler approach for MVP matching existing 'sites' logic:

CREATE POLICY "Users can manage pages of their own sites"
ON pages FOR ALL
USING (
    site_id IN (
        SELECT id FROM sites WHERE owner_id = auth.uid()
    )
);

-- 5. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pages_site_slug ON pages(site_id, slug);
