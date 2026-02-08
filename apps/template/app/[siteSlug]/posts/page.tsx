import { createClient } from "@/lib/supabase";
import { BlogCatalog } from "@/components/blog-catalog";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ siteSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { siteSlug } = await params;
    const supabase = createClient();
    const { data: site } = await supabase.from("sites").select("title, description").eq("subdomain", siteSlug).single();
    return site ? { title: `Blog - ${site.title}`, description: site.description } : { title: "Blog" };
}

export default async function SiteBlogPage({ params }: Props) {
    const { siteSlug } = await params;
    const supabase = createClient();

    // 1. Fetch Site
    const { data: site } = await supabase.from("sites").select("id, title").eq("subdomain", siteSlug).single();
    if (!site) return notFound();

    // 2. Fetch All Published Posts
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
