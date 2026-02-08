import { createClient } from "@/lib/supabase";
import { BlockRenderer, Block } from "@stackpage/blocks";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import "@/app/globals.css"; // Ensure clean minimal styles are applied

// Forçar renderização dinâmica
export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

// Metadata Dinâmica
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createClient();

    const { data: site } = await supabase
        .from("sites")
        .select("title, description")
        .eq("subdomain", slug) // The "slug" in the URL corresponds to the "subdomain" field in DB
        .single();

    if (!site) return { title: "Site não encontrado" };

    return {
        title: site.title,
        description: site.description,
    };
}

export default async function SitePage({ params }: Props) {
    const { slug } = await params;
    const supabase = createClient();

    // 1. Buscar o ID do Site
    const { data: site, error: siteError } = await supabase
        .from("sites")
        .select("id, title")
        .eq("subdomain", slug)
        .single();

    if (siteError || !site) {
        return notFound();
    }

    // 2. Buscar conteúdo "Home"
    const { data: post } = await supabase
        .from("posts")
        .select("content_blocks")
        .eq("site_id", site.id)
        .eq("slug", "home")
        .single();

    if (!post) {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">{site.title}</h1>
                    <p className="text-muted-foreground">Em breve.</p>
                </div>
            </div>
        );
    }

    // 3. Renderizar com Clean Minimal Design
    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            {/* Minimal Header */}
            <nav className="h-16 flex items-center justify-between px-6 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
                <div className="font-bold text-lg tracking-tight">{site.title}</div>
            </nav>

            <main>
                <BlockRenderer blocks={post.content_blocks as Block[]} />
            </main>

            <footer className="py-12 px-6 border-t border-border mt-20">
                <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <span>Criado com</span>
                    <a href="https://getstackpage.vercel.app" target="_blank" className="font-semibold hover:text-foreground transition-colors inline-flex items-center gap-1">
                        <div className="w-4 h-4 bg-foreground rounded flex items-center justify-center text-background text-[8px] font-bold font-mono">S</div>
                        StackPage
                    </a>
                </div>
            </footer>
        </div>
    );
}
