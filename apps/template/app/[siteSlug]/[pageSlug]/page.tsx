import { createClient } from "@/lib/supabase";
import { BlockRenderer, Block } from "@stackpage/blocks";
import { SpacerBlock } from "@stackpage/blocks/src/spacer-block";
import { TextBlock } from "@stackpage/blocks/src/text-block";
import { ImageBlock } from "@stackpage/blocks/src/image-block";
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

    const { data: site } = await supabase
        .from("sites")
        .select("id, title")
        .eq("subdomain", siteSlug)
        .single();

    if (!site) return { title: "Site não encontrado" };

    const { data: page } = await supabase
        .from("pages")
        .select("title, description")
        .eq("site_id", site.id)
        .eq("slug", pageSlug)
        .single();

    if (!page) return { title: `${site.title}` };

    return {
        title: `${page.title} | ${site.title}`,
        description: page.description,
    };
}

export default async function CustomPage({ params }: Props) {
    const { siteSlug, pageSlug } = await params;
    const supabase = createClient();

    // 1. Fetch Site
    const { data: site } = await supabase
        .from("sites")
        .select("id, title")
        .eq("subdomain", siteSlug)
        .single();

    if (!site) return notFound();

    // 2. Fetch Page
    const { data: page } = await supabase
        .from("pages")
        .select("*")
        .eq("site_id", site.id)
        .eq("slug", pageSlug)
        .eq("status", "published")
        .single();

    if (!page) return notFound();

    // 3. Render Page
    const customComponents = {
        'post-grid': (props: any) => <PostGrid siteId={site.id} siteSlug={siteSlug} {...props} />,
        'spacer': SpacerBlock,
        'text': TextBlock,
        'image': ImageBlock
    };

    return (
        <article className="min-h-[50vh]">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{page.title}</h1>
                {page.description && (
                    <p className="text-xl text-muted-foreground">{page.description}</p>
                )}
            </header>
            <BlockRenderer
                blocks={page.content_blocks as Block[]}
                customComponents={customComponents}
            />
        </article>
    );
}
