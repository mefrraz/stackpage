"use client";

import { Button } from "@stackpage/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSites, Site } from "@/lib/sites";

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
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Meus Sites</h1>
                <Button>
                    <Link href="/dashboard/new">+ Novo Site</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p>Carregando...</p>
                ) : sites.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                        <p className="text-gray-500 mb-4">Nenhum site criado ainda.</p>
                        <Button variant="outline">
                            <Link href="/dashboard/new">Criar o primeiro site</Link>
                        </Button>
                    </div>
                ) : (
                    sites.map((site) => (
                        <div key={site.id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-32 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                                Preview
                            </div>
                            <h3 className="font-semibold text-lg mb-1">{site.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{site.subdomain}.stackpage.app</p>
                            <div className="flex gap-2">
                                <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">
                                    <Link href={`/dashboard/editor/${site.id}`}>Editar</Link>
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
