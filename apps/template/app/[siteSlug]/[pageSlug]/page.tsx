import { createClient } from "@/lib/supabase";
import { BlockRenderer, Block } from "@stackpage/blocks";
import { SpacerBlock } from "@stackpage/blocks/src/spacer-block";
import { TextBlock } from "@stackpage/blocks/src/text-block";
import { PostGrid } from "@/components/blocks/post-grid";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ siteSlug: string; pageSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { siteSlug, pageSlug } = await params;
    const supabase = createClient();

    // Ignore if reserved words (though Next.js routing handles 'posts' separately)
    if (pageSlug === 'posts' || pageSlug === 'post') return {};

    const { data: site } = await supabase.from("sites").select("id").eq("subdomain", siteSlug).single();
    if (!site) return { title: "Página não encontrada" };

    const { data: page } = await supabase
        .from("pages")
        .select("title, description")
        .eq("site_id", site.id)
        .eq("slug", pageSlug)
        .single();

    return page ? { title: page.title, description: page.description } : { title: "Página não encontrada" };
}

export default async function GenericPage({ params }: Props) {
    const { siteSlug, pageSlug } = await params;
    const supabase = createClient();

    // 1. Fetch Site
    const { data: site } = await supabase.from("sites").select("id, title").eq("subdomain", siteSlug).single();
    if (!site) return notFound();

    // 2. Fetch Page (Type = 'page')
    const { data: page } = await supabase
        .from("pages")
        .select("*")
        .eq("site_id", site.id)
        .eq("slug", pageSlug)
        .eq("type", "page") // Must be a generic page
        .eq("status", "published")
        .single();

    if (!page) return notFound();

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
