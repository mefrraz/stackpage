"use client";

import { Button } from "@stackpage/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BlockRenderer, Block } from "@stackpage/blocks";
import { SpacerBlock } from "@stackpage/blocks/src/spacer-block";
import { TextBlock } from "@stackpage/blocks/src/text-block";
import { PostGrid } from "@/components/blocks/post-grid";
import { getPage, updatePage, Page } from "@/lib/pages";
import { getSite, Site } from "@/lib/sites";
import { ArrowLeft, LayoutTemplate, Type, Trash2, Eye, MoveVertical, AlignLeft, LayoutGrid } from "lucide-react";
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

    // Initial site load
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

    const handleSave = async () => {
        if (!currentPage) return;
        setSaving(true);
        try {
            const updated = await updatePage(currentPage.id, {
                content_blocks: blocks,
                updated_at: new Date().toISOString()
            });
            if (updated) {
                setCurrentPage(updated);
                alert("Guardado com sucesso!");
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao guardar.");
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!currentPage) return;
        setPublishing(true);
        try {
            const newStatus = currentPage.status === 'published' ? 'draft' : 'published';
            const updated = await updatePage(currentPage.id, {
                status: newStatus,
                published_at: newStatus === 'published' ? new Date().toISOString() : undefined
            });
            if (updated) {
                setCurrentPage(updated);
                alert(newStatus === 'published' ? "Publicado com sucesso!" : "Despublicado.");
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao alterar estado.");
        } finally {
            setPublishing(false);
        }
    };

    const updateBlock = (id: string, newProps: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, props: { ...b.props, ...newProps } } : b));
    };

    const selectedBlock = blocks.find(b => b.id === selectedBlockId);

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

    // Custom Components Map for Editor
    const customComponents = {
        'post-grid': (props: any) => <PostGrid siteId={siteId} {...props} />,
        'spacer': SpacerBlock,
        'text': TextBlock
    };

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 z-10 shrink-0 border-b border-border bg-background">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center text-background text-xs font-bold font-mono">
                            S
                        </div>
                    </Link>
                    <div className="h-4 w-px bg-border" />
                    <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </Link>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex flex-col">
                        <span className="text-xs font-mono text-muted-foreground">#{siteId.slice(0, 8)}</span>
                        {currentPage && (
                            <span className="text-xs font-semibold">{currentPage.title}</span>
                        )}
                    </div>
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

                    <button
                        className="card p-3 text-left flex items-center gap-3 hover:border-foreground transition-colors"
                        onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'text', props: { content: "Novo texto..." } }])}
                        disabled={!currentPage}
                    >
                        <AlignLeft className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Texto</span>
                    </button>

                    <button
                        className="card p-3 text-left flex items-center gap-3 hover:border-foreground transition-colors"
                        onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'spacer', props: { height: 60 } }])}
                        disabled={!currentPage}
                    >
                        <MoveVertical className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Espaçador</span>
                    </button>

                    <button
                        className="card p-3 text-left flex items-center gap-3 hover:border-foreground transition-colors"
                        onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'post-grid', props: { limit: 6 } }])}
                        disabled={!currentPage}
                    >
                        <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Post Grid</span>
                    </button>

                    <button className="card p-3 text-left flex items-center gap-3 opacity-50 cursor-not-allowed" disabled>
                        <Type className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Imagem</span>
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
                                    customComponents={customComponents}
                                    wrapper={({ block, children }) => (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedBlockId(block.id);
                                            }}
                                            className={`relative cursor-pointer border-2 transition-all group ${selectedBlockId === block.id ? 'border-primary ring-1 ring-primary/20 z-10' : 'border-transparent hover:border-primary/20'}`}
                                        >
                                            <div className={`absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 font-mono uppercase tracking-wider ${selectedBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity z-20`}>
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
                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-200">
                            <div className="pb-3 border-b border-border">
                                <span className="text-xs font-mono text-muted-foreground block mb-1">ID: {selectedBlock.id.slice(-6)}</span>
                                <h3 className="font-semibold capitalize text-lg">{selectedBlock.type}</h3>
                            </div>

                            {/* Common: Advanced Spacing */}
                            <div className="space-y-3 bg-secondary/50 p-3 rounded-md">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Espaçamento</label>
                                <div>
                                    <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Padding Top</label>
                                    <input
                                        type="text"
                                        placeholder="ex: 40px"
                                        className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                                        value={selectedBlock.props.paddingTop || ''}
                                        onChange={(e) => updateBlock(selectedBlock.id, { paddingTop: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Padding Bottom</label>
                                    <input
                                        type="text"
                                        placeholder="ex: 40px"
                                        className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                                        value={selectedBlock.props.paddingBottom || ''}
                                        onChange={(e) => updateBlock(selectedBlock.id, { paddingBottom: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Block Specific Props */}
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

                            {selectedBlock.type === 'text' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Conteúdo</label>
                                        <textarea
                                            rows={8}
                                            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                            value={selectedBlock.props.content || ''}
                                            onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Alinhamento</label>
                                        <select
                                            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={selectedBlock.props.align || 'left'}
                                            onChange={(e) => updateBlock(selectedBlock.id, { align: e.target.value })}
                                        >
                                            <option value="left">Esquerda</option>
                                            <option value="center">Centro</option>
                                            <option value="right">Direita</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {selectedBlock.type === 'spacer' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Altura (px)</label>
                                        <input
                                            type="number"
                                            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={selectedBlock.props.height || 50}
                                            onChange={(e) => updateBlock(selectedBlock.id, { height: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            )}

                            {selectedBlock.type === 'post-grid' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Limite de Posts</label>
                                        <input
                                            type="number"
                                            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={selectedBlock.props.limit || 6}
                                            onChange={(e) => updateBlock(selectedBlock.id, { limit: parseInt(e.target.value) })}
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
