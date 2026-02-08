"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client"; // Web uses client-side instance
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Post {
    slug: string;
    title: string;
    description?: string;
    published_at: string;
}

interface PostGridProps {
    siteId: string;
    limit?: number;
    paddingTop?: string;
    paddingBottom?: string;
}

export function PostGrid({ siteId, limit = 6, paddingTop, paddingBottom }: PostGridProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState("");
    // const supabase = createClient(); // Removed, use imported instance

    useEffect(() => {
        if (!siteId) return;

        const fetchPosts = async () => {
            const { data } = await supabase
                .from("pages")
                .select("slug, title, description, published_at")
                .eq("site_id", siteId)
                .eq("type", "post")
                // In Editor, maybe show drafts too? For now, stick to published or all?
                // Use standard: Show published to simulate view, or all? 
                // Let's show all for Editor so user sees their work.
                // .eq("status", "published") 
                .order("created_at", { ascending: false })
                .limit(limit);

            if (data) setPosts(data);
        };

        fetchPosts();
    }, [siteId, limit]);

    const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="w-full" style={{ paddingTop, paddingBottom }}>
            <div className="mb-8 flex justify-between items-center bg-gray-50 p-4 rounded-md border border-dashed border-gray-300">
                <span className="text-sm font-mono text-gray-500">Post Grid (Preview)</span>
                <input
                    type="text"
                    placeholder="Pesquisar posts..."
                    className="border p-2 rounded text-sm w-1/2"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filtered.map(post => (
                    <div key={post.slug} className="border border-border p-4 rounded transition bg-card shadow-sm opacity-70 hover:opacity-100 hover:border-primary/50">
                        <h3 className="font-bold text-lg mb-2 truncate text-foreground">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.description || "Sem descrição"}</p>
                        <div className="text-xs text-muted-foreground">
                            {post.published_at ? format(new Date(post.published_at), "d MMM yyyy", { locale: pt }) : "Rascunho"}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-10 text-gray-400 italic">
                    Nenhum post encontrado.
                </div>
            )}
        </div>
    );
}
