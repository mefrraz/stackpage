"use client";

import Link from "next/link";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Post {
    slug: string;
    title: string;
    description?: string;
    published_at: string;
}

export function BlogCatalog({ posts, siteSlug }: { posts: Post[], siteSlug: string }) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">Ainda não há publicações.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-12 tracking-tight">Publicações</h1>
            <div className="grid gap-8">
                {posts.map((post) => (
                    <Link key={post.slug} href={`/${siteSlug}/post/${post.slug}`} className="group block">
                        <article className="border-b border-border pb-8 transition-colors hover:border-foreground/50">
                            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-2">
                                <h2 className="text-2xl font-semibold group-hover:underline decoration-1 underline-offset-4">
                                    {post.title}
                                </h2>
                                <time className="text-sm text-muted-foreground font-mono shrink-0">
                                    {post.published_at
                                        ? format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: pt })
                                        : "Rascunho"}
                                </time>
                            </div>
                            {post.description && (
                                <p className="text-muted-foreground leading-relaxed mt-2 max-w-2xl">
                                    {post.description}
                                </p>
                            )}
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}
