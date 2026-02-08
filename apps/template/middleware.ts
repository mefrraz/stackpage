import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get("host")!;

    // Domínios onde a App está a correr (Localhost e Vercel)
    // Substituir 'stackpage.vercel.app' pelo domínio final de produção quando houver
    const allowedDomains = ["localhost:3001", "stackpage-template.vercel.app"];

    // Verifica se o hostname é o próprio domínio da app (não é um subdomínio de cliente)
    const isMainDomain = allowedDomains.some((domain) => hostname.includes(domain));

    // Extrair subdomínio (ex: 'meu-blog' de 'meu-blog.stackpage.app')
    // Nota: Em localhost, não temos subdomínios facilmente, então usamos path based routing para teste.
    // Em produção, o Vercel trata do wildcard.

    if (isMainDomain) {
        // Se for acedido diretamente (sem subdomínio), não faz rewrite
        // Permite aceder a /site/nome-do-site manualmente em dev
        return NextResponse.next();
    }

    // Lógica de Subdomínio (Produção)
    // Assumindo formato: subdomain.domain.com
    const subdomain = hostname.split(".")[0];

    // Reescreve para a rota dinâmica que lida com o site
    return NextResponse.rewrite(new URL(`/site/${subdomain}${url.pathname}`, req.url));
}
