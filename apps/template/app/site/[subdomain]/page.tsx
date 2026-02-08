import { createClient } from "@/lib/supabase";
import { BlockRenderer, Block } from "@stackpage/blocks";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

// Forçar renderização dinâmica pois depende do subdomínio/dados
export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ subdomain: string }>;
}

// Metadata Dinâmica (Título e Descrição do Site)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { subdomain } = await params;
    const supabase = createClient();

    // Buscar Site pelo subdomínio
    const { data: site } = await supabase
        .from("sites")
        .select("title, description")
        .eq("subdomain", subdomain)
        .single();

    if (!site) return { title: "Site desconhecido" };

    return {
        title: site.title,
        description: site.description,
    };
}

export default async function SitePage({ params }: Props) {
    const { subdomain } = await params;
    const supabase = createClient();

    console.log(`🔍 Carregando site: ${subdomain}`);

    // 1. Buscar o ID do Site
    const { data: site, error: siteError } = await supabase
        .from("sites")
        .select("id, title")
        .eq("subdomain", subdomain)
        .single();

    if (siteError || !site) {
        console.error("Site not found:", siteError);
        return notFound();
    }

    console.log(`✅ Site encontrado: ${site.title} (${site.id})`);

    // 2. Buscar o ID do Post "Home" (slug = 'home')
    const { data: post, error: postError } = await supabase
        .from("posts")
        .select("content_blocks")
        .eq("site_id", site.id)
        .eq("slug", "home")
        .single();

    // Se não houver Home, mostra mensagem amigável
    if (!post) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">{site.title}</h1>
                    <p className="mt-4 text-gray-600">Este site ainda não tem conteúdo publicado.</p>
                </div>
            </div>
        );
    }

    // 3. Renderizar Blocos
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar Simples (Opcional, vinda das settings do site no futuro) */}
            <nav className="border-b py-4 px-6 bg-white/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <span className="font-bold text-xl">{site.title}</span>
                </div>
            </nav>

            <main>
                <BlockRenderer blocks={post.content_blocks as Block[]} />
            </main>

            <footer className="py-8 text-center text-sm text-gray-500 border-t mt-20">
                Powered by <a href="https://stackpage.vercel.app" target="_blank" className="underline hover:text-black">StackPage</a>
            </footer>
        </div>
    );
}
