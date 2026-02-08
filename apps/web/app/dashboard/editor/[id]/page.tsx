"use client";

import { Button } from "@stackpage/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BlockRenderer, Block } from "@stackpage/blocks";
import { getPage, updatePage, Page } from "@/lib/pages";
import { getSite, Site } from "@/lib/sites";
import { ArrowLeft, LayoutTemplate, Type, Trash2, Eye } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { PagesSidebar } from "@/components/editor/pages-sidebar";

export default function EditorPage() {
    const params = useParams();
    const siteId = params.id as string;

    const [site, setSite] = useState<Site | null>(null);
    const [currentPage, setCurrentPage] = useState<Page | null>(null);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);

    // Load initial page (handled by Sidebar usually, but we need one to start)
    // Sidebar component handles selection logic now.

    useEffect(() => {
        getSite(siteId).then(setSite);
    }, [siteId]);

    useEffect(() => {
        if (currentPage) {
            setBlocks(currentPage.content_blocks || []);
        } else {
            setBlocks([]);
        }
    }, [currentPage]);

    // ... handleSave, handlePublish, updateBlock ...

    const handleSave = async () => {
        if (!currentPage) return;
        // ... implementation
    };

    // ... rest of functions ...

    // Correct Preview URL Logic
    const getPreviewUrl = () => {
        if (!site) return "#";
        const baseUrl = `https://yourstackpage.vercel.app/${site.subdomain}`;
        if (!currentPage) return baseUrl;

        // If it's the home page, just go to root
        if (currentPage.slug === 'home') return baseUrl;

        // internal pages use ?p=slug
        return `${baseUrl}?p=${currentPage.slug}`;
    };

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 z-10 shrink-0 border-b border-border bg-background">
                <div className="flex items-center gap-3">
                    {/* ... logo ... */}
                    {/* ... */}
                </div>

                <div className="flex items-center gap-2">
                    <ModeToggle />
                    {currentPage && (
                        <>
                            <div className={`text-xs px-2 py-1 rounded-full border ${currentPage.status === 'published' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'}`}>
                                {currentPage.status === 'published' ? 'Publicado' : 'Rascunho'}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => window.open(getPreviewUrl(), '_blank')} title="Ver no site" disabled={!site}>
                                <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={currentPage.status === 'published' ? "outline" : "default"}
                                size="sm"
                                onClick={handlePublish}
                                disabled={publishing}
                            >
                                {currentPage.status === 'published' ? "Despublicar" : "Publicar"}
                            </Button>
                        </>
                    )}
                    <Button size="sm" onClick={handleSave} disabled={saving || !currentPage} className="ml-2">
                        {saving ? "..." : "Guardar"}
                    </Button>
                </div>
            </header>

            {/* Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* 1. Pages Sidebar */}
                <PagesSidebar
                    siteId={siteId}
                    currentPageId={currentPage?.id || null}
                    onSelectPage={setCurrentPage}
                />

                {/* 2. Add Blocks Sidebar */}
                <aside className="w-48 border-r bg-background overflow-y-auto p-4 flex flex-col gap-2 shrink-0">
                    <p className="text-xs font-mono text-muted-foreground mb-2">Blocos</p>

                    <button
                        className="card p-3 text-left flex items-center gap-3 hover:border-foreground transition-colors"
                        onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'hero', props: { title: "Novo Hero", subtitle: "Edite este texto" } }])}
                        disabled={!currentPage}
                    >
                        <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Hero</span>
                    </button>

                    <button className="card p-3 text-left flex items-center gap-3 opacity-50 cursor-not-allowed" disabled>
                        <Type className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Texto</span>
                    </button>
                </aside>

                {/* 3. Canvas */}
                <main className="flex-1 overflow-y-auto p-8 bg-secondary/30 relative" onClick={() => setSelectedBlockId(null)}>
                    {!currentPage ? (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <p>Selecione ou crie uma página à esquerda.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto bg-card min-h-[800px] border rounded-md shadow-sm" onClick={(e) => e.stopPropagation()}>
                            {blocks.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-muted-foreground p-12 text-center text-sm">
                                    <p>Esta página está vazia.</p>
                                    <p className="text-xs mt-2">Adicione blocos no menu lateral.</p>
                                </div>
                            ) : (
                                <BlockRenderer
                                    blocks={blocks}
                                    wrapper={({ block, children }) => (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedBlockId(block.id);
                                            }}
                                            className={`relative cursor-pointer border-2 transition-all group ${selectedBlockId === block.id ? 'border-primary ring-1 ring-primary/20 z-10' : 'border-transparent hover:border-primary/20'}`}
                                        >
                                            <div className={`absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 font-mono uppercase tracking-wider ${selectedBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                                {block.type}
                                            </div>
                                            {children}
                                        </div>
                                    )}
                                />
                            )}
                        </div>
                    )}
                </main>

                {/* 4. Properties Sidebar */}
                <aside className="w-72 border-l bg-background overflow-y-auto p-4 flex flex-col gap-4 shrink-0">
                    <p className="text-xs font-mono text-muted-foreground">Propriedades</p>

                    {!selectedBlock ? (
                        <p className="text-sm text-muted-foreground text-center mt-8 px-4">
                            Selecione um bloco no editor para alterar as suas propriedades.
                        </p>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right-2 duration-200">
                            <div className="pb-3 border-b border-border">
                                <span className="text-xs font-mono text-muted-foreground block mb-1">ID: {selectedBlock.id.slice(-6)}</span>
                                <h3 className="font-semibold capitalize text-lg">{selectedBlock.type}</h3>
                            </div>

                            {selectedBlock.type === 'hero' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Título</label>
                                        <input
                                            type="text"
                                            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={selectedBlock.props.title || ''}
                                            onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Subtítulo</label>
                                        <textarea
                                            rows={3}
                                            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                            value={selectedBlock.props.subtitle || ''}
                                            onChange={(e) => updateBlock(selectedBlock.id, { subtitle: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Texto do Botão</label>
                                        <input
                                            type="text"
                                            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={selectedBlock.props.ctaText || ''}
                                            onChange={(e) => updateBlock(selectedBlock.id, { ctaText: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 mt-4 border-t border-border">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 justify-start"
                                    onClick={() => {
                                        setBlocks(blocks.filter(b => b.id !== selectedBlock.id));
                                        setSelectedBlockId(null);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Remover Bloco
                                </Button>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
