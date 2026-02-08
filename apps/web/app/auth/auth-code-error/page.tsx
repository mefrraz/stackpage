import Link from "next/link";
import { Button } from "@stackpage/ui";

export default function AuthErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Erro na Autenticação</h1>
            <p className="text-muted-foreground mb-8">
                Não foi possível iniciar sessão. O link pode ter expirado ou ser inválido.
            </p>
            <Link href="/login">
                <Button>Tentar Novamente</Button>
            </Link>
        </div>
    );
}
