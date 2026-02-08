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
            <div className="text-center py-32 px-6">
                <h1 className="text-3xl font-bold tracking-tight mb-4">Blog</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Ainda não há publicações. Volte em breve para novidades!
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
            <header className="mb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Blog</h1>
                <p className="text-muted-foreground text-lg">Publicações recentes</p>
            </header>

            <div className="grid gap-12">
                {posts.map((post, index) => (
                    <Link
                        key={post.slug}
                        href={`/${siteSlug}/post/${post.slug}`}
                        className="group block"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <article className="space-y-3 pb-12 border-b border-border transition-colors group-hover:border-foreground/30">
                            <div className="flex flex-col gap-2">
                                <time className="text-sm text-muted-foreground font-mono">
                                    {post.published_at
                                        ? format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: pt })
                                        : "Rascunho"}
                                </time>
                                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                                    {post.title}
                                </h2>
                            </div>
                            {post.description && (
                                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                                    {post.description}
                                </p>
                            )}
                            <span className="inline-flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                Ler mais →
                            </span>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}
