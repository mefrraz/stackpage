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
        .select("id, title")
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
        'post-grid': (props: any) => <PostGrid siteId={site.id} {...props} />,
        'spacer': SpacerBlock,
        'text': TextBlock
    };

    return (
        <article className="min-h-screen">
            <BlockRenderer
                blocks={page.content_blocks as Block[]}
                customComponents={customComponents}
            />
        </article>
    );
}
