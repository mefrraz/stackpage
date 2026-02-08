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

-- 3. Migrate existing data from 'posts' (if it exists) to 'pages'
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'posts') THEN
        INSERT INTO pages (site_id, slug, title, content_blocks, type, status, published_at)
        SELECT 
            site_id, 
            slug, 
            COALESCE(title, 'Home'), -- Ensure title exists, fallback to Home
            content_blocks, 
            'page', 
            'published', 
            NOW() -- Use NOW() as created_at was missing in old schema
        FROM posts
        ON CONFLICT (site_id, slug) DO NOTHING;
    END IF;
END $$;

-- 4. Enable RLS on 'pages'
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- 5. Policies for 'pages'
DROP POLICY IF EXISTS "Public pages are viewable by everyone" ON pages;
CREATE POLICY "Public pages are viewable by everyone" 
ON pages FOR SELECT 
USING (status = 'published');

DROP POLICY IF EXISTS "Users can manage pages of their own sites" ON pages;
CREATE POLICY "Users can manage pages of their own sites"
ON pages FOR ALL
USING (
    site_id IN (
        SELECT id FROM sites WHERE owner_id = auth.uid()
    )
);

-- 6. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pages_site_slug ON pages(site_id, slug);

-- OPTIONAL: Drop old 'posts' table only after verifying data
-- DROP TABLE posts;
