import Link from "next/link";
import { Button } from "@stackpage/ui";

export default function AuthErrorPage({
    searchParams,
}: {
    searchParams: { error?: string };
}) {
    const error = searchParams.error || "Erro desconhecido";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Erro na Autenticação</h1>
            <p className="text-muted-foreground mb-4">
                Não foi possível iniciar sessão.
            </p>
            <div className="bg-secondary/50 p-4 rounded-md mb-8 max-w-md overflow-auto">
                <p className="font-mono text-xs text-left break-all text-red-400">
                    Detalhe: {error}
                </p>
            </div>
            <Link href="/login">
                <Button>Tentar Novamente</Button>
            </Link>
        </div>
    );
}
