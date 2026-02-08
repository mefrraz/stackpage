"use client";

import Link from "next/link";
import { Button } from "@stackpage/ui";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error") || "Erro desconhecido";
    const [hashError, setHashError] = useState<string | null>(null);

    useEffect(() => {
        // Check if there is a hash (Implicit flow artifact) which indicates PKCE failed
        if (window.location.hash && window.location.hash.includes("access_token")) {
            setHashError("Detetado fluxo Implícito (Hash) em vez de PKCE. A configuração do Supabase ou Cache pode estar incorreta.");
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Erro na Autenticação</h1>
            <p className="text-muted-foreground mb-4">
                Não foi possível iniciar sessão.
            </p>

            <div className="bg-secondary/50 p-4 rounded-md mb-8 max-w-md overflow-auto text-left w-full">
                <div className="mb-2">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Erro do Servidor:</span>
                    <p className="font-mono text-sm break-all text-red-400">{error}</p>
                </div>

                {hashError && (
                    <div className="mt-2 pt-2 border-t border-border">
                        <span className="text-xs font-bold uppercase text-yellow-500">Aviso de Diagnóstico:</span>
                        <p className="font-mono text-xs text-yellow-400">{hashError}</p>
                    </div>
                )}
            </div>

            <Link href="/login">
                <Button>Tentar Novamente</Button>
            </Link>
        </div>
    );
}
