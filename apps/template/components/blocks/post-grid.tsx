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
    siteSlug?: string; // Optional to avoid breaking if not passed, but we should pass it
    limit?: number;
    paddingTop?: string;
    paddingBottom?: string;
}

export function PostGrid({ siteId, siteSlug, limit = 6, paddingTop, paddingBottom }: PostGridProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState("");
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
        if (!siteId) return;

        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from("pages")
                .select("slug, title, description, published_at")
                .eq("site_id", siteId)
                .eq("type", "post")
                .eq("status", "published")
                .order("published_at", { ascending: false })
                .limit(limit);

            if (data) setPosts(data);
        };

        fetchPosts();
    }, [siteId, limit]);

    if (!mounted) return null;

    const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

    // Fallback if siteSlug not provided (shouldn't happen in template)
    const getPostLink = (slug: string) => {
        if (siteSlug) return `/${siteSlug}/post/${slug}`;
        return `/?p=${slug}`;
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6" style={{ paddingTop, paddingBottom }}>
            <div className="mb-12 relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Pesquisar artigos..."
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans text-sm shadow-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {filtered.map(post => (
                    <Link key={post.slug} href={getPostLink(post.slug)} className="group block h-full">
                        <article className="h-full flex flex-col border border-border/50 hover:border-border rounded-xl p-6 transition-all hover:shadow-md bg-card/50 hover:bg-card">
                            <span className="text-xs font-mono text-muted-foreground mb-4 block uppercase tracking-wider">
                                {format(new Date(post.published_at), "d MMM yyyy", { locale: pt })}
                            </span>
                            <h2 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors leading-tight">
                                {post.title}
                            </h2>
                            {post.description && (
                                <p className="text-base text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                                    {post.description}
                                </p>
                            )}
                            <div className="mt-auto pt-4 flex items-center text-sm font-medium text-primary">
                                Ler artigo <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">Nenhuma publicação encontrada.</p>
                </div>
            )}
        </div>
    );
}
