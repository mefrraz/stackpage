# StackPage Monorepo 🚀

Welcome to the StackPage monorepo! This project contains the source code for the StackPage platform, a no-code website builder.

## 📂 Structure

- `apps/web`: The **Editor & Dashboard**. Where users login, create sites, and edit content.
- `apps/template`: The **Site Viewer**. The engine that renders user websites dynamically.
- `packages/ui`: Shared UI components (internal design system).
- `packages/blocks`: Shared Block components (the building blocks of sites).
- `packages/config`: Shared configuration (ESLint, Tailwind, etc).

## 🛠️ Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database/Auth:** Supabase
- **Monorepo Tool:** Turborepo

## 🚀 Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root (or in each app folder) with your Supabase keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    - Editor: `http://localhost:3000`
    - Viewer: `http://localhost:3001`

## 📦 Deployment Guide (Vercel)

You need to deploy TWO projects to Vercel from this single repository.

### 1. Deploy the Editor (`apps/web`)

This is where users will login and manage their sites.

- **Vercel Project Name:** `getstackpage` (example)
- **Framework Preset:** Next.js
- **Root Directory:** `apps/web`
- **Environment Variables:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Domain:** `getstackpage.vercel.app` (or your custom domain)

### 2. Deploy the User Sites (`apps/template`)

This is the engine that displays user websites.

- **Vercel Project Name:** `stackpage-sites` (example)
- **Framework Preset:** Next.js
- **Root Directory:** `apps/template`
- **Environment Variables:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Domain:** `yourstackpage.vercel.app` (or whatever you desire)

### How User Sites Work

When a user creates a site with the slug `my-blog`, their site will be instantly available at:
`https://yourstackpage.vercel.app/my-blog`

You do **NOT** need to create a new repo or deployment for each user. The `apps/template` application uses Dynamic Routing (`app/[slug]/page.tsx`) to fetch the correct content from Supabase based on the URL.

## 🤝 Contributing

1.  Pick a task from `task.md` (if available).
2.  Create a branch.
3.  Make changes and push.
