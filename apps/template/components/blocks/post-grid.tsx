"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase"; // Template uses shared lib
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import Link from "next/link";
import { Search } from "lucide-react";

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
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
        if (!siteId) return;

        const fetchPosts = async () => {
            console.log("[PostGrid] Fetching posts for siteId:", siteId);
            const { data, error } = await supabase
                .from("pages")
                .select("slug, title, description, published_at")
                .eq("site_id", siteId)
                .eq("type", "post")
                .eq("status", "published")
                .order("published_at", { ascending: false })
                .limit(limit);

            if (error) {
                console.error("[PostGrid] Error fetching posts:", error);
            } else {
                console.log("[PostGrid] Posts found:", data?.length);
            }

            if (data) setPosts(data);
        };

        fetchPosts();
    }, [siteId, limit]);

    if (!mounted) return null; // Avoid hydration mismatch

    const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="w-full" style={{ paddingTop, paddingBottom }}>
            <div className="mb-10 relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Pesquisar artigos..."
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans text-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filtered.map(post => (
                    <Link key={post.slug} href={`/?p=${post.slug}`} className="group block">
                        <article className="h-full flex flex-col border border-transparent hover:border-border rounded-lg p-5 transition-all hover:shadow-sm hover:bg-muted/50">
                            <span className="text-xs font-mono text-muted-foreground mb-3 block">
                                {format(new Date(post.published_at), "d MMM yyyy", { locale: pt })}
                            </span>
                            <h2 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors leading-tight">
                                {post.title}
                            </h2>
                            {post.description && (
                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                    {post.description}
                                </p>
                            )}
                            <div className="mt-auto pt-4 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                Ler mais →
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">Nenhuma publicação encontrada.</p>
                </div>
            )}
        </div>
    );
}
