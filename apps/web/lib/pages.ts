import { supabase } from "@/lib/supabase/client";
import { Block } from "@stackpage/blocks";

export interface Page {
    id: string;
    site_id: string;
    slug: string;
    title: string;
    description?: string;
    type: 'page' | 'post';
    status: 'draft' | 'published';
    content_blocks: Block[];
    published_at?: string;
    created_at: string;
    updated_at: string;
}

// Fetch a single page by slug (e.g. for the Editor or Viewer)
export async function getPage(siteId: string, slug: string): Promise<Page | null> {
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('site_id', siteId)
        .eq('slug', slug)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error("Error fetching page:", error);
        throw error;
    }

    return data as Page;
}

// Fetch all pages for a site (e.g. for the Sidebar or Catalog)
export async function getSitePages(siteId: string): Promise<Page[]> {
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching pages:", error);
        return [];
    }

    return data as Page[];
}

// Create a new Page
export async function createPage(siteId: string, title: string, slug: string, type: 'page' | 'post' = 'page'): Promise<Page | null> {
    const { data, error } = await supabase
        .from('pages')
        .insert([{
            site_id: siteId,
            title,
            slug,
            type,
            status: 'draft',
            content_blocks: type === 'post'
                ? [
                    // Default Post Layout
                    {
                        id: crypto.randomUUID(),
                        type: 'hero',
                        props: {
                            title: title,
                            subtitle: "Escreva uma descrição aqui...",
                            paddingTop: "60px",
                            paddingBottom: "60px"
                        }
                    },
                    {
                        id: crypto.randomUUID(),
                        type: 'text',
                        props: {
                            content: "Comece a escrever o seu post aqui...",
                            align: 'left',
                            paddingTop: "20px",
                            paddingBottom: "60px"
                        }
                    }
                ]
                : [
                    // Default Page (Home) Layout
                    {
                        id: crypto.randomUUID(),
                        type: 'spacer',
                        props: { height: 60 }
                    },
                    {
                        id: crypto.randomUUID(),
                        type: 'hero',
                        props: {
                            title: title,
                            subtitle: "Bem-vindo ao meu site",
                            ctaText: "Saber mais",
                            paddingTop: "40px",
                            paddingBottom: "80px"
                        }
                    },
                    {
                        id: crypto.randomUUID(),
                        type: 'post-grid',
                        props: {
                            limit: 6,
                            paddingTop: "40px",
                            paddingBottom: "40px"
                        }
                    }
                ]
        }])
        .select()
        .single();

    if (error) {
        console.error("Error creating page:", error);
        throw error;
    }

    return data as Page;
}

// Update Page Content/Meta
export async function updatePage(pageId: string, updates: Partial<Page>): Promise<Page | null> {
    const { data, error } = await supabase
        .from('pages')
        .update(updates)
        .eq('id', pageId)
        .select()
        .single();

    if (error) {
        console.error("Error updating page:", error);
        throw error;
    }

    return data as Page;
}

// Delete Page
export async function deletePage(pageId: string): Promise<boolean> {
    const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

    if (error) {
        console.error("Error deleting page:", error);
        throw error;
    }

    return true;
}
