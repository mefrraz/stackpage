# PLAN-stackpage-architecture

> **Objetivo:** Criar um SaaS "No-Code" onde o conteúdo é gerido via Supabase, mas o código do blog final reside no GitHub do utilizador (Git-Backed), permitindo total propriedade e customização.

## 1. Contexto & Arquitetura

O sistema opera num modelo **Híbrido**:
1.  **Dashboard (SaaS)**: Onde o utilizador cria conteúdo e gere o site. Hospedado por nós.
2.  **User Blog (Git-Backed)**: Um repositório Next.js que é clonado para a conta GitHub do utilizador. Ele consome dados do nosso Supabase.

### Fluxo de Dados
- **Edição**: Dashboard -> Supabase (`content_blocks` JSON).
- **Consumo**: User Blog (Next.js) -> Supabase (via API key pública ou rota segura) -> `BlockRenderer`.

---

## 2. Estrutura do Monorepo (Turborepo)

```bash
/
├── apps/
│   ├── web/                # (Dashboard) Next.js App Router, Auth, Editor
│   └── template/           # (Blog Template) Next.js App Router, Clean Code
├── packages/
│   ├── ui/                 # (Shared) Shadcn/UI, Tailwind Config
│   ├── blocks/             # (Core) Definições de blocos (Hero, Text, etc.) + BlockRenderer
│   ├── database/           # (Shared) Tipos do Supabase e Schemas
│   └── config/             # (Shared) ESLint, TSConfig
```

---

## 3. Plano de Implementação

### Fase 1: Fundação & Banco de Dados
- [ ] Inicializar Monorepo com Turborepo.
- [ ] Configurar Supabase e criar tabelas iniciais.
- [ ] Configurar Autenticação (Supabase Auth com GitHub Provider).

#### Schema Proposto (Supabase)
```sql
-- Profiles: Link com GitHub
create table profiles (
  id uuid references auth.users primary key,
  github_token text, -- Encriptado se possível, ou gerido via sessão provider
  email text
);

-- Sites: Configurações do Blog
create table sites (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references auth.users not null,
  subdomain text unique,     -- ex: meublog.stackpage.app (para preview)
  github_repo_url text,      -- ex: https://github.com/user/meu-blog
  deployment_url text,       -- URL da Vercel
  settings jsonb default '{}' -- Favicon, cores, SEO
);

-- Posts: Conteúdo em Blocos
create table posts (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references sites not null,
  slug text not null,
  title text not null,
  published boolean default false,
  blocks jsonb default '[]' -- Array de blocos [{type: 'hero', props: {...}}]
);
```

### Fase 2: Pacote de Blocos (Core)
- [ ] Criar `packages/blocks`.
- [ ] Implementar `BlockRenderer.tsx` (Recebe JSON -> Retorna React Components).
- [ ] Criar blocos iniciais:
    - [ ] `HeroBlock` (Título, Subtítulo, Imagem de Fundo).
    - [ ] `RichTextBlock` (Markdown ou HTML simples).
    - [ ] `ImageBlock` (URL, Caption, Alt).
    - [ ] `PostListBlock` (Lista dinâmica de posts - apenas para a Homepage).

### Fase 3: Dashboard (SaaS App)
- [ ] Criar Layout do Dashboard (Sidebar, Header com User Profile).
- [ ] Implementar Tela "Meus Sites" (Listagem + Criar Novo).
- [ ] **Editor de Posts**:
    - [ ] Implementar Drag-and-Drop (dnd-kit) para reordenar blocos.
    - [ ] Forms de edição para cada tipo de bloco (ex: Input de Título para Hero).
    - [ ] Preview em tempo real usando o `BlockRenderer`.

### Fase 4: Integração GitHub (A "Magia")
- [ ] Criar API Route `/api/github/create-repo`.
- [ ] Usar `octokit` para:
    1.  Autenticar com o token do usuário.
    2.  Criar um novo repositório na conta dele (`{site-slug}`).
    3.  Clonar o conteúdo de `apps/template` para este novo repo.
    4.  (Opcional) Configurar Segredos do Repositório (SUPABASE_URL, SUPABASE_ANON_KEY).
- [ ] Trigger de Deploy via Vercel (ou instruir o usuário a importar na Vercel).

### Fase 5: O Template do Blog
- [ ] Criar `apps/template` (Clean Next.js 14+).
- [ ] Configurar fetching de dados:
    - [ ] `getSiteConfig(domain)`: Busca cores/título.
    - [ ] `getPost(slug)`: Busca os blocos.
- [ ] Página dinâmica `[slug]/page.tsx` que usa `<BlockRenderer blocks={post.blocks} />`.
- [ ] Configurar ISR (Incremental Static Regeneration) para performance.

---

## 4. Próximos Passos (Checklist Imediata)

1.  **Setup**: Executar `/create` para scaffold do monorepo.
2.  **DB**: Configurar projeto Supabase e rodar migrações.
3.  **Blocos**: Desenvolver o primeiro bloco (`Hero`) e o renderer.
4.  **Editor**: Criar a interface de edição básica.

---

## 5. Perguntas em Aberto (Para discussão futura/To-Do)

- **Imagens**: Onde os usuários farão upload das imagens dos blocos? (Supabase Storage é a escolha lógica).
- **Custom Domains**: O SaaS gerirá domínios customizados ou o usuário configura na Vercel dele? (Recomendado: Usuário configura na Vercel dele para simplicidade inicial).
- **Updates do Template**: Como enviar melhorias de código (ex: correção de bugs no layout) para repositórios já criados pelos usuários? (Dependabot ou PRs automáticos - Complexo).
