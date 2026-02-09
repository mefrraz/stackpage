import { getSiteBySlug } from "@/lib/sites";
import { getSitePosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface BlogIndexProps {
    params: Promise<{ siteSlug: string }>;
}

export async function generateMetadata({ params }: BlogIndexProps) {
    const { siteSlug } = await params;
    const site = await getSiteBySlug(siteSlug);
    if (!site) return { title: "Site não encontrado" };
    return {
        title: `Blog | ${site.title}`,
        description: `Artigos e novidades de ${site.title}`,
    };
}

export default async function BlogIndexPage({ params }: BlogIndexProps) {
    const { siteSlug } = await params;
    const site = await getSiteBySlug(siteSlug);

    if (!site) return notFound();

    const posts = await getSitePosts(site.id);

    return (
        <main className="min-h-screen container mx-auto px-4 py-12 max-w-4xl">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Blog</h1>
                <p className="text-muted-foreground text-lg">Últimas novidades e artigos.</p>
            </header>

            <div className="grid gap-8">
                {posts.map((post) => (
                    <article key={post.id} className="border border-border/40 rounded-xl p-6 hover:border-primary/50 transition-colors bg-card">
                        <Link href={`/${site.subdomain}/posts/${post.slug}`} className="block group">
                            <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                {post.published_at && format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: pt })}
                            </p>
                            <p className="text-foreground/80 line-clamp-3 mb-4">
                                {post.excerpt || "Ler mais..."}
                            </p>
                            <span className="text-primary font-medium text-sm">Ler artigo &rarr;</span>
                        </Link>
                    </article>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border/30 rounded-xl">
                        <p>Ainda não há publicações.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
