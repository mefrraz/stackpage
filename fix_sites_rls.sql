-- Fix: Allow public read access to sites table
-- This is required for the template viewer to find the site by subdomain
-- Run this in Supabase SQL Editor

-- 1. Ensure RLS is enabled (just in case)
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing select policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Public sites are viewable by everyone" ON sites;

-- 3. Create the policy
CREATE POLICY "Public sites are viewable by everyone" 
ON sites FOR SELECT 
USING (true);
