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
import { ArrowLeft, LayoutTemplate, Type, Trash2, Eye, MoveVertical, AlignLeft, LayoutGrid, Image as ImageIcon, Upload, Settings, X, Save, Globe, Smartphone, Monitor, Palette, Check, Grid3X3, Link2, BarChart3, Quote, CreditCard, Images, Maximize2, Minimize2, PanelLeftClose, PanelLeft, Layers, FileText, Sun, Moon, Heading, Square, Minus, MousePointer, Link as LinkIcon } from "lucide-react";
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
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarTab, setSidebarTab] = useState<'pages' | 'blocks'>('blocks');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [previewDarkMode, setPreviewDarkMode] = useState(true);

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

    const handleUpdateTheme = async (newTheme: string) => {
        if (!site) return;
        try {
            const { error } = await supabase
                .from('sites')
                .update({
                    config: { ...site.config, theme: newTheme }
                })
                .eq('id', site.id);

            if (error) throw error;

            setSite({ ...site, config: { ...site.config, theme: newTheme } });
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar tema.");
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

    // Theme Styles Helper
    const getThemeStyles = (themeId: string | undefined, isDark: boolean): React.CSSProperties => {
        const base = {
            transition: 'all 0.3s ease',
        } as React.CSSProperties;

        switch (themeId) {
            case 'luminous':
                return {
                    ...base,
                    '--primary': '#c084fc',
                    '--primary-foreground': '#09090b',
                    '--radius': '1rem',
                    backgroundColor: isDark ? '#09090b' : '#ffffff',
                    color: isDark ? '#fafafa' : '#09090b',
                } as React.CSSProperties;
            case 'cyberpunk':
                return {
                    ...base,
                    '--primary': '#00ff41',
                    '--primary-foreground': '#000000',
                    '--radius': '0px',
                    backgroundColor: isDark ? '#050505' : '#f0f0f0',
                    color: isDark ? '#00ff41' : '#000000',
                    fontFamily: 'Courier New, monospace',
                } as React.CSSProperties;
            case 'neo-brutalism':
                return {
                    ...base,
                    '--primary': '#4f46e5',
                    '--primary-foreground': '#ffffff',
                    '--radius': '0.5rem',
                    '--border': '#000000',
                    backgroundColor: isDark ? '#1a1a1a' : '#fff1f2',
                    color: isDark ? '#ffffff' : '#000000',
                    border: '2px solid #000',
                } as React.CSSProperties;
            case 'swiss':
                return {
                    ...base,
                    '--primary': '#000000',
                    '--primary-foreground': '#ffffff',
                    '--radius': '0px',
                    backgroundColor: isDark ? '#000000' : '#ffffff',
                    color: isDark ? '#ffffff' : '#000000',
                } as React.CSSProperties;
            default:
                return {
                    ...base,
                    backgroundColor: isDark ? '#09090b' : '#ffffff',
                    color: isDark ? '#fafafa' : '#09090b',
                } as React.CSSProperties;
        }
    };

    return (
        <>
            {/* Fullscreen Mode */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[100] bg-background flex flex-col">
                    {/* Exit Fullscreen Button */}
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="fixed top-4 right-4 z-[101] p-2 bg-background/80 backdrop-blur-md border border-border/50 rounded-lg shadow-lg text-muted-foreground hover:text-foreground hover:bg-background transition-all group"
                        title="Sair do Modo Foco"
                    >
                        <Minimize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Preview Only */}
                    <div className="flex-1 overflow-y-auto p-4 flex items-start justify-center">
                        <div
                            className={`${previewDarkMode ? 'dark' : ''} bg-card min-h-[800px] border border-border/50 rounded-xl shadow-2xl transition-all duration-300 w-full ${previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'}`}
                            style={getThemeStyles(site?.config?.theme, previewDarkMode)}
                        >
                            {blocks.length === 0 ? (
                                <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground p-12 text-center text-sm border-2 border-dashed border-border/40 rounded-xl m-8 bg-secondary/10">
                                    <LayoutTemplate className="w-8 h-8 opacity-40 mb-4" />
                                    <p className="font-medium text-lg">Página Vazia</p>
                                    <p className="opacity-60 mt-2">Prima ESC para sair do modo foco e adicionar blocos.</p>
                                </div>
                            ) : (
                                <BlockRenderer
                                    blocks={blocks}
                                    customComponents={customComponents}
                                />
                            )}
                        </div>
                    </div>

                    {/* Viewport Toggle in Fullscreen */}
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background/80 backdrop-blur-md p-1.5 rounded-lg border border-border/50 shadow-lg">
                        <button
                            onClick={() => setPreviewMode('desktop')}
                            className={`p-2 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`p-2 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Normal Editor Layout */}
            <div className={`flex h-screen flex-col bg-background selection:bg-primary/20 overflow-hidden ${isFullscreen ? 'hidden' : ''}`}>
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

                    {/* Device Toggle + Fullscreen */}
                    <div className="hidden md:flex items-center gap-1 bg-secondary/30 p-1 rounded-lg border border-border/40">
                        <button
                            onClick={() => setPreviewMode('desktop')}
                            className={`p-1.5 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            title="Desktop"
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`p-1.5 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            title="Mobile"
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-border/50 mx-1" />
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all"
                            title="Modo Foco"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Quick Theme Selector + Dark/Light Toggle */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1 border border-border/30">
                            {[
                                { id: 'luminous', color: '#c084fc', bg: '#09090b' },
                                { id: 'swiss', color: '#000000', bg: '#ffffff' },
                                { id: 'cyberpunk', color: '#00ff41', bg: '#050505' },
                                { id: 'neo-brutalism', color: '#4f46e5', bg: '#fff1f2' },
                            ].map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => handleUpdateTheme(theme.id)}
                                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${site?.config?.theme === theme.id ? 'ring-2 ring-primary ring-offset-1 ring-offset-background scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
                                    style={{ backgroundColor: theme.bg }}
                                    title={theme.id}
                                >
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.color }} />
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPreviewDarkMode(!previewDarkMode)}
                            className="p-1.5 rounded-md bg-secondary/50 border border-border/30 text-muted-foreground hover:text-foreground transition-all"
                            title={previewDarkMode ? "Preview: Dark Mode" : "Preview: Light Mode"}
                        >
                            {previewDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
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

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border/40">
                                <Button variant="ghost" onClick={() => setShowSettings(false)} className="rounded-xl">Cancelar</Button>
                                <Button onClick={handleSaveSettings} className="rounded-xl px-6">Guardar Alterações</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Workspace */}
                <div className="flex-1 flex overflow-hidden relative z-10">
                    {/* Unified Sidebar with Toggle */}
                    <aside className={`border-r border-border/40 bg-background/50 backdrop-blur-xl overflow-hidden flex flex-col shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-0'}`}>
                        {sidebarOpen && (
                            <div className="flex flex-col h-full">
                                {/* Sidebar Header with Tabs */}
                                <div className="p-3 border-b border-border/40 flex items-center gap-2">
                                    <div className="flex-1 flex bg-secondary/30 rounded-lg p-0.5">
                                        <button
                                            onClick={() => setSidebarTab('pages')}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${sidebarTab === 'pages' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            Páginas
                                        </button>
                                        <button
                                            onClick={() => setSidebarTab('blocks')}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${sidebarTab === 'blocks' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <Layers className="w-3.5 h-3.5" />
                                            Blocos
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setSidebarOpen(false)}
                                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                                        title="Fechar Sidebar"
                                    >
                                        <PanelLeftClose className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-border">
                                    {/* Pages Tab */}
                                    {sidebarTab === 'pages' && (
                                        <PagesSidebar
                                            siteId={siteId}
                                            currentPageId={currentPage?.id || null}
                                            onSelectPage={setCurrentPage}
                                            embedded={true}
                                        />
                                    )}

                                    {/* Blocks Tab */}
                                    {sidebarTab === 'blocks' && (
                                        <div className="space-y-4">
                                            {/* Simple Components */}
                                            <div>
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Simples</p>
                                                <div className="grid grid-cols-3 gap-1.5">
                                                    <button className="group flex flex-col items-center gap-1 p-2 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all disabled:opacity-50" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'text', props: { content: "Novo texto..." } }])} disabled={!currentPage}>
                                                        <AlignLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Texto</span>
                                                    </button>
                                                    <button className="group flex flex-col items-center gap-1 p-2 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all disabled:opacity-50" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'text', props: { content: "# Título" } }])} disabled={!currentPage}>
                                                        <Heading className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Título</span>
                                                    </button>
                                                    <button className="group flex flex-col items-center gap-1 p-2 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all disabled:opacity-50" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'image', props: { src: "", alt: "" } }])} disabled={!currentPage}>
                                                        <ImageIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Imagem</span>
                                                    </button>
                                                    <button className="group flex flex-col items-center gap-1 p-2 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all disabled:opacity-50" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'spacer', props: { height: "60px" } }])} disabled={!currentPage}>
                                                        <Square className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Espaço</span>
                                                    </button>

                                                    <button className="group flex flex-col items-center gap-1 p-2 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all disabled:opacity-50" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'link-buttons', props: { links: [{ label: "Link", url: "#" }] } }])} disabled={!currentPage}>
                                                        <LinkIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Links</span>
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Advanced Components */}
                                            <div>
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    <button className="group flex flex-col items-center gap-1 p-3 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all disabled:opacity-50" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'hero', props: { title: "Novo Hero", subtitle: "Edite este texto" } }])} disabled={!currentPage}>
                                                        <LayoutTemplate className="w-5 h-5 text-primary/70 group-hover:text-primary" />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Hero</span>
                                                    </button>
                                                    <button className="group flex flex-col items-center gap-1 p-3 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all disabled:opacity-50" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'features-grid', props: { title: "Funcionalidades", features: [{ icon: "zap", title: "Rápido", description: "Performance" }] } }])} disabled={!currentPage}>
                                                        <Grid3X3 className="w-5 h-5 text-primary/70 group-hover:text-primary" />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Features</span>
                                                    </button>
                                                    <button className="group flex flex-col items-center gap-1 p-3 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all disabled:opacity-50" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'post-grid', props: { limit: 6 } }])} disabled={!currentPage}>
                                                        <LayoutGrid className="w-5 h-5 text-primary/70 group-hover:text-primary" />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Blog</span>
                                                    </button>
                                                    <button className="group flex flex-col items-center gap-1 p-3 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all disabled:opacity-50" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'testimonials', props: { title: "O que dizem", testimonials: [{ quote: "Excelente!", author: "Cliente", role: "CEO", rating: 5 }] } }])} disabled={!currentPage}>
                                                        <Quote className="w-5 h-5 text-primary/70 group-hover:text-primary" />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Testemunhos</span>
                                                    </button>
                                                    <button className="group flex flex-col items-center gap-1 p-3 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all disabled:opacity-50" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'pricing-cards', props: { title: "Preços", tiers: [{ name: "Free", price: "€0", features: ["1 site"] }] } }])} disabled={!currentPage}>
                                                        <CreditCard className="w-5 h-5 text-primary/70 group-hover:text-primary" />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Preços</span>
                                                    </button>
                                                    <button className="group flex flex-col items-center gap-1 p-3 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all disabled:opacity-50" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'gallery-masonry', props: { columns: 3 } }])} disabled={!currentPage}>
                                                        <Images className="w-5 h-5 text-primary/70 group-hover:text-primary" />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Galeria</span>
                                                    </button>
                                                    <button className="group flex flex-col items-center gap-1 p-3 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all disabled:opacity-50" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'stats-bar', props: { stats: [{ value: "10K+", label: "Utilizadores" }] } }])} disabled={!currentPage}>
                                                        <BarChart3 className="w-5 h-5 text-primary/70 group-hover:text-primary" />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">Stats</span>
                                                    </button>
                                                </div>
                                            </div>
                                            {!currentPage && (
                                                <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[10px] rounded-lg text-center">
                                                    Selecione uma página
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Sidebar Toggle (when closed) */}
                    {
                        !sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-background/80 backdrop-blur-md border border-border/50 rounded-lg shadow-lg text-muted-foreground hover:text-foreground hover:bg-background transition-all"
                                title="Abrir Sidebar"
                            >
                                <PanelLeft className="w-4 h-4" />
                            </button>
                        )
                    }

                    {/* Canvas */}
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
                                className={`${previewDarkMode ? 'dark' : ''} mx-auto min-h-[800px] border border-border/50 rounded-xl shadow-2xl transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-7xl'}`}
                                onClick={(e) => e.stopPropagation()}
                                style={getThemeStyles(site?.config?.theme, previewDarkMode)}
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

                                {/* Features Grid Editor */}
                                {selectedBlock.type === 'features-grid' && (
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Título da Secção</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 rounded-xl border border-border/50 bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                value={selectedBlock.props.title || ''}
                                                onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                                                placeholder="Funcionalidades"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Features ({selectedBlock.props.features?.length || 0})</label>
                                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                                {(selectedBlock.props.features || []).map((feature: any, idx: number) => (
                                                    <div key={idx} className="p-3 bg-secondary/20 rounded-lg border border-border/30 space-y-2">
                                                        <div className="flex gap-2">
                                                            <select
                                                                className="w-20 px-2 py-1 rounded-lg border border-border/50 bg-background text-xs"
                                                                value={feature.icon || 'zap'}
                                                                onChange={(e) => {
                                                                    const newFeatures = [...(selectedBlock.props.features || [])];
                                                                    newFeatures[idx] = { ...feature, icon: e.target.value };
                                                                    updateBlock(selectedBlock.id, { features: newFeatures });
                                                                }}
                                                            >
                                                                {['zap', 'shield', 'clock', 'star', 'users', 'globe', 'rocket', 'heart', 'code', 'lock'].map(icon => (
                                                                    <option key={icon} value={icon}>{icon}</option>
                                                                ))}
                                                            </select>
                                                            <input
                                                                className="flex-1 px-2 py-1 rounded-lg border border-border/50 bg-background text-xs"
                                                                value={feature.title || ''}
                                                                onChange={(e) => {
                                                                    const newFeatures = [...(selectedBlock.props.features || [])];
                                                                    newFeatures[idx] = { ...feature, title: e.target.value };
                                                                    updateBlock(selectedBlock.id, { features: newFeatures });
                                                                }}
                                                                placeholder="Título"
                                                            />
                                                            <button
                                                                className="p-1 text-destructive hover:bg-destructive/10 rounded"
                                                                onClick={() => {
                                                                    const newFeatures = (selectedBlock.props.features || []).filter((_: any, i: number) => i !== idx);
                                                                    updateBlock(selectedBlock.id, { features: newFeatures });
                                                                }}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <input
                                                            className="w-full px-2 py-1 rounded-lg border border-border/50 bg-background text-xs"
                                                            value={feature.description || ''}
                                                            onChange={(e) => {
                                                                const newFeatures = [...(selectedBlock.props.features || [])];
                                                                newFeatures[idx] = { ...feature, description: e.target.value };
                                                                updateBlock(selectedBlock.id, { features: newFeatures });
                                                            }}
                                                            placeholder="Descrição"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full mt-2 rounded-lg"
                                                onClick={() => {
                                                    const newFeatures = [...(selectedBlock.props.features || []), { icon: 'star', title: 'Nova Feature', description: 'Descrição' }];
                                                    updateBlock(selectedBlock.id, { features: newFeatures });
                                                }}
                                            >
                                                + Adicionar Feature
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Link Buttons Editor */}
                                {selectedBlock.type === 'link-buttons' && (
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Título</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 rounded-xl border border-border/50 bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                value={selectedBlock.props.title || ''}
                                                onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                                                placeholder="Minhas Redes"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Links ({selectedBlock.props.links?.length || 0})</label>
                                            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                                {(selectedBlock.props.links || []).map((link: any, idx: number) => (
                                                    <div key={idx} className="flex gap-2 items-center p-2 bg-secondary/20 rounded-lg">
                                                        <select
                                                            className="w-24 px-2 py-1 rounded-lg border border-border/50 bg-background text-xs"
                                                            value={link.icon || 'link'}
                                                            onChange={(e) => {
                                                                const newLinks = [...(selectedBlock.props.links || [])];
                                                                newLinks[idx] = { ...link, icon: e.target.value };
                                                                updateBlock(selectedBlock.id, { links: newLinks });
                                                            }}
                                                        >
                                                            {['instagram', 'twitter', 'youtube', 'linkedin', 'github', 'globe', 'mail', 'music', 'link'].map(icon => (
                                                                <option key={icon} value={icon}>{icon}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            className="w-20 px-2 py-1 rounded-lg border border-border/50 bg-background text-xs"
                                                            value={link.label || ''}
                                                            onChange={(e) => {
                                                                const newLinks = [...(selectedBlock.props.links || [])];
                                                                newLinks[idx] = { ...link, label: e.target.value };
                                                                updateBlock(selectedBlock.id, { links: newLinks });
                                                            }}
                                                            placeholder="Label"
                                                        />
                                                        <input
                                                            className="flex-1 px-2 py-1 rounded-lg border border-border/50 bg-background text-xs"
                                                            value={link.url || ''}
                                                            onChange={(e) => {
                                                                const newLinks = [...(selectedBlock.props.links || [])];
                                                                newLinks[idx] = { ...link, url: e.target.value };
                                                                updateBlock(selectedBlock.id, { links: newLinks });
                                                            }}
                                                            placeholder="URL"
                                                        />
                                                        <button
                                                            className="p-1 text-destructive hover:bg-destructive/10 rounded"
                                                            onClick={() => {
                                                                const newLinks = (selectedBlock.props.links || []).filter((_: any, i: number) => i !== idx);
                                                                updateBlock(selectedBlock.id, { links: newLinks });
                                                            }}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full mt-2 rounded-lg"
                                                onClick={() => {
                                                    const newLinks = [...(selectedBlock.props.links || []), { icon: 'link', label: 'Link', url: '#' }];
                                                    updateBlock(selectedBlock.id, { links: newLinks });
                                                }}
                                            >
                                                + Adicionar Link
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Stats Bar Editor */}
                                {selectedBlock.type === 'stats-bar' && (
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Stats ({selectedBlock.props.stats?.length || 0})</label>
                                            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                                {(selectedBlock.props.stats || []).map((stat: any, idx: number) => (
                                                    <div key={idx} className="flex gap-2 items-center p-2 bg-secondary/20 rounded-lg">
                                                        <input
                                                            className="w-20 px-2 py-1 rounded-lg border border-border/50 bg-background text-xs font-bold"
                                                            value={stat.value || ''}
                                                            onChange={(e) => {
                                                                const newStats = [...(selectedBlock.props.stats || [])];
                                                                newStats[idx] = { ...stat, value: e.target.value };
                                                                updateBlock(selectedBlock.id, { stats: newStats });
                                                            }}
                                                            placeholder="10K+"
                                                        />
                                                        <input
                                                            className="flex-1 px-2 py-1 rounded-lg border border-border/50 bg-background text-xs"
                                                            value={stat.label || ''}
                                                            onChange={(e) => {
                                                                const newStats = [...(selectedBlock.props.stats || [])];
                                                                newStats[idx] = { ...stat, label: e.target.value };
                                                                updateBlock(selectedBlock.id, { stats: newStats });
                                                            }}
                                                            placeholder="Utilizadores"
                                                        />
                                                        <button
                                                            className="p-1 text-destructive hover:bg-destructive/10 rounded"
                                                            onClick={() => {
                                                                const newStats = (selectedBlock.props.stats || []).filter((_: any, i: number) => i !== idx);
                                                                updateBlock(selectedBlock.id, { stats: newStats });
                                                            }}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full mt-2 rounded-lg"
                                                onClick={() => {
                                                    const newStats = [...(selectedBlock.props.stats || []), { value: '0', label: 'Novo' }];
                                                    updateBlock(selectedBlock.id, { stats: newStats });
                                                }}
                                            >
                                                + Adicionar Stat
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Testimonials Editor */}
                                {selectedBlock.type === 'testimonials' && (
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Título</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 rounded-xl border border-border/50 bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                value={selectedBlock.props.title || ''}
                                                onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                                                placeholder="O que dizem sobre nós"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Testemunhos ({selectedBlock.props.testimonials?.length || 0})</label>
                                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                                {(selectedBlock.props.testimonials || []).map((t: any, idx: number) => (
                                                    <div key={idx} className="p-3 bg-secondary/20 rounded-lg border border-border/30 space-y-2">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1 space-y-2">
                                                                <textarea
                                                                    rows={2}
                                                                    className="w-full px-2 py-1 rounded-lg border border-border/50 bg-background text-xs resize-none"
                                                                    value={t.quote || ''}
                                                                    onChange={(e) => {
                                                                        const newTestimonials = [...(selectedBlock.props.testimonials || [])];
                                                                        newTestimonials[idx] = { ...t, quote: e.target.value };
                                                                        updateBlock(selectedBlock.id, { testimonials: newTestimonials });
                                                                    }}
                                                                    placeholder="Citação..."
                                                                />
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        className="flex-1 px-2 py-1 rounded-lg border border-border/50 bg-background text-xs"
                                                                        value={t.author || ''}
                                                                        onChange={(e) => {
                                                                            const newTestimonials = [...(selectedBlock.props.testimonials || [])];
                                                                            newTestimonials[idx] = { ...t, author: e.target.value };
                                                                            updateBlock(selectedBlock.id, { testimonials: newTestimonials });
                                                                        }}
                                                                        placeholder="Nome"
                                                                    />
                                                                    <input
                                                                        className="flex-1 px-2 py-1 rounded-lg border border-border/50 bg-background text-xs"
                                                                        value={t.role || ''}
                                                                        onChange={(e) => {
                                                                            const newTestimonials = [...(selectedBlock.props.testimonials || [])];
                                                                            newTestimonials[idx] = { ...t, role: e.target.value };
                                                                            updateBlock(selectedBlock.id, { testimonials: newTestimonials });
                                                                        }}
                                                                        placeholder="Cargo"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <button
                                                                className="p-1 text-destructive hover:bg-destructive/10 rounded ml-2"
                                                                onClick={() => {
                                                                    const newTestimonials = (selectedBlock.props.testimonials || []).filter((_: any, i: number) => i !== idx);
                                                                    updateBlock(selectedBlock.id, { testimonials: newTestimonials });
                                                                }}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full mt-2 rounded-lg"
                                                onClick={() => {
                                                    const newTestimonials = [...(selectedBlock.props.testimonials || []), { quote: 'Excelente!', author: 'Nome', role: 'Cargo', rating: 5 }];
                                                    updateBlock(selectedBlock.id, { testimonials: newTestimonials });
                                                }}
                                            >
                                                + Adicionar Testemunho
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Pricing Cards Editor */}
                                {selectedBlock.type === 'pricing-cards' && (
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Título</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 rounded-xl border border-border/50 bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                value={selectedBlock.props.title || ''}
                                                onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                                                placeholder="Preços"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Planos ({selectedBlock.props.tiers?.length || 0})</label>
                                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                                {(selectedBlock.props.tiers || []).map((tier: any, idx: number) => (
                                                    <div key={idx} className={`p-3 rounded-lg border space-y-2 ${tier.highlighted ? 'bg-primary/10 border-primary/30' : 'bg-secondary/20 border-border/30'}`}>
                                                        <div className="flex gap-2 items-center">
                                                            <input
                                                                className="flex-1 px-2 py-1 rounded-lg border border-border/50 bg-background text-xs font-bold"
                                                                value={tier.name || ''}
                                                                onChange={(e) => {
                                                                    const newTiers = [...(selectedBlock.props.tiers || [])];
                                                                    newTiers[idx] = { ...tier, name: e.target.value };
                                                                    updateBlock(selectedBlock.id, { tiers: newTiers });
                                                                }}
                                                                placeholder="Nome"
                                                            />
                                                            <input
                                                                className="w-16 px-2 py-1 rounded-lg border border-border/50 bg-background text-xs"
                                                                value={tier.price || ''}
                                                                onChange={(e) => {
                                                                    const newTiers = [...(selectedBlock.props.tiers || [])];
                                                                    newTiers[idx] = { ...tier, price: e.target.value };
                                                                    updateBlock(selectedBlock.id, { tiers: newTiers });
                                                                }}
                                                                placeholder="€0"
                                                            />
                                                            <label className="flex items-center gap-1 text-[10px]">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={tier.highlighted || false}
                                                                    onChange={(e) => {
                                                                        const newTiers = [...(selectedBlock.props.tiers || [])];
                                                                        newTiers[idx] = { ...tier, highlighted: e.target.checked };
                                                                        updateBlock(selectedBlock.id, { tiers: newTiers });
                                                                    }}
                                                                />
                                                                Popular
                                                            </label>
                                                            <button
                                                                className="p-1 text-destructive hover:bg-destructive/10 rounded"
                                                                onClick={() => {
                                                                    const newTiers = (selectedBlock.props.tiers || []).filter((_: any, i: number) => i !== idx);
                                                                    updateBlock(selectedBlock.id, { tiers: newTiers });
                                                                }}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <input
                                                            className="w-full px-2 py-1 rounded-lg border border-border/50 bg-background text-xs"
                                                            value={(tier.features || []).join(', ')}
                                                            onChange={(e) => {
                                                                const newTiers = [...(selectedBlock.props.tiers || [])];
                                                                newTiers[idx] = { ...tier, features: e.target.value.split(',').map((f: string) => f.trim()) };
                                                                updateBlock(selectedBlock.id, { tiers: newTiers });
                                                            }}
                                                            placeholder="Features separadas por vírgula"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full mt-2 rounded-lg"
                                                onClick={() => {
                                                    const newTiers = [...(selectedBlock.props.tiers || []), { name: 'Novo Plano', price: '€0', features: ['Feature 1'], highlighted: false }];
                                                    updateBlock(selectedBlock.id, { tiers: newTiers });
                                                }}
                                            >
                                                + Adicionar Plano
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Gallery Masonry Editor */}
                                {selectedBlock.type === 'gallery-masonry' && (
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Colunas</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[2, 3, 4].map((cols) => (
                                                    <button
                                                        key={cols}
                                                        onClick={() => updateBlock(selectedBlock.id, { columns: cols })}
                                                        className={`h-9 rounded-lg border flex items-center justify-center text-sm transition-all ${selectedBlock.props.columns === cols ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border/50 hover:border-primary/50'}`}
                                                    >
                                                        {cols}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Imagens ({selectedBlock.props.images?.length || 0})</label>
                                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                                {(selectedBlock.props.images || []).map((img: any, idx: number) => (
                                                    <div key={idx} className="flex gap-2 items-center p-2 bg-secondary/20 rounded-lg">
                                                        <input
                                                            className="flex-1 px-2 py-1 rounded-lg border border-border/50 bg-background text-xs"
                                                            value={img.src || ''}
                                                            onChange={(e) => {
                                                                const newImages = [...(selectedBlock.props.images || [])];
                                                                newImages[idx] = { ...img, src: e.target.value };
                                                                updateBlock(selectedBlock.id, { images: newImages });
                                                            }}
                                                            placeholder="URL da imagem"
                                                        />
                                                        <button
                                                            className="p-1 text-destructive hover:bg-destructive/10 rounded"
                                                            onClick={() => {
                                                                const newImages = (selectedBlock.props.images || []).filter((_: any, i: number) => i !== idx);
                                                                updateBlock(selectedBlock.id, { images: newImages });
                                                            }}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full mt-2 rounded-lg"
                                                onClick={() => {
                                                    const newImages = [...(selectedBlock.props.images || []), { src: `https://picsum.photos/600/${400 + Math.floor(Math.random() * 400)}?random=${Date.now()}`, alt: 'Nova Imagem' }];
                                                    updateBlock(selectedBlock.id, { images: newImages });
                                                }}
                                            >
                                                + Adicionar Imagem
                                            </Button>
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
                </div >
            </div >
        </>
    );
}
