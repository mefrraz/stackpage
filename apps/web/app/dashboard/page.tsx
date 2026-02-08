"use client";

import { Button } from "@stackpage/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSites, Site } from "@/lib/sites";
import { Plus } from "lucide-react";

export default function DashboardPage() {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSites().then(data => {
            setSites(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold">Meus Sites</h1>
                    <p className="text-sm text-muted-foreground">Gere e edita os teus projetos</p>
                </div>
                <Link href="/dashboard/new">
                    <Button className="h-9 px-4 rounded-md">
                        <Plus className="w-4 h-4 mr-2" /> Novo Site
                    </Button>
                </Link>
            </div>

            {loading ? (
                <p className="text-muted-foreground">Carregando...</p>
            ) : sites.length === 0 ? (
                <div className="card p-12 text-center">
                    <p className="text-muted-foreground mb-4">Nenhum site criado.</p>
                    <Link href="/dashboard/new">
                        <Button variant="outline" className="h-9 rounded-md">
                            Criar o primeiro site
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sites.map((site) => (
                        <div key={site.id} className="card p-5">
                            <div className="h-24 bg-secondary rounded-md mb-4 flex items-center justify-center text-muted-foreground text-sm font-mono">
                                Preview
                            </div>
                            <h3 className="font-semibold mb-1">{site.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4 font-mono">{site.subdomain}.stackpage.app</p>
                            <Link href={`/dashboard/editor/${site.id}`}>
                                <Button className="w-full h-9 rounded-md">
                                    Editar
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
