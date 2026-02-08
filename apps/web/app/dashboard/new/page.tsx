"use client";

import { Button } from "@stackpage/ui";
import Link from "next/link";
import { useState } from "react";

export default function NewSitePage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // TODO: Call API to create site
        setTimeout(() => {
            alert("Simulação: Site criado!");
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 mb-6 block">
                &larr; Voltar
            </Link>

            <h1 className="text-3xl font-bold mb-8">Criar Novo Site</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Blog
                    </label>
                    <input
                        type="text"
                        placeholder="Ex: O Meu Blog Incrível"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subdomínio
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="meu-blog"
                            className="flex-1 p-2 border border-gray-300 rounded-l-md"
                            required
                        />
                        <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3 flex items-center text-gray-500">
                            .stackpage.app
                        </span>
                    </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Criando..." : "Criar Site"}
                </Button>
            </form>
        </div>
    );
}
