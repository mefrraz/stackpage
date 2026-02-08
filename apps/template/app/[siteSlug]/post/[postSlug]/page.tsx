import { createClient } from "@/lib/supabase";
import { BlockRenderer, Block } from "@stackpage/blocks";
import { SpacerBlock } from "@stackpage/blocks/src/spacer-block";
import { TextBlock } from "@stackpage/blocks/src/text-block";
import { PostGrid } from "@/components/blocks/post-grid";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ siteSlug: string; postSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { siteSlug, postSlug } = await params;
    const supabase = createClient();

    const { data: site } = await supabase.from("sites").select("id").eq("subdomain", siteSlug).single();
    if (!site) return { title: "Post não encontrado" };

    const { data: page } = await supabase
        .from("pages")
        .select("title, description")
        .eq("site_id", site.id)
        .eq("slug", postSlug)
        .single();

    return page ? { title: page.title, description: page.description } : { title: "Post não encontrado" };
}

export default async function BlogPostPage({ params }: Props) {
    const { siteSlug, postSlug } = await params;
    const supabase = createClient();

    // 1. Fetch Site
    const { data: site } = await supabase.from("sites").select("id, title").eq("subdomain", siteSlug).single();
    if (!site) return notFound();

    // 2. Fetch Post
    const { data: page } = await supabase
        .from("pages")
        .select("*")
        .eq("site_id", site.id)
        .eq("slug", postSlug)
        .eq("type", "post") // Must be a post
        .eq("status", "published")
        .single();

    if (!page) return notFound();

    const customComponents = {
        'post-grid': (props: any) => <PostGrid siteId={site.id} {...props} />,
        'spacer': SpacerBlock,
        'text': TextBlock
    };

    return (
        <article className="min-h-screen py-12">
            <BlockRenderer
                blocks={page.content_blocks as Block[]}
                customComponents={customComponents}
            />
        </article>
    );
}
