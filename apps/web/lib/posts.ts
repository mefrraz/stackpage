import { supabase } from "@/lib/supabase/client";
import { Block } from "@stackpage/blocks";

export async function getPost(siteId: string): Promise<Block[]> {
    // Mock Fallback
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem(`mock_post_${siteId}`);
        return saved ? JSON.parse(saved) : [];
    }

    // Supabase Real
    const { data, error } = await supabase
        .from('posts')
        .select('content_blocks')
        .eq('site_id', siteId)
        .single();

    if (error) {
        console.warn("Post not found, returning empty", error);
        return [];
    }

    return data.content_blocks as Block[];
}

export async function savePost(siteId: string, blocks: Block[]) {
    // Mock Fallback
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        localStorage.setItem(`mock_post_${siteId}`, JSON.stringify(blocks));
        return true;
    }

    // Supabase Impl (Upsert)
    // Primeiro precisamos garantir que o post existe. 
    // Simplificação: Assumimos que cada site tem um 'home' post criado.
    // Para MVP, vamos tentar update, se falhar, insert.

    const { error } = await supabase
        .from('posts')
        .upsert({
            site_id: siteId,
            slug: 'home',
            title: 'Home',
            content_blocks: blocks
        }, { onConflict: 'site_id, slug' });

    if (error) throw error;
    return true;
}
