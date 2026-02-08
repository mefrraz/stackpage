"use client";

import { Button } from "@stackpage/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BlockRenderer, Block } from "@stackpage/blocks";
import { getPost, savePost } from "@/lib/posts";
import { ArrowLeft, LayoutTemplate, Type, Trash2 } from "lucide-react";

export default function EditorPage() {
    const params = useParams();
    const siteId = params.id as string;

    const [blocks, setBlocks] = useState<Block[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getPost(siteId).then(setBlocks);
    }, [siteId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await savePost(siteId, blocks);
            alert("Guardado com sucesso!");
        } catch (err) {
            console.error(err);
            alert("Erro ao guardar.");
        } finally {
            setSaving(false);
        }
    };

    const updateBlock = (id: string, newProps: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, props: { ...b.props, ...newProps } } : b));
    };

    const selectedBlock = blocks.find(b => b.id === selectedBlockId);

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Header */}
            <header className="header-bar h-12 flex items-center justify-between px-4 z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Voltar
                    </Link>
                    <div className="h-4 w-px bg-border" />
                    <span className="text-sm font-mono text-muted-foreground">Site #{siteId.slice(0, 8)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => alert("Preview em breve!")}>Preview</Button>
                    <Button size="sm" onClick={handleSave} disabled={saving}>
                        {saving ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </header>

            {/* Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* LEFT: Add Blocks */}
                <aside className="w-56 border-r bg-background overflow-y-auto p-4 flex flex-col gap-2 shrink-0">
                    <p className="text-xs font-mono text-muted-foreground mb-2">Adicionar</p>

                    <button
                        className="card p-3 text-left flex items-center gap-3"
                        onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'hero', props: { title: "Novo Hero", subtitle: "Edite este texto" } }])}
                    >
                        <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Hero</span>
                    </button>

                    <button className="card p-3 text-left flex items-center gap-3 opacity-50 cursor-not-allowed" disabled>
                        <Type className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Texto</span>
                    </button>
                </aside>

                {/* CENTER: Canvas */}
                <main className="flex-1 overflow-y-auto p-8 bg-secondary" onClick={() => setSelectedBlockId(null)}>
                    <div className="max-w-3xl mx-auto bg-card min-h-[600px] border rounded-md" onClick={(e) => e.stopPropagation()}>
                        {blocks.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-muted-foreground p-12 text-center text-sm">
                                <p>Clica em "Hero" para adicionar o primeiro bloco.</p>
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
                                        className={`relative cursor-pointer border-2 transition-colors ${selectedBlockId === block.id ? 'border-foreground' : 'border-transparent hover:border-muted-foreground/30'}`}
                                    >
                                        {selectedBlockId === block.id && (
                                            <div className="absolute top-0 right-0 bg-foreground text-background text-xs px-2 py-0.5 font-mono">
                                                {block.type}
                                            </div>
                                        )}
                                        {children}
                                    </div>
                                )}
                            />
                        )}
                    </div>
                </main>

                {/* RIGHT: Properties */}
                <aside className="w-72 border-l bg-background overflow-y-auto p-4 flex flex-col gap-4 shrink-0">
                    <p className="text-xs font-mono text-muted-foreground">Propriedades</p>

                    {!selectedBlock ? (
                        <p className="text-sm text-muted-foreground text-center mt-8">
                            Seleciona um bloco.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            <div className="pb-3 border-b border-border">
                                <span className="text-xs font-mono text-muted-foreground">{selectedBlock.id.slice(0, 8)}</span>
                                <h3 className="font-semibold capitalize">{selectedBlock.type}</h3>
                            </div>

                            {selectedBlock.type === 'hero' && (
                                <>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Título</label>
                                        <input
                                            type="text"
                                            className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                                            value={selectedBlock.props.title || ''}
                                            onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Subtítulo</label>
                                        <textarea
                                            rows={2}
                                            className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                                            value={selectedBlock.props.subtitle || ''}
                                            onChange={(e) => updateBlock(selectedBlock.id, { subtitle: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Botão CTA</label>
                                        <input
                                            type="text"
                                            className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                                            value={selectedBlock.props.ctaText || ''}
                                            onChange={(e) => updateBlock(selectedBlock.id, { ctaText: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="pt-3 border-t border-border">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                        setBlocks(blocks.filter(b => b.id !== selectedBlock.id));
                                        setSelectedBlockId(null);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Remover
                                </Button>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
