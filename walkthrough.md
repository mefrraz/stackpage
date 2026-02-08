# Walkthrough: Setup e Teste do StackPage

A infraestrutura base do Monorepo StackPage está configurada com sucesso.

## O Que Foi Feito

1.  **Arquitetura Híbrida**: Configurada estrutura de monorepo com:
    - `apps/web`: O Dashboard SaaS (Next.js App Router).
    - `apps/template`: O Blog Template Git-Backed (Next.js App Router).
    - `packages/ui`: Componentes Shadcn/UI + Tailwind partilhados.
    - `packages/blocks`: Sistema de blocos (Hero, Renderer) centralizado.
    - `packages/database`: Schema SQL e tipos do Supabase.

2.  **Sistema de Blocos (Core)**:
    - Implementado `BlockRenderer` que converte JSON em React Components.
    - Criado `HeroBlock` como exemplo inicial.
    - Adicionada página de teste em `apps/web/test-blocks`.

## Como Executar

Para iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

Isto irá iniciar:
- Dashboard: http://localhost:3000
- Template: http://localhost:3001

## Como Testar

1.  Aceda a **http://localhost:3000/test-blocks**.
2.  Deverá ver um **Bloco Hero** renderizado a partir de um array JSON hardcoded na página.
3.  Isto confirma que o `apps/web` está a importar corretamente o `packages/blocks` e `packages/ui`.

## Próximos Passos (Fase 4 & 5)
- Configurar autenticação OAuth com GitHub.
- Criar o editor visual com Drag-and-Drop.
- Implementar o deploy automático.
