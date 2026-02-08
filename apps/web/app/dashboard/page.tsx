"use client";

import { Button } from "@stackpage/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSites, deleteSite, Site } from "@/lib/sites";
import { Plus, Trash2, ExternalLink, Edit, ArrowRight, Layout, Globe, MoreVertical, Loader2 } from "lucide-react";

export default function DashboardPage() {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        loadSites();
    }, []);

    const loadSites = async () => {
        setLoading(true);
        const data = await getSites();
        setSites(data);
        setLoading(false);
    };

    const handleDelete = async (siteId: string, siteTitle: string) => {
        if (!confirm(`Tens a certeza que queres eliminar o site "${siteTitle}"? Esta ação não pode ser revertida.`)) {
            return;
        }
        setDeleting(siteId);
        try {
            await deleteSite(siteId);
            setSites(sites.filter(s => s.id !== siteId));
        } catch (error) {
            console.error("Failed to delete site:", error);
            alert("Erro ao eliminar o site.");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-border/40 pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Meus Sites</h1>
                    <p className="text-muted-foreground text-sm max-w-lg">Gere os teus projetos, personaliza o conteúdo e publica instantaneamente.</p>
                </div>
                <Link href="/dashboard/new">
                    <Button className="h-11 px-6 rounded-full font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all bg-primary text-primary-foreground border-0">
                        <Plus className="w-5 h-5 mr-2" /> Novo Projeto
                    </Button>
                </Link>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-64 rounded-2xl border border-border/40 bg-card/20 animate-pulse" />
                    ))}
                </div>
            ) : sites.length === 0 ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/20 p-8 text-center animate-fade-in-up">
                    <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center shadow-inner">
                        <Layout className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Ainda não tens sites</h2>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                        O teu dashboard está vazio. Cria o teu primeiro site para começar a partilhar as tuas ideias.
                    </p>
                    <Link href="/dashboard/new">
                        <Button size="lg" className="rounded-full shadow-lg h-12 px-8">
                            <Plus className="w-4 h-4 mr-2" /> Criar o primeiro site
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sites.map((site) => (
                        <div key={site.id} className="group relative flex flex-col rounded-3xl border border-border/40 bg-gradient-to-b from-card/50 to-background backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">

                            {/* Card Decoration */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            {/* Preview Area */}
                            <div className="relative h-44 w-full overflow-hidden rounded-t-3xl border-b border-border/40 bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
                                <span className="text-6xl font-bold text-foreground/5 uppercase tracking-widest select-none group-hover:scale-110 transition-transform duration-500">
                                    {site.subdomain.slice(0, 2)}
                                </span>

                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                    <a
                                        href={`https://${site.subdomain}.stackpage.vercel.app`} // Updated to subdomains for realism, adjust if needed
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm"
                                        title="Ver Site"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl mb-1 truncate text-foreground group-hover:text-primary transition-colors">{site.title}</h3>
                                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
                                        <Globe className="w-3 h-3" />
                                        <span className="truncate max-w-[200px]">{site.subdomain}.stackpage.vercel.app</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-border/40">
                                    <Link href={`/dashboard/editor/${site.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full h-10 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-medium">
                                            <Edit className="w-4 h-4 mr-2" /> Editar
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 shrink-0 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                                        onClick={() => handleDelete(site.id, site.title)}
                                        disabled={deleting === site.id}
                                        title="Eliminar Site"
                                    >
                                        {deleting === site.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card (Ghost) */}
                    <Link href="/dashboard/new" className="group flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-transparent p-6 hover:bg-card/20 hover:border-primary/50 transition-all duration-300 min-h-[300px]">
                        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300 mb-4 shadow-sm">
                            <Plus className="w-8 h-8" />
                        </div>
                        <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">Criar Novo Site</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
