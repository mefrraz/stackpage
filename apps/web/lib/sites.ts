import { supabase } from "@/lib/supabase/client";

export interface Site {
    id: string;
    title: string;
    subdomain: string;
    owner_id?: string;
    config?: Record<string, any>;
}

export async function createSite(title: string, subdomain: string): Promise<Site | null> {
    const user = (await supabase.auth.getUser()).data.user;

    // Se não houver user, lança erro para ser capturado no frontend
    if (!user) {
        throw new Error("Utilizador não autenticado. Por favor, faça login.");
    }

    // Implementação Real
    const { data, error } = await supabase
        .from('sites')
        .insert([{
            title,
            subdomain,
            owner_id: user.id,
            config: {} // Default empty config
        }])
        .select()
        .single();

    if (error) {
        console.error("Error creating site:", error);
        throw error;
    }

    return data;
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
