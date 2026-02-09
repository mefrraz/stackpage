import { getSiteBySlug } from "@/lib/sites";
import { getPage } from "@/lib/pages";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@stackpage/blocks";

interface SitePageProps {
    params: Promise<{ siteSlug: string }>;
}

export default async function SiteHomePage({ params }: SitePageProps) {
    const { siteSlug } = await params;
    const site = await getSiteBySlug(siteSlug);

    if (!site) return notFound();

    // Always fetch the 'home' page for the root URL
    const page = await getPage(site.id, 'home');

    if (!page) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Bem-vindo ao {site.title}</h1>
                    <p className="text-muted-foreground">Ainda não foi criada uma página inicial.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen">
            <BlockRenderer blocks={page.content_blocks || []} />
        </main>
    );
}
