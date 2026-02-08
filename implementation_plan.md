# Implementação do Template (Public Viewer)

## Objective
Transformar `apps/template` numa aplicação dinâmica que renderiza os sites criados no Dashboard.

## Core Mechanics
1. **Multi-tenancy:** Usar `middleware.ts` para reescrever URLs baseados no `Host`.
   - `meu-blog.stackpage.app` -> rewrite para `/site/meu-blog`
   - `localhost:3001` -> (Dev Mode) rewrite para `/site/demo` ou permitir parametro.

2. **Fetching Strategy:**
   - Obter `subdomain` do URL.
   - Consultar tabela `sites` no Supabase para obter `id` e `settings`.
   - Consultar tabela `posts` para obter a `Home Page` desse site.
   - Renderizar blocos com `BlockRenderer`.

## File Structure Changes
### `apps/template`
- `[NEW] middleware.ts`: Lógica de reescrita de subdomínios.
- `[NEW] lib/supabase.ts`: Cliente Supabase (readonly/anon).
- `[NEW] app/[domain]/page.tsx`: Página principal do site do utilizador.
- `[NEW] app/[domain]/[slug]/page.tsx`: Páginas internas (posts).

## Validation
- Verificar se `localhost:3001` carrega conteúdo (testaremos com subdomínio `meu-teste` via simulação ou cabeçalho host).
