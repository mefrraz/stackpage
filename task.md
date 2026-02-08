# Tarefas do Projeto StackPage

## Fase 1: Fundação do Monorepo <!-- id: 0 -->
- [x] Inicializar estrutura de diretórios e workspaces (npm/turbo) <!-- id: 1 -->
- [x] Configurar `package.json` raiz e `turbo.json` <!-- id: 2 -->
- [x] Configurar `apps/web` (Dashboard SaaS - Next.js) <!-- id: 3 -->
- [x] Configurar `apps/template` (Blog Template - Next.js) <!-- id: 4 -->
- [x] Configurar `packages/ui` (Shadcn/UI + Tailwind) <!-- id: 5 -->
- [x] Configurar `packages/blocks` (Core Block System) <!-- id: 6 -->
- [x] Configurar `packages/database` (Supabase Types) <!-- id: 7 -->
- [x] Configurar `packages/config` (ESLint, TSConfig partilhados) <!-- id: 8 -->

## Fase 2: Banco de Dados & Auth <!-- id: 9 -->
- [ ] Definir Schema Supabase (SQL) <!-- id: 10 -->
- [ ] Configurar Cliente Supabase em `packages/database` e `apps/web` <!-- id: 11 -->
- [ ] Implementar Auth (GitHub Provider) <!-- id: 12 -->

## Fase 3: Core - Sistema de Blocos <!-- id: 13 -->
- [x] Criar `<BlockRenderer />` em `packages/blocks` <!-- id: 14 -->
- [x] Implementar Bloco: Hero <!-- id: 15 -->
- [/] Implementar Bloco: RichText <!-- id: 16 -->
- [ ] Implementar Bloco: Image <!-- id: 17 -->
- [ ] Implementar Bloco: PostList (Homepage) <!-- id: 18 -->

## Fase 4: O Dashboard (Editor) <!-- id: 19 -->
- [/] Criar Layout do Dashboard (Sidebar, Header) <!-- id: 20 -->
- [/] Implementar Tela "Meus Sites" (Listagem + Criar Novo) <!-- id: 21 -->
- [ ] Criar Editor Visual (Drag-and-Drop / Ordem de Blocos) <!-- id: 22 -->
- [ ] Implementar Preview em tempo real <!-- id: 23 -->

## Fase 5: Integração GitHub (Deploy) <!-- id: 24 -->
- [ ] Implementar API `/api/github/create-repo` <!-- id: 25 -->
- [ ] Configurar segredos do repositório via API (Octokit) <!-- id: 26 -->
- [ ] Testar fluxo de Deploy end-to-end <!-- id: 27 -->
