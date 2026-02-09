import { getSiteBySlug } from "@/lib/sites";
import { getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@stackpage/blocks";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BlogPostProps {
    params: Promise<{ siteSlug: string; postSlug: string }>;
}

export async function generateMetadata({ params }: BlogPostProps) {
    const { siteSlug, postSlug } = await params;
    const site = await getSiteBySlug(siteSlug);
    if (!site) return { title: "Post não encontrado" };

    const post = await getPostBySlug(site.id, postSlug);
    if (!post) return { title: "Post não encontrado | " + site.title };

    return {
        title: `${post.title} | ${site.title}`,
        description: post.excerpt || post.title,
    };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
    const { siteSlug, postSlug } = await params;
    const site = await getSiteBySlug(siteSlug);
    if (!site) return notFound();

    const post = await getPostBySlug(site.id, postSlug);
    if (!post) return notFound();

    return (
        <main className="min-h-screen py-12 px-4">
            <article className="container mx-auto max-w-3xl">
                <Link href={`/${site.subdomain}/posts`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Blog
                </Link>

                <header className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{post.title}</h1>
                    {post.published_at && (
                        <time className="text-muted-foreground">
                            {format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: pt })}
                        </time>
                    )}
                </header>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <BlockRenderer blocks={post.content_blocks || []} />
                </div>
            </article>
        </main>
    );
}
