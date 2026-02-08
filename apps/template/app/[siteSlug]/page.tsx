import { createClient } from "@/lib/supabase";
import { BlockRenderer, Block } from "@stackpage/blocks";
import { SpacerBlock } from "@stackpage/blocks/src/spacer-block";
import { TextBlock } from "@stackpage/blocks/src/text-block";
import { PostGrid } from "@/components/blocks/post-grid";
import { notFound } from "next/navigation";
import { BlogCatalog } from "@/components/blog-catalog";
import { Metadata } from 'next';

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ siteSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { siteSlug } = await params;
    const supabase = createClient();

    const { data: site } = await supabase
        .from("sites")
        .select("title, description")
        .eq("subdomain", siteSlug)
        .single();

    if (!site) return { title: "Site não encontrado" };

    return {
        title: site.title,
        description: site.description,
    };
}

export default async function SiteHomePage({ params }: Props) {
    const { siteSlug } = await params;
    const supabase = createClient();

    // 1. Fetch Site
    const { data: site } = await supabase
        .from("sites")
        .select("id, title, description")
        .eq("subdomain", siteSlug)
        .single();

    if (!site) return notFound();

    // 2. Fetch 'home' page
    const { data: page } = await supabase
        .from("pages")
        .select("*")
        .eq("site_id", site.id)
        .eq("slug", "home")
        .eq("status", "published")
        .single();

    // 3. Fallback: If no home page, show Blog Catalog
    if (!page) {
        console.log(`[Debug] Home page not found for ${site.title}, showing catalog fallback.`);
        const { data: posts } = await supabase
            .from("pages")
            .select("slug, title, description, published_at")
            .eq("site_id", site.id)
            .eq("type", "post")
            .eq("status", "published")
            .order("published_at", { ascending: false });

        return (
            <div className="container max-w-screen-2xl mx-auto px-6 py-12">
                <BlogCatalog posts={posts || []} siteSlug={siteSlug} />
            </div>
        );
    }

    // 4. Render Home Page
    const customComponents = {
        'post-grid': (props: any) => <PostGrid siteId={site.id} siteSlug={siteSlug} {...props} />,
        'spacer': SpacerBlock,
        'text': TextBlock
    };

    return (
        <article className="min-h-screen relative z-10 flex flex-col items-center">
            {/* Optional Header for Sites */}
            <header className="w-full max-w-4xl mx-auto p-6 md:p-12 mb-8 flex flex-col items-center text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/10 backdrop-blur-sm">
                    <span className="text-2xl font-bold text-primary tracking-tighter shadow-primary/50 drop-shadow-lg">{site.title.slice(0, 2).toUpperCase()}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-4">{site.title}</h1>
                {site.description && <p className="text-xl text-muted-foreground/80 max-w-2xl leading-relaxed">{site.description}</p>}
            </header>

            <div className="w-full max-w-4xl px-6 pb-24 space-y-12">
                <BlockRenderer
                    blocks={page.content_blocks as Block[]}
                    customComponents={customComponents}
                />
            </div>

            <footer className="w-full py-8 text-center text-sm text-muted-foreground/60 border-t border-white/5 mt-auto">
                <p>© {new Date().getFullYear()} {site.title} • Powered by StackPage</p>
            </footer>
        </article>
    );
}
