# Notas de Implementação - StackPage

## Estrutura do Monorepo

O projeto segue uma arquitetura híbrida SaaS + Git-Backed usando Turborepo e pnpm workspaces (embora tenhamos usado npm por compatibilidade).

### Apps
- **`apps/web`**: O Dashboard SaaS. Onde o utilizador cria conta, gere sites e edita conteúdo.
- **`apps/template`**: O "Template" Git-Backed. Este é o código que será clonado para o repositório do utilizador. Ele consome a API do Supabase para renderizar o conteúdo.

### Packages
- **`packages/ui`**: Componentes de UI (Baseados em Shadcn/UI + Tailwind). Partilhado entre Dashboard e Template para consistência visual (WYSIWYG real).
- **`packages/blocks`**: O "Coração" do sistema. Contém o `BlockRenderer` e todos os blocos (Hero, Text, etc.). Importado por ambas as apps.
- **`packages/database`**: Tipos do Supabase e Schema SQL. Garante que o frontend e backend falam a mesma língua.
- **`packages/config`**: Configurações partilhadas (ESLint, TSConfig).

## Decisões Técnicas

1.  **Tailwind Partilhado**: `packages/ui/tailwind.config.js` é usado como preset. Isso evita duplicação de design tokens.
2.  **TranspilePackages**: No Next.js 13+, precisamos adicionar `transpilePackages: ["@stackpage/ui"]` para que os componentes do workspace sejam compilados corretamente.
3.  **Supabase Auth**: Será configurado em `apps/web`. O Template apenas lê dados públicos (ou via API Key segura).

## Próximos Passos
- Implementar o `BlockRenderer` para renderizar JSON em React.
- Criar o mecanismo de "Publish" que clona o repo para o GitHub do utilizador.
