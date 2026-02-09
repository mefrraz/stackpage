import { getSiteBySlug } from "@/lib/sites";
import { getPage } from "@/lib/pages";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@stackpage/blocks";

interface PageProps {
    params: Promise<{ siteSlug: string; pageSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { siteSlug, pageSlug } = await params;
    const site = await getSiteBySlug(siteSlug);
    if (!site) return { title: "Página não encontrada" };

    const page = await getPage(site.id, pageSlug);
    if (!page) return { title: "Página não encontrada | " + site.title };

    return {
        title: `${page.title} | ${site.title}`,
        description: page.description || `Página do site ${site.title}`,
    };
}

export default async function SitePage({ params }: PageProps) {
    const { siteSlug, pageSlug } = await params;
    const site = await getSiteBySlug(siteSlug);

    if (!site) return notFound();

    const page = await getPage(site.id, pageSlug);

    if (!page) {
        return notFound();
    }

    return (
        <main className="min-h-screen">
            <BlockRenderer blocks={page.content_blocks || []} />
        </main>
    );
}
