"use client";

import { Button } from "@stackpage/ui";
import { Page, createPage, deletePage, getSitePages } from "@/lib/pages";
import { useEffect, useState } from "react";
import { FileText, Plus, Trash2, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface PagesSidebarProps {
    siteId: string;
    currentPageId: string | null;
    onSelectPage: (page: Page) => void;
}

export function PagesSidebar({ siteId, currentPageId, onSelectPage }: PagesSidebarProps) {
    const [pages, setPages] = useState<Page[]>([]);
    const [creating, setCreating] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState("");
    const [newPageType, setNewPageType] = useState<'page' | 'post'>('page');

    useEffect(() => {
        loadPages();
    }, [siteId]);

    const loadPages = async () => {
        try {
            console.log("Loading pages for site:", siteId);
            const data = await getSitePages(siteId);
            console.log("Pages loaded:", data);
            setPages(data);
            // Select first page if none selected and pages exist
            if (!currentPageId && data.length > 0) {
                onSelectPage(data[0]);
            }
        } catch (error) {
            console.error("Failed to load pages:", error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple slug generation
        const slug = newPageTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        try {
            console.log("Creating page:", { siteId, newPageTitle, slug, newPageType });
            const newPage = await createPage(siteId, newPageTitle, slug, newPageType);
            if (newPage) {
                console.log("Page created:", newPage);
                setPages([newPage, ...pages]);
                onSelectPage(newPage);
                setCreating(false);
                setNewPageTitle("");
            }
        } catch (error) {
            console.error("Error creating page:", error);
            alert("Erro ao criar página. Verifique a console para mais detalhes.");
        }
    };

    const handleDelete = async (e: React.MouseEvent, pageId: string) => {
        e.stopPropagation();
        if (!confirm("Tem a certeza que quer eliminar esta página?")) return;

        await deletePage(pageId);
        const newPages = pages.filter(p => p.id !== pageId);
        setPages(newPages);

        if (currentPageId === pageId && newPages.length > 0) {
            onSelectPage(newPages[0]);
        }
    };

    const posts = pages.filter(p => p.type === 'post');
    const sitePages = pages.filter(p => p.type !== 'post');

    return (
        <aside className="w-64 border-r bg-background flex flex-col shrink-0">
            {/* Creating Form Overlay or Inline? Let's keep it simple at top if creating */}
            {creating && (
                <div className="p-4 border-b bg-secondary/30">
                    <p className="text-xs font-bold mb-2">Novo {newPageType === 'post' ? 'Post' : 'Página'}</p>
                    <form onSubmit={handleCreate}>
                        <input
                            autoFocus
                            placeholder="Título..."
                            className="w-full text-sm bg-background border border-input rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring mb-2"
                            value={newPageTitle}
                            onChange={(e) => setNewPageTitle(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setCreating(false)}>Cancelar</Button>
                            <Button type="submit" size="sm" className="h-6 text-xs" disabled={!newPageTitle}>Criar</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                {/* Pages Section */}
                <div className="p-2">
                    <div className="flex items-center justify-between px-2 py-2">
                        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Páginas</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => {
                                setCreating(true);
                                setNewPageType('page');
                            }}
                        >
                            <Plus className="w-3 h-3" />
                        </Button>
                    </div>
                    <div className="space-y-0.5">
                        {sitePages.map(page => (
                            <div
                                key={page.id}
                                onClick={() => onSelectPage(page)}
                                className={cn(
                                    "group flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors",
                                    currentPageId === page.id
                                        ? "bg-secondary text-foreground font-medium"
                                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <File className="w-3.5 h-3.5" />
                                    <span className="truncate">{page.title}</span>
                                </div>
                                {currentPageId === page.id && page.slug !== 'home' && (
                                    <button
                                        onClick={(e) => handleDelete(e, page.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {sitePages.length === 0 && <p className="text-[10px] text-muted-foreground px-3 py-1">Nenhuma página.</p>}
                    </div>
                </div>

                <div className="h-px bg-border mx-4 my-2" />

                {/* Posts Section */}
                <div className="p-2">
                    <div className="flex items-center justify-between px-2 py-2">
                        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Posts</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => {
                                setCreating(true);
                                setNewPageType('post');
                            }}
                        >
                            <Plus className="w-3 h-3" />
                        </Button>
                    </div>
                    <div className="space-y-0.5">
                        {posts.map(page => (
                            <div
                                key={page.id}
                                onClick={() => onSelectPage(page)}
                                className={cn(
                                    "group flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors",
                                    currentPageId === page.id
                                        ? "bg-secondary text-foreground font-medium"
                                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="truncate">{page.title}</span>
                                </div>
                                {currentPageId === page.id && (
                                    <button
                                        onClick={(e) => handleDelete(e, page.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {posts.length === 0 && <p className="text-[10px] text-muted-foreground px-3 py-1">Nenhum post.</p>}
                    </div>
                </div>
            </div>
        </aside>
    );
}
