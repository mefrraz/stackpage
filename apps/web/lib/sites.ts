import { supabase } from "@/lib/supabase/client";

export interface Site {
    id: string;
    title: string;
    subdomain: string;
    owner_id?: string;
    config?: Record<string, any>;
}

import { getTemplateContent, SiteModel } from "./templates";

export interface SiteConfig {
    theme?: string;
    model?: SiteModel;
    [key: string]: any;
}

export async function createSite(title: string, subdomain: string, config: SiteConfig = {}): Promise<Site | null> {
    const user = (await supabase.auth.getUser()).data.user;

    // Se não houver user, lança erro para ser capturado no frontend
    if (!user) {
        throw new Error("Utilizador não autenticado. Por favor, faça login.");
    }

    const { data: siteData, error: siteError } = await supabase
        .from('sites')
        .insert([{
            title,
            subdomain,
            owner_id: user.id,
            config: config // Store theme and model preference
        }])
        .select()
        .single();

    if (siteError) {
        console.error("Error creating site:", siteError);
        throw siteError;
    }

    // Determine initial content based on Model
    const initialBlocks = getTemplateContent(config.model || 'blog', title);

    // Auto-create Home Page (status: published, type: page)
    const { error: pageError } = await supabase
        .from('pages')
        .insert([{
            site_id: siteData.id,
            title: "Home",
            slug: "home",
            type: "page",
            status: "published",
            content_blocks: initialBlocks
        }]);

    if (pageError) {
        console.error("Error creating default home page:", pageError);
        // We don't throw here to avoid failing site creation, but log it.
    }

    return siteData;
}


export async function getSites(): Promise<Site[]> {
    const { data, error } = await supabase.from('sites').select('*');
    if (error) throw error;
    return data || [];
}

export async function getSite(id: string): Promise<Site | null> {
    const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Error fetching site:", error);
        return null;
    }
    return data;
}

export async function deleteSite(siteId: string): Promise<boolean> {
    // First delete all pages associated with the site
    const { error: pagesError } = await supabase
        .from('pages')
        .delete()
        .eq('site_id', siteId);

    if (pagesError) {
        console.error("Error deleting site pages:", pagesError);
        throw pagesError;
    }

    // Then delete the site itself
    const { error: siteError } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId);

    if (siteError) {
        console.error("Error deleting site:", siteError);
        throw siteError;
    }

    return true;
}
