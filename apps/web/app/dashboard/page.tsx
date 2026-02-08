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
                            <a
                                href={`https://yourstackpage.vercel.app/${site.subdomain}`}
                                target="_blank"
                                className="text-sm text-muted-foreground mb-4 font-mono hover:underline block truncate"
                            >
                                yourstackpage.vercel.app/{site.subdomain}
                            </a>
                            <div className="flex gap-2">
                                <Link href={`/dashboard/editor/${site.id}`} className="flex-1">
                                    <Button className="w-full h-9 rounded-md">
                                        Editar
                                    </Button>
                                </Link>
                                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => window.open(`https://yourstackpage.vercel.app/${site.subdomain}`, '_blank')}>
                                    <span className="sr-only">Ver</span>
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 13.2239 8 13.5 8C13.7761 8 14 8.22386 14 8.5V12C14 13.1046 13.1046 14 12 14H3C1.89543 14 1 13.1046 1 12V3C1 1.89543 1.89543 1 3 1H6.5C6.77614 1 7 1.22386 7 1.5C7 1.77614 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
