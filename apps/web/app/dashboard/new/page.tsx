"use client";

import { Button } from "@stackpage/ui";
import Link from "next/link";
import { useState } from "react";
import { createSite } from "@/lib/sites";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function NewSitePage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = e.target as HTMLFormElement;
            const title = (form.elements[0] as HTMLInputElement).value;
            const subdomain = (form.elements[1] as HTMLInputElement).value;

            await createSite(title, subdomain);
            router.push("/dashboard");
        } catch (error) {
            alert("Erro ao criar site. Verifique o console.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 pt-12">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-8">
                <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>

            <h1 className="text-xl font-bold mb-6">Criar Novo Site</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-1 block">Nome do Site</label>
                    <input
                        type="text"
                        placeholder="Ex: O Meu Blog"
                        className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium mb-1 block">Subdomínio</label>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="meu-blog"
                            className="flex-1 h-10 px-3 rounded-l-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                            required
                        />
                        <span className="h-10 px-3 bg-secondary border border-l-0 border-border rounded-r-md flex items-center text-sm text-muted-foreground font-mono">
                            .stackpage.app
                        </span>
                    </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-10 rounded-md mt-6">
                    {loading ? "Criando..." : "Criar Site"}
                </Button>
            </form>
        </div>
    );
}
