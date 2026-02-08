"use client";

import { Button } from "@stackpage/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSites, deleteSite, Site } from "@/lib/sites";
import { Plus, Trash2, ExternalLink, Edit } from "lucide-react";

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
        <div className="p-6 lg:p-10 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Meus Sites</h1>
                    <p className="text-sm text-muted-foreground mt-1">Cria, gere e publica os teus projetos.</p>
                </div>
                <Link href="/dashboard/new">
                    <Button className="h-10 px-5 rounded-md font-medium">
                        <Plus className="w-4 h-4 mr-2" /> Criar Novo Site
                    </Button>
                </Link>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="card p-5 animate-pulse">
                            <div className="h-28 bg-secondary rounded-md mb-4"></div>
                            <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-secondary rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : sites.length === 0 ? (
                <div className="card p-16 text-center border-dashed">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                        <Plus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Nenhum site criado</h2>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Começa por criar o teu primeiro site e partilha as tuas ideias com o mundo.
                    </p>
                    <Link href="/dashboard/new">
                        <Button className="h-10 px-6 rounded-md">Criar o primeiro site</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sites.map((site) => (
                        <div key={site.id} className="card group relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
                            {/* Preview Placeholder */}
                            <div className="h-32 bg-gradient-to-br from-secondary to-muted flex items-center justify-center border-b">
                                <span className="text-3xl font-bold text-muted-foreground/30 uppercase tracking-widest">
                                    {site.subdomain.slice(0, 2)}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-semibold text-lg mb-1 truncate">{site.title}</h3>
                                <a
                                    href={`https://yourstackpage.vercel.app/${site.subdomain}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-muted-foreground font-mono hover:text-primary hover:underline flex items-center gap-1 mb-4 truncate"
                                >
                                    yourstackpage.vercel.app/{site.subdomain}
                                    <ExternalLink className="w-3 h-3 inline-block shrink-0" />
                                </a>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/editor/${site.id}`} className="flex-1">
                                        <Button className="w-full h-9 rounded-md">
                                            <Edit className="w-4 h-4 mr-2" /> Editar
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive hover:border-destructive"
                                        onClick={() => handleDelete(site.id, site.title)}
                                        disabled={deleting === site.id}
                                    >
                                        {deleting === site.id ? (
                                            <span className="animate-spin">⏳</span>
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
