"use client";

import { Button } from "@stackpage/ui";
import Link from "next/link";
import { useState } from "react";
import { createSite } from "@/lib/sites";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe, Layout, Loader2, Sparkles } from "lucide-react";

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
        <div className="max-w-2xl mx-auto p-6 md:pt-12">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 mb-8 bg-secondary/50 px-3 py-1.5 rounded-full hover:bg-secondary">
                <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
            </Link>

            <div className="rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 to-background/80 backdrop-blur-xl p-8 md:p-12 shadow-2xl shadow-primary/5">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/10">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Criar Novo Site</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Dá um nome ao teu projeto e escolhe um endereço web único.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 max-w-md mx-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1 flex items-center gap-2">
                            <Layout className="w-4 h-4 text-muted-foreground" />
                            Nome do Site
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: O Meu Portfolio"
                            className="w-full h-12 px-4 rounded-xl border border-border/50 bg-secondary/30 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            Endereço Web (Subdomínio)
                        </label>
                        <div className="flex relative items-center">
                            <input
                                type="text"
                                placeholder="meu-site"
                                className="flex-1 h-12 pl-4 pr-32 rounded-xl border border-border/50 bg-secondary/30 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40 font-mono"
                                required
                            />
                            <div className="absolute right-0 h-12 px-4 flex items-center bg-secondary/50 border-l border-border/50 rounded-r-xl text-sm text-muted-foreground font-mono select-none">
                                .stackpage.app
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground ml-1">
                            Podes conectar um domínio personalizado mais tarde.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all mt-4"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Criando...
                            </span>
                        ) : "Lançar Site 🚀"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
