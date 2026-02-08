import { createClient } from "@/lib/supabase";
import { BlockRenderer, Block } from "@stackpage/blocks";
import { SpacerBlock } from "@stackpage/blocks/src/spacer-block";
import { TextBlock } from "@stackpage/blocks/src/text-block";
import { PostGrid } from "@/components/blocks/post-grid";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import "@/app/globals.css";
import { BlogCatalog } from "@/components/blog-catalog";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Metadata Dinâmica
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createClient();

    // The slug in URL is the SUBDOMAIN of the site (e.g. "blog-do-manel")
    const { data: site } = await supabase
        .from("sites")
        .select("title, description, config")
        .eq("subdomain", slug)
        .single();

    if (!site) return { title: "Site não encontrado" };

    return {
        title: site.title,
        description: site.description,
    };
}

export default async function SitePage({ params, searchParams }: Props) {
    const { slug } = await params; // Site Subdomain
    const search = await searchParams;
    const pageSlug = search.p as string || 'home'; // Query param ?p=about for internal pages

    const supabase = createClient();

    // 1. Buscar Site
    console.log(`[Debug] Fetching site for slug (subdomain): ${slug}`);
    const { data: site, error: siteError } = await supabase
        .from("sites")
        .select("id, title")
        .eq("subdomain", slug)
        .single();

    if (siteError || !site) {
        console.error(`[Debug] Site not found or error. Error:`, siteError);
        return notFound();
    }
    console.log(`[Debug] Site found: ${site.id}`);

    // 2. Tentar buscar a página específica
    console.log(`[Debug] Fetching page: ${pageSlug} for site: ${site.id}`);
    const { data: page, error: pageError } = await supabase
        .from("pages")
        .select("*")
        .eq("site_id", site.id)
        .eq("slug", pageSlug)
        .eq("status", "published")
        .single();

    if (pageError) {
        console.warn(`[Debug] Page error or not found (might be 404 or just Home fallback):`, pageError);
    }

    // 3. Se não encontrar a página e for 'home', mostrar Catálogo (Fallback Legacy)
    if (!page && pageSlug === 'home') {
        console.log(`[Debug] Home page not found, fetching posts for catalog. Site: ${site.id}`);
        const { data: posts, error: postsError } = await supabase
            .from("pages")
            .select("slug, title, description, published_at")
            .eq("site_id", site.id)
            .eq("type", "post")
            .eq("status", "published")
            .order("published_at", { ascending: false });

        if (postsError) {
            console.error(`[Debug] Error fetching catalog posts:`, postsError);
        } else {
            console.log(`[Debug] Catalog posts found: ${posts?.length}`);
        }

        return (
            <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
                <nav className="h-16 flex items-center justify-between px-6 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
                    <Link href={`/`} className="font-bold text-lg tracking-tight">{site.title}</Link>
                </nav>
                <main className="flex-1">
                    <BlogCatalog posts={posts || []} />
                </main>
                <Footer />
            </div>
        );
    }

    // 4. Se não encontrar página específica (e não for home fallback), 404
    if (!page) {
        return notFound();
    }

    // Custom Components Map for Viewer
    const customComponents = {
        'post-grid': (props: any) => <PostGrid siteId={site.id} {...props} />,
        'spacer': SpacerBlock,
        'text': TextBlock
    };

    // 5. Renderizar Página
    return (
        <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
            <nav className="h-16 flex items-center justify-between px-6 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
                <Link href={`/?p=home`} className="font-bold text-lg tracking-tight">{site.title}</Link>
                <div className="flex gap-4 text-sm font-medium">
                    <Link href={`/?p=home`} className="hover:text-primary transition-colors">Blog</Link>
                </div>
            </nav>

            <main className="flex-1">
                <article className="max-w-3xl mx-auto px-6 py-12">
                    {/* Only show default title if block type is page AND it's not the home page? 
                        The new design says "Post has a hero with title".
                        If 'page' has content_blocks, we assume the blocks handle the title (via Hero).
                        But existing posts might rely on this header.
                        Let's keep it conditional: if first block is NOT hero, show header? 
                        Or just trust the plan which says "Post has a hero". 
                        The existing header logic handles "page.type === 'post'".
                        The new default *adds* a Hero to the post.
                        So we might double up on titles if we aren't careful.
                        The plan says "Post Hero where you put the title".
                        So we should probably REMOVE the default header if we move to block-based titles.
                        But for backward compatibility, maybe optional?
                        User Request: "terá ainda uma seção de hero diferente... onde se coloca o título".
                        This implies the title block IS the title.
                        Disabled default header for now if it's a new layout?
                        Hard to detect specific layout.
                        I'll leave it but maybe make it cleaner.
                        Actually, if the user adds a Hero, they likely don't want the default H1.
                        I will COMMENT OUT the default header to fully embrace the block system as requested.
                     */}
                    {/* 
                    {page.type === 'post' && (
                        <header className="mb-8 border-b pb-8">
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2">{page.title}</h1>
                            {page.description && <p className="text-xl text-muted-foreground">{page.description}</p>}
                        </header>
                    )} 
                    */}

                    <BlockRenderer
                        blocks={page.content_blocks as Block[]}
                        customComponents={customComponents}
                    />
                </article>
            </main>

            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <footer className="py-12 px-6 border-t border-border mt-auto">
            <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <span>Criado com</span>
                <a href="https://getstackpage.vercel.app" target="_blank" className="font-semibold hover:text-foreground transition-colors inline-flex items-center gap-1">
                    <div className="w-4 h-4 bg-foreground rounded flex items-center justify-center text-background text-[8px] font-bold font-mono">S</div>
                    StackPage
                </a>
            </div>
        </footer>
    );
}
