
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yyjogjygivjosybhlira.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5am9nanlnaXZqb3N5YmhsaXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NDc4NTcsImV4cCI6MjA4NjEyMzg1N30.anIvRXAcmakVVVlYCSPUYf92XzHyRHRhCJY5ThGyLq4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
    console.log("Checking database...");

    const { data: sites } = await supabase.from('sites').select('id, title, subdomain');
    const site = sites?.find(s => s.subdomain === 'blog-teste-dev');

    if (!site) {
        console.error("Site blog-teste-dev not found");
        return;
    }

    console.log(`Site found: ${site.title} (${site.id})`);

    // Check All Pages
    console.log(`\nListing all pages for site...`);
    const { data: allPages, error: allPagesError } = await supabase
        .from('pages')
        .select('slug, title, type, status, published_at')
        .eq('site_id', site.id);

    if (allPagesError) {
        console.error("Error fetching pages:", allPagesError);
    } else {
        console.log(`Found ${allPages?.length} pages:`);
        allPages?.forEach(p => console.log(` - ${p.title} (${p.slug}): [${p.type}/${p.status}]`));
    }
}

check();
