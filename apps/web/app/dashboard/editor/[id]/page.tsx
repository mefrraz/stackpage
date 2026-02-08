"use client";

import { Button } from "@stackpage/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BlockRenderer, Block } from "@stackpage/blocks";
import { SpacerBlock } from "@stackpage/blocks/src/spacer-block";
import { TextBlock } from "@stackpage/blocks/src/text-block";
import { ImageBlock } from "@stackpage/blocks/src/image-block";
import { PostGrid } from "@/components/blocks/post-grid";
import { getPage, updatePage, Page } from "@/lib/pages";
import { getSite, Site } from "@/lib/sites";
import { ArrowLeft, LayoutTemplate, Type, Trash2, Eye, MoveVertical, AlignLeft, LayoutGrid, Image as ImageIcon, Upload, Settings, X, Save, Globe, Smartphone, Tablet, Monitor, Palette, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
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
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    // Settings Modal State
    const [showSettings, setShowSettings] = useState(false);
    const [settingsForm, setSettingsForm] = useState({ title: "", slug: "", description: "" });

    useEffect(() => {
        if (currentPage) {
            setSettingsForm({
                title: currentPage.title,
                slug: currentPage.slug,
                description: currentPage.description || ""
            });
        }
    }, [currentPage]);

    const handleSaveSettings = async () => {
        if (!currentPage) return;

        // Simple slug validation
        const cleanSlug = settingsForm.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

        try {
            const updated = await updatePage(currentPage.id, {
                title: settingsForm.title,
                slug: currentPage.slug === 'home' ? 'home' : cleanSlug,
                description: settingsForm.description
            });
            if (updated) {
                setCurrentPage(updated);
                setShowSettings(false);
                alert("Definições guardadas!");
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao guardar definições.");
        }
    };

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

    const handleImageUpload = async (file: File, blockId: string) => {
        if (!file) return;

        // 1. Get Signature
        try {
            const signRes = await fetch('/api/cloudinary/sign', { method: 'POST' });
            const signData = await signRes.json();

            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', signData.api_key);
            formData.append('timestamp', signData.timestamp);
            formData.append('signature', signData.signature);
            formData.append('folder', signData.folder);

            // 2. Upload to Cloudinary
            const cloudName = signData.cloud_name;
            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();

            if (uploadData.secure_url) {
                updateBlock(blockId, { url: uploadData.secure_url });
            } else {
                alert('Upload failed');
                console.error(uploadData);
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao fazer upload da imagem');
        }
    };

    const selectedBlock = blocks.find(b => b.id === selectedBlockId);

    const getPreviewUrl = () => {
        if (!site) return "#";
        // Fixed URL structure as per user request: yourstackpage.vercel.app/[subdomain]
        const baseUrl = `https://yourstackpage.vercel.app/${site.subdomain}`;

        if (!currentPage) return baseUrl;

        if (currentPage.slug === 'home') return baseUrl;

        if (currentPage.type === 'post') {
            return `${baseUrl}/post/${currentPage.slug}`;
        }

        return `${baseUrl}/${currentPage.slug}`;
    };

    // Custom Components Map for Editor
    const customComponents = {
        'post-grid': (props: any) => <PostGrid siteId={siteId} {...props} />,
        'spacer': SpacerBlock,
        'text': TextBlock,
        'image': ImageBlock
    };

    return (
        <div className="flex h-screen flex-col bg-background selection:bg-primary/20 overflow-hidden">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[20%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px]" />
            </div>

            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 z-50 shrink-0 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 relative">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center justify-center w-8 h-8 rounded-xl bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    </Link>

                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Editando</span>
                        {currentPage ? (
                            <span className="text-sm font-semibold">{currentPage.title}</span>
                        ) : (
                            <span className="text-sm font-semibold italic text-muted-foreground">Selecione uma página</span>
                        )}
                    </div>

                    {currentPage && (
                        <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${currentPage.status === 'published' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                            {currentPage.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </div>
                    )}
                </div>

                {/* Device Toggle */}
                <div className="hidden md:flex items-center gap-1 bg-secondary/30 p-1 rounded-lg border border-border/40">
                    <button
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-1.5 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Desktop"
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setPreviewMode('tablet')}
                        className={`p-1.5 rounded-md transition-all ${previewMode === 'tablet' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Tablet"
                    >
                        <Tablet className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-1.5 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Mobile"
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {/* ModeToggle removed - Dashboard is Dark Mode Only */}

                    {currentPage && (
                        <>
                            <div className="h-6 w-px bg-border/40 mx-1" />

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(getPreviewUrl(), '_blank')}
                                title="Ver Site em Nova Aba"
                                className="text-muted-foreground hover:text-primary"
                            >
                                <Globe className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Ver Site</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowSettings(true)}
                                className="text-muted-foreground hover:text-foreground"
                                title="Definições da Página"
                            >
                                <Settings className="w-4 h-4" />
                            </Button>

                            <Button
                                variant={currentPage.status === 'published' ? "outline" : "default"}
                                size="sm"
                                onClick={handlePublish}
                                disabled={publishing}
                                className="h-9 px-4 rounded-lg shadow-sm"
                            >
                                {currentPage.status === 'published' ? "Despublicar" : "Publicar"}
                            </Button>
                        </>
                    )}

                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={saving || !currentPage}
                        className={`h-9 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all ${saving ? 'opacity-80' : ''}`}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "A guardar..." : "Guardar"}
                    </Button>
                </div>
            </header>

            {/* Settings Modal */}
            {showSettings && currentPage && (
                <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-background/90 border border-border/50 shadow-2xl rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Settings className="w-5 h-5 text-primary" />
                                Definições da Página
                            </h2>
                            <button onClick={() => setShowSettings(false)} className="p-1 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Título da Página</label>
                                <input
                                    className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    value={settingsForm.title}
                                    onChange={e => setSettingsForm({ ...settingsForm, title: e.target.value })}
                                    placeholder="Ex: Sobre Nós"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Slug (URL)</label>
                                <div className="flex items-center">
                                    <span className="text-muted-foreground/50 text-sm mr-1">/</span>
                                    <input
                                        className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-secondary/30 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        value={settingsForm.slug}
                                        onChange={e => setSettingsForm({ ...settingsForm, slug: e.target.value })}
                                        disabled={currentPage.slug === 'home'}
                                    />
                                </div>
                                {currentPage.slug === 'home' && <p className="text-[10px] text-muted-foreground mt-1.5 ml-2">A página inicial não pode mudar de endereço.</p>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Descrição (SEO)</label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                    rows={3}
                                    value={settingsForm.description}
                                    onChange={e => setSettingsForm({ ...settingsForm, description: e.target.value })}
                                    placeholder="Uma breve descrição para o Google..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block flex items-center gap-2">
                                <Palette className="w-3 h-3" /> Tema do Site
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { id: 'luminous', color: '#c084fc', bg: '#09090b', name: 'Luminous' },
                                    { id: 'swiss', color: '#000000', bg: '#ffffff', name: 'Swiss' },
                                    { id: 'cyberpunk', color: '#00ff41', bg: '#050505', name: 'Cyber' },
                                    { id: 'neo-brutalism', color: '#4f46e5', bg: '#fff1f2', name: 'Neo' },
                                ].map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => handleUpdateTheme(theme.id)}
                                        className={`relative aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${site?.config?.theme === theme.id ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-border/50 hover:border-primary/50'}`}
                                        style={{ backgroundColor: theme.bg }}
                                        title={theme.name}
                                    >
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.color }} />
                                        {site?.config?.theme === theme.id && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                                                <Check className="w-4 h-4 text-white drop-shadow-md" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2">Isto altera o estilo de todo o site.</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border/40">
                        <Button variant="ghost" onClick={() => setShowSettings(false)} className="rounded-xl">Cancelar</Button>
                        <Button onClick={handleSaveSettings} className="rounded-xl px-6">Guardar Alterações</Button>
                    </div>
                </div>
                </div>
    )
}

{/* Workspace */ }
<div className="flex-1 flex overflow-hidden relative z-10">
    {/* 1. Pages Sidebar */}
    <PagesSidebar
        siteId={siteId}
        currentPageId={currentPage?.id || null}
        onSelectPage={setCurrentPage}
    />

    {/* 2. Add Blocks Sidebar */}
    <aside className="w-64 border-r border-border/40 bg-background/50 backdrop-blur-xl overflow-y-auto p-4 flex flex-col gap-3 shrink-0 scrollbar-thin scrollbar-thumb-border">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-1">Componentes</p>

        <button
            className="group relative flex items-center gap-4 p-3 rounded-xl border border-border/40 bg-card/40 hover:bg-card/80 hover:border-primary/30 transition-all hover:shadow-md text-left"
            onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'hero', props: { title: "Novo Hero", subtitle: "Edite este texto" } }])}
            disabled={!currentPage}
        >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
                <span className="text-sm font-semibold block group-hover:text-primary transition-colors">Hero</span>
                <span className="text-[10px] text-muted-foreground">Banner principal</span>
            </div>
        </button>

        <button
            className="group relative flex items-center gap-4 p-3 rounded-xl border border-border/40 bg-card/40 hover:bg-card/80 hover:border-primary/30 transition-all hover:shadow-md text-left"
            onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'text', props: { content: "Novo texto..." } }])}
            disabled={!currentPage}
        >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <AlignLeft className="w-5 h-5" />
            </div>
            <div>
                <span className="text-sm font-semibold block group-hover:text-primary transition-colors">Texto</span>
                <span className="text-[10px] text-muted-foreground">Parágrafos ricos</span>
            </div>
        </button>

        <button
            className="group relative flex items-center gap-4 p-3 rounded-xl border border-border/40 bg-card/40 hover:bg-card/80 hover:border-primary/30 transition-all hover:shadow-md text-left"
            onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'post-grid', props: { limit: 6 } }])}
            disabled={!currentPage}
        >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
                <span className="text-sm font-semibold block group-hover:text-primary transition-colors">Blog Grid</span>
                <span className="text-[10px] text-muted-foreground">Lista de posts</span>
            </div>
        </button>

        <button
            className="group relative flex items-center gap-4 p-3 rounded-xl border border-border/40 bg-card/40 hover:bg-card/80 hover:border-primary/30 transition-all hover:shadow-md text-left"
            onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'image', props: {} }])}
            disabled={!currentPage}
        >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <ImageIcon className="w-5 h-5" />
            </div>
            <div>
                <span className="text-sm font-semibold block group-hover:text-primary transition-colors">Imagem</span>
                <span className="text-[10px] text-muted-foreground">Foto ou banner</span>
            </div>
        </button>

        <button
            className="group relative flex items-center gap-4 p-3 rounded-xl border border-border/40 bg-card/40 hover:bg-card/80 hover:border-primary/30 transition-all hover:shadow-md text-left"
            onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'spacer', props: { height: 60 } }])}
            disabled={!currentPage}
        >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <MoveVertical className="w-5 h-5" />
            </div>
            <div>
                <span className="text-sm font-semibold block group-hover:text-primary transition-colors">Espaço</span>
                <span className="text-[10px] text-muted-foreground">Divisor vertical</span>
            </div>
        </button>

        {!currentPage && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs rounded-lg">
                Selecione uma página para adicionar blocos.
            </div>
        )}
    </aside>

    {/* 3. Canvas */}
    <main className="flex-1 overflow-y-auto p-8 bg-secondary/20 relative cursor-default" onClick={() => setSelectedBlockId(null)}>
        {/* Canvas Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {!currentPage ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center bg-background/50 backdrop-blur-sm p-8 rounded-2xl border border-border/40 shadow-sm">
                    <LayoutTemplate className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-medium">Nenhuma página selecionada</p>
                    <p className="text-sm opacity-60 mt-1">Selecione uma página à esquerda para começar a editar.</p>
                </div>
            </div>
        ) : (
            <div
                className={`mx-auto bg-card min-h-[800px] border border-border/50 rounded-xl shadow-2xl transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-[375px]' :
                    previewMode === 'tablet' ? 'max-w-[768px]' :
                        'max-w-4xl'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {blocks.length === 0 ? (
                    <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground p-12 text-center text-sm border-2 border-dashed border-border/40 rounded-xl m-8 bg-secondary/10">
                        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                            <LayoutTemplate className="w-8 h-8 opacity-40" />
                        </div>
                        <p className="font-medium text-lg">Página Vazia</p>
                        <p className="opacity-60 mt-2 max-w-xs mx-auto">Comece por adicionar um bloco "Hero" ou "Texto" a partir do menu lateral.</p>
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
                                className={`relative cursor-pointer transition-all group duration-200 ${selectedBlockId === block.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-card z-10' : 'hover:ring-1 hover:ring-primary/30 hover:bg-primary/[0.02]'}`}
                            >
                                {/* Selection Label */}
                                <div className={`absolute top-0 right-0 -translate-y-full bg-primary text-primary-foreground text-[10px] px-2 py-1 font-bold uppercase tracking-wider rounded-t-md shadow-sm pointer-events-none transform transition-all ${selectedBlockId === block.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                                    {block.type}
                                </div>

                                {/* Hover Outline (subtle) */}
                                {selectedBlockId !== block.id && (
                                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                )}

                                {children}
                            </div>
                        )}
                    />
                )}
            </div>
        )}
    </main>

    {/* 4. Properties Sidebar */}
    <aside className="w-80 border-l border-border/40 bg-background/50 backdrop-blur-xl overflow-y-auto p-6 flex flex-col gap-6 shrink-0 z-20 shadow-[-5px_0_20px_-10px_rgba(0,0,0,0.1)]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Propriedades</p>

        {!selectedBlock ? (
            <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground p-6 rounded-2xl border-2 border-dashed border-border/40 bg-secondary/10">
                <Settings className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-sm font-medium">Nada selecionado</p>
                <p className="text-[10px] opacity-60 mt-1">Clique num bloco no editor para ver as opções.</p>
            </div>
        ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="pb-4 border-b border-border/40 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold capitalize text-lg flex items-center gap-2">
                            {selectedBlock.type === 'hero' && <LayoutTemplate className="w-4 h-4 text-primary" />}
                            {selectedBlock.type === 'text' && <AlignLeft className="w-4 h-4 text-primary" />}
                            {selectedBlock.type === 'image' && <ImageIcon className="w-4 h-4 text-primary" />}
                            {selectedBlock.type}
                        </h3>
                        <span className="text-[10px] font-mono text-muted-foreground opacity-60">ID: {selectedBlock.id.slice(-6)}</span>
                    </div>
                </div>

                {/* Common: Advanced Spacing */}
                <div className="space-y-4 p-4 rounded-xl bg-secondary/30 border border-border/40">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <MoveVertical className="w-3 h-3" /> Espaçamento Vertical
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-medium mb-1.5 block text-muted-foreground text-center">Topo</label>
                            <input
                                type="text"
                                placeholder="ex: 40px"
                                className="w-full h-9 px-2 rounded-lg border border-border/50 bg-background text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                                value={selectedBlock.props.paddingTop || ''}
                                onChange={(e) => updateBlock(selectedBlock.id, { paddingTop: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-medium mb-1.5 block text-muted-foreground text-center">Fundo</label>
                            <input
                                type="text"
                                placeholder="ex: 40px"
                                className="w-full h-9 px-2 rounded-lg border border-border/50 bg-background text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                                value={selectedBlock.props.paddingBottom || ''}
                                onChange={(e) => updateBlock(selectedBlock.id, { paddingBottom: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Block Specific Props */}
                {selectedBlock.type === 'hero' && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Título</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-xl border border-border/50 bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                value={selectedBlock.props.title || ''}
                                onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Subtítulo</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2 rounded-xl border border-border/50 bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                value={selectedBlock.props.subtitle || ''}
                                onChange={(e) => updateBlock(selectedBlock.id, { subtitle: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Botão (CTA)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-xl border border-border/50 bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                value={selectedBlock.props.ctaText || ''}
                                onChange={(e) => updateBlock(selectedBlock.id, { ctaText: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'text' && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Conteúdo</label>
                            <textarea
                                rows={10}
                                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none leading-relaxed"
                                value={selectedBlock.props.content || ''}
                                onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Alinhamento</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => updateBlock(selectedBlock.id, { align })}
                                        className={`h-9 rounded-lg border flex items-center justify-center transition-all ${selectedBlock.props.align === align ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border/50 hover:border-primary/50'}`}
                                    >
                                        {align === 'left' && <AlignLeft className="w-4 h-4" />}
                                        {align === 'center' && <AlignLeft className="w-4 h-4 mx-auto" />}
                                        {align === 'right' && <AlignLeft className="w-4 h-4 ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'spacer' && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Altura (px)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="10"
                                    max="200"
                                    step="10"
                                    className="flex-1"
                                    value={selectedBlock.props.height || 50}
                                    onChange={(e) => updateBlock(selectedBlock.id, { height: parseInt(e.target.value) })}
                                />
                                <span className="font-mono text-sm w-12 text-right">{selectedBlock.props.height || 50}px</span>
                            </div>
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'post-grid' && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Limite de Posts</label>
                            <input
                                type="number"
                                className="w-full h-9 px-4 rounded-xl border border-border/50 bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                value={selectedBlock.props.limit || 6}
                                onChange={(e) => updateBlock(selectedBlock.id, { limit: parseInt(e.target.value) })}
                            />
                            <p className="text-[10px] text-muted-foreground mt-2">
                                Mostra os {selectedBlock.props.limit || 6} posts mais recentes.
                            </p>
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'image' && (
                    <div className="space-y-5">
                        <div className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl p-8 flex flex-col items-center text-center gap-3 hover:bg-primary/10 transition-colors relative group cursor-pointer">
                            <div className="p-3 bg-background rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                <Upload className="w-5 h-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-primary">Carregar Imagem</p>
                                <p className="text-[10px] text-muted-foreground">Arraste ou clique para selecionar</p>
                            </div>
                            <input
                                type="file"
                                className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file, selectedBlock.id);
                                }}
                                accept="image/*"
                            />
                        </div>

                        {selectedBlock.props.url && (
                            <div className="rounded-lg overflow-hidden border border-border/50 relative group">
                                <img src={selectedBlock.props.url} alt="Preview" className="w-full h-32 object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-medium">Imagem Atual</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Legenda</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-xl border border-border/50 bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                value={selectedBlock.props.caption || ''}
                                onChange={(e) => updateBlock(selectedBlock.id, { caption: e.target.value })}
                                placeholder="Legenda da imagem..."
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Texto Alternativo (Alt)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-xl border border-border/50 bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                value={selectedBlock.props.alt || ''}
                                onChange={(e) => updateBlock(selectedBlock.id, { alt: e.target.value })}
                                placeholder="Para leitores de ecrã"
                            />
                        </div>
                    </div>
                )}

                <div className="pt-6 mt-6 border-t border-border/40">
                    <Button
                        variant="ghost"
                        className="w-full text-destructive hover:text-white hover:bg-destructive rounded-xl justify-center h-11 transition-all"
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
        </div >
    );
}
