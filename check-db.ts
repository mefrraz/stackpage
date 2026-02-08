
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yyjogjygivjosybhlira.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5am9nanlnaXZqb3N5YmhsaXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NDc4NTcsImV4cCI6MjA4NjEyMzg1N30.anIvRXAcmakVVVlYCSPUYf92XzHyRHRhCJY5ThGyLq4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
    console.log("Checking database...");

    // 1. List All Sites
    console.log(`Listing all visible sites...`);
    const { data: sites, error: sitesError } = await supabase
        .from('sites')
        .select('id, title, subdomain');

    if (sitesError) {
        console.error("Error fetching sites:", sitesError);
        return;
    }

    console.log(`Found ${sites?.length || 0} sites:`);
    sites?.forEach(s => console.log(` - ${s.title} (${s.subdomain})`));

    // Try to find target
    const target = sites?.find(s => s.subdomain === 'blog-teste-dev');
    if (!target) {
        console.error("Target site 'blog-teste-dev' NOT found in visible list.");
        return;
    }
    const site = target;
    console.log("Target site found:", site.id, site.title);

    // 2. Check Page
    const pageSlug = 'o-meu-primeiro-post';
    console.log(`Looking for page with slug: ${pageSlug}`);

    // Check WITHOUT status filter first to see if it exists at all
    const { data: pageRaw, error: pageRawError } = await supabase
        .from('pages')
        .select('*')
        .eq('site_id', site.id)
        .eq('slug', pageSlug)
        .single();

    if (pageRawError) {
        console.error("Error fetching page (raw):", pageRawError);
    } else {
        console.log("Page found (raw):", pageRaw.status, pageRaw.title);
    }

    // Check WITH status filter (simulating public access)
    const { data: pagePublic, error: pagePublicError } = await supabase
        .from('pages')
        .select('*')
        .eq('site_id', site.id)
        .eq('slug', pageSlug)
        .eq('status', 'published')
        .single();

    if (pagePublicError) {
        console.error("Error fetching page (public):", pagePublicError);
    } else if (!pagePublic) {
        console.error("Page not found with status=published");
    } else {
        console.log("Page found (public):", pagePublic.title);
    }
}

check();
