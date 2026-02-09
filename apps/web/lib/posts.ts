import { supabase } from "@/lib/supabase/client";
import { Block } from "@stackpage/blocks";

export interface Post {
    id: string;
    site_id: string;
    slug: string;
    title: string;
    excerpt?: string;
    status: 'draft' | 'published';
    content_blocks: Block[];
    published_at?: string;
    created_at: string;
    updated_at: string;
}

// Fetch all posts for a site
export async function getSitePosts(siteId: string): Promise<Post[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('site_id', siteId)
        .eq('status', 'published') // Only published posts
        .order('published_at', { ascending: false });

    if (error) {
        console.error("Error fetching site posts:", error);
        return [];
    }
    return data as Post[];
}

// Fetch single post by slug
export async function getPostBySlug(siteId: string, slug: string): Promise<Post | null> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('site_id', siteId)
        .eq('slug', slug) // Filter by slug
        .single(); // Expect only one

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error("Error fetching post by slug:", error);
        return null;
    }

    return data as Post;
}
