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
                {/* Sidebar de Blocos Disponíveis */}
                <aside className="w-80 bg-white border-r overflow-y-auto p-6 flex flex-col gap-4">
                    <h2 className="font-medium text-gray-900 mb-2">Adicionar Blocos</h2>

                    <button className="flex flex-col items-start p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left" onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'hero', props: { title: "Novo Hero", subtitle: "Edite este texto" } }])}>
                        <span className="font-medium block mb-1">Hero Section</span>
                        <span className="text-xs text-gray-500">Destaque principal com imagem e título.</span>
                    </button>

                    <button className="flex flex-col items-start p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left" disabled>
                        <span className="font-medium block mb-1">Texto Rico (Em breve)</span>
                        <span className="text-xs text-gray-500">Parágrafos e formatação.</span>
                    </button>
                </aside>

                {/* Canvas (Preview) */}
                <main className="flex-1 overflow-y-auto p-12">
                    <div className="max-w-4xl mx-auto bg-white min-h-[800px] shadow-sm rounded-lg border">
                        {blocks.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400 p-12 text-center">
                                <p>O seu site está vazio.<br />Clique nos blocos à esquerda para adicionar.</p>
                            </div>
                        ) : (
                            <div className="bg-white">
                                <BlockRenderer blocks={blocks} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
