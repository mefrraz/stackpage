"use client";

import { Button } from "@stackpage/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BlockRenderer, Block } from "@stackpage/blocks";
import { getPost, savePost } from "@/lib/posts";
import { useEffect } from "react";

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
        <div className="flex h-screen flex-col">
            {/* Header do Editor */}
            <header className="h-16 border-b bg-white flex items-center justify-between px-6 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                        &larr; Voltar
                    </Link>
                    <div className="h-6 w-px bg-gray-200" />
                    <h1 className="font-semibold text-lg">Editando Site #{siteId}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => alert("Preview em breve!")}>Preview</Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Guardando..." : "Publicar Alterações"}
                    </Button>
                </div>
            </header>

            {/* Editor Workspace */}
            <div className="flex-1 flex overflow-hidden bg-gray-100">
                {/* ESQUERDA: Adicionar Blocos */}
                <aside className="w-64 bg-white border-r overflow-y-auto p-4 flex flex-col gap-4 shrink-0">
                    <h2 className="font-medium text-gray-900 text-sm uppercase tracking-wider">Adicionar</h2>

                    <button className="flex flex-col items-start p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'hero', props: { title: "Novo Hero", subtitle: "Edite este texto" } }])}>
                        <span className="font-medium block mb-1 text-sm">Hero Section</span>
                        <span className="text-xs text-gray-500">Destaque principal.</span>
                    </button>

                    <button className="flex flex-col items-start p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left" disabled>
                        <span className="font-medium block mb-1 text-sm">Texto Rico</span>
                        <span className="text-xs text-gray-500">Em breve.</span>
                    </button>
                </aside>

                {/* CENTRO: Canvas (Preview) */}
                <main className="flex-1 overflow-y-auto p-12" onClick={() => setSelectedBlockId(null)}>
                    <div className="max-w-4xl mx-auto bg-white min-h-[800px] shadow-sm rounded-lg border" onClick={(e) => e.stopPropagation()}>
                        {blocks.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400 p-12 text-center">
                                <p>O seu site está vazio.<br />Clique nos blocos à esquerda para adicionar.</p>
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
                                        className={`relative group cursor-pointer border-2 transition-all ${selectedBlockId === block.id ? 'border-blue-500 z-10' : 'border-transparent hover:border-blue-200'}`}
                                    >
                                        {/* Label do Bloco (só aparece no hover ou selecionado) */}
                                        <div className={`absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 ${selectedBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {block.type}
                                        </div>
                                        {children}
                                    </div>
                                )}
                            />
                        )}
                    </div>
                </main>

                {/* DIREITA: Propriedades */}
                <aside className="w-80 bg-white border-l overflow-y-auto p-6 flex flex-col gap-6 shrink-0">
                    <h2 className="font-medium text-gray-900 text-sm uppercase tracking-wider">Propriedades</h2>

                    {!selectedBlock ? (
                        <div className="text-gray-400 text-sm text-center mt-10">
                            Selecione um bloco no centro para editar as suas propriedades.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="pb-4 border-b">
                                <span className="text-xs font-mono text-gray-500">{selectedBlock.id}</span>
                                <h3 className="font-bold text-lg capitalize">{selectedBlock.type}</h3>
                            </div>

                            {/* Campos específicos do Hero */}
                            {selectedBlock.type === 'hero' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Título</label>
                                        <input
                                            type="text"
                                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={selectedBlock.props.title || ''}
                                            onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Subtítulo</label>
                                        <textarea
                                            rows={3}
                                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={selectedBlock.props.subtitle || ''}
                                            onChange={(e) => updateBlock(selectedBlock.id, { subtitle: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Texto do Botão</label>
                                        <input
                                            type="text"
                                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={selectedBlock.props.ctaText || ''}
                                            onChange={(e) => updateBlock(selectedBlock.id, { ctaText: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Link do Botão</label>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={selectedBlock.props.ctaLink || ''}
                                            onChange={(e) => updateBlock(selectedBlock.id, { ctaLink: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Imagem de Fundo (URL)</label>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={selectedBlock.props.backgroundImage || ''}
                                            onChange={(e) => updateBlock(selectedBlock.id, { backgroundImage: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="pt-4 border-t">
                                <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => {
                                    setBlocks(blocks.filter(b => b.id !== selectedBlock.id));
                                    setSelectedBlockId(null);
                                }}>
                                    Remover Bloco
                                </Button>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
