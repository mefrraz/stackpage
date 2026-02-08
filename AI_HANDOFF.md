# 🤖 AI Project Handoff: StackPage

## 📌 Project Overview
**StackPage** is a SaaS platform that allows users to create and publish websites/blogs instantly. It is a **Monorepo** managed with Turborepo.

### 🏢 Architecture
The project consists of two main Next.js 15 applications:

1.  **`apps/web` (Dashboard & Editor)**
    *   **Url:** `app.yourstackpage.com` (or localhost:3000)
    *   **Purpose:** Users login, create sites, manage pages/posts, and use the Block Editor.
    *   **Key Path:** `apps/web/app/dashboard/editor/[id]/page.tsx` (The main editor logic).
    *   **Auth:** Supabase Auth (Google, Email/Password).

2.  **`apps/template` (Site Engine)**
    *   **Url:** `yourstackpage.vercel.app` (or localhost:3001)
    *   **Purpose:** Dynamically renders user sites. **Single codebase serves ALL sites.**
    *   **Key Path:** `apps/template/app/[siteSlug]/layout.tsx` (Handles site-specific theming and nav).
    *   **Routing:** Uses dynamic routes `[siteSlug]` to fetch site config from Supabase.

3.  **Packages (`packages/`)**
    *   `ui`: Shared Shadcn/UI components.
    *   `blocks`: **Core Business Logic.** Contains the React components for user content (Hero, Text, Grid, etc.).
    *   `config`: Shared Tailwind/Typescript configs.

## 🛠 Tech Stack
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Database:** Supabase (Table `sites`, `pages`, `posts`?)
*   **Styling:** Tailwind CSS v4 (native CSS variables, no `tailwind.config.js` needed in apps).
*   **State:** React Server Components (fetching) + Client Components (interactive).

## ✅ Current Status (Completed)
*   [x] **Multi-tenancy:** Sites are generated via `apps/template` using `subdomain` lookup.
*   [x] **Editor:** Drag-and-drop block editor working.
*   [x] **Blog System:** Posts vs Pages separation. `BlogCatalog` component implemented.
*   [x] **Theming:** working Dark/Light mode toggle (using `next-themes` and `.dark` class).
*   [x] **Dashboard:** Create/Delete sites implemented.

## 🚧 Next Steps (For the next AI)
1.  **Custom Domains:** Implement middleware to rewrite `custom.com` -> `yourstackpage.vercel.app/slug`.
2.  **More Blocks:** The current `packages/blocks` only has Hero, Text, Spacer, PostGrid. Needs **Image**, **Video**, **Embed**.
3.  **Rich Text:** The "Text" block is currently a simple generic component. Needs a real RTE (TipTap or similar) for bold/italic/links inside the text block.
4.  **SEO:** Dynamic `generateMetadata` in `apps/template` needs to be fleshed out with OpenGraph images.
5.  **Tests:** Currently minimal. Needs E2E tests for the creation flow.

## 🚀 Key Commands
*   `npm run dev`: Starts both apps.
*   `npx turbo run build`: Builds everything.
*   `git push`: Deploys (if connected to Vercel).

## ⚠️ Important Context
*   **URL Structure:** We use path-based routing for simplicity: `yourstackpage.vercel.app/site-slug`.
*   **Home Page:** Every site MUST have a page with `slug: 'home'`. This is enforced in backend logic `createSite`.
*   **Styles:** `globals.css` in `template` uses standard Tailwind v4 `@theme`.

**Good luck!** 🚀
