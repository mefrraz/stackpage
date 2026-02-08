# StackPage Monorepo 🚀

Welcome to **StackPage**, a powerful multi-tenant blog platform and website builder. This monorepo contains everything needed to run your own SaaS-like platform where users can create, edit, and publish blogs instantly.

## 🌟 Features

*   **Multi-tenant Architecture:** Single codebase (`apps/template`) serves thousands of sites.
*   **Modern Editor:** Block-based editor (Notion-style) with drag-and-drop capabilities.
*   **Theme Support:** Built-in Light and Dark modes for all generated sites.
*   **SEO Friendly:** Server-side rendering with Next.js App Router for optimal performance.
*   **Instant Publishing:** Changes in the editor reflect immediately on the live site.

## 📂 Structure

- `apps/web`: The **Dashboard & Editor**. User management, site creation, and content editing.
- `apps/template`: The **Site Engine**. Renders user websites dynamically based on the URL slug.
- `packages/ui`: Shared design system components (buttons, inputs, cards).
- `packages/blocks`: Shared content blocks (Hero, Text, Grid) used by both apps.
- `packages/config`: Shared configuration (ESLint, Tailwind, TypeScript).

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (with `tailwindcss-animate`)
- **Database:** Supabase (PostgreSQL + Auth)
- **Monorepo:** Turborepo
- **Icons:** Lucide React

## 🚀 Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Copy `.env.example` to `.env` in `apps/web` and `apps/template`, or set them at the root:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    - **Dashboard:** `http://localhost:3000`
    - **Template:** `http://localhost:3001` (access via `localhost:3001/site-name`)

## 📦 Deployment Guide (Vercel)

You need to deploy TWO separate projects on Vercel from this repository.

### 1. The Dashboard (`apps/web`)
This is where users log in and manage their content.
- **Root Directory:** `apps/web`
- **Build Command:** `cd ../.. && npx turbo run build --filter=web...` (or standard Next.js preset)
- **Environment Variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Domain:** e.g., `app.yourstackpage.com`

### 2. The Site Engine (`apps/template`)
This renders the user's public websites.
- **Root Directory:** `apps/template`
- **Build Command:** `cd ../.. && npx turbo run build --filter=template...`
- **Environment Variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Domain:** e.g., `yourstackpage.vercel.app`

**Routing Logic:**
User sites are accessed via: `https://yourstackpage.vercel.app/[site-slug]`
Example: `https://yourstackpage.vercel.app/my-awesome-blog`

## 🤝 Application Flow
1. User logs into **Dashboard**.
2. Creates a new **Site** (e.g., "Tech Blog" -> slug: `tech-blog`).
3. Writes posts in the Editor.
4. Clicks "Publish".
5. The content is instantly live at `yourstackpage.vercel.app/tech-blog`.

---
*Built with ❤️ by StackPage Team*
