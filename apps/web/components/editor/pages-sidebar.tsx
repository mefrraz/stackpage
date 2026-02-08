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
        const data = await getSitePages(siteId);
        setPages(data);
        // Select first page if none selected and pages exist
        if (!currentPageId && data.length > 0) {
            onSelectPage(data[0]);
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
            const newPage = await createPage(siteId, newPageTitle, slug, newPageType);
            if (newPage) {
                setPages([newPage, ...pages]);
                onSelectPage(newPage);
                setCreating(false);
                setNewPageTitle("");
            }
        } catch (error) {
            alert("Erro ao criar página. O slug pode já existir.");
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

    return (
        <aside className="w-64 border-r bg-background flex flex-col shrink-0">
            <div className="p-4 border-b">
                <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Estrutura</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        onClick={() => {
                            setCreating(true);
                            setNewPageType('page');
                        }}
                    >
                        <Plus className="w-3 h-3 mr-1" /> Pág
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        onClick={() => {
                            setCreating(true);
                            setNewPageType('post');
                        }}
                    >
                        <Plus className="w-3 h-3 mr-1" /> Post
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {creating && (
                    <form onSubmit={handleCreate} className="p-2 border rounded-md bg-secondary mb-2">
                        <input
                            autoFocus
                            placeholder="Título..."
                            className="w-full text-sm bg-transparent border-b border-border focus:outline-none mb-2"
                            value={newPageTitle}
                            onChange={(e) => setNewPageTitle(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setCreating(false)}>Can</Button>
                            <Button type="submit" size="sm" className="h-6 text-xs">OK</Button>
                        </div>
                    </form>
                )}

                {pages.map(page => (
                    <div
                        key={page.id}
                        onClick={() => onSelectPage(page)}
                        className={cn(
                            "group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm transition-colors",
                            currentPageId === page.id
                                ? "bg-secondary text-foreground font-medium"
                                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )}
                    >
                        <div className="flex items-center gap-2 truncate">
                            {page.type === 'post' ? <FileText className="w-4 h-4" /> : <File className="w-4 h-4" />}
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

                {pages.length === 0 && !creating && (
                    <div className="text-center p-4 text-xs text-muted-foreground">
                        Nenhuma página.
                    </div>
                )}
            </div>
        </aside>
    );
}
