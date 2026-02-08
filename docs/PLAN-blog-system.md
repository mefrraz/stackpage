# PLAN-blog-system

Based on your request, this plan outlines how to transform StackPage into a multi-page blog system with publishing capabilities.

## Phase 1: Database Schema Migration

We need to update Supabase to support multiple pages and site configuration.

- **Tasks:**
    1.  **Run SQL Migration:**
        -   Alter `sites` table: Add `config` (JSONB) for global styles/settings.
        -   Create `pages` table (renaming/replacing `posts`):
            -   `id` (uuid, pk)
            -   `site_id` (fk to sites)
            -   `slug` (text, unique per site)
            -   `title` (text)
            -   `description` (text, for SEO)
            -   `type` (enum: 'page', 'post')
            -   `status` (enum: 'draft', 'published')
            -   `content_blocks` (jsonb)
            -   `published_at` (timestamp)
            -   `created_at` (timestamp)

## Phase 2: Editor - Page Management UI

The Editor needs to manage multiple documents, not just one.

-   **Tasks:**
    1.  **Sidebar Update:**
        -   Add a "Pages" tab in the left sidebar.
        -   List all pages belonging to the site.
        -   Group by Type (Pages vs Posts).
    2.  **Add Page Flow:**
        -   Button "Nova Página" / "Novo Post".
        -   Modal to set Title and Slug.
        -   Redirect to editor for that new page.
    3.  **Editor Context:**
        -   Update `EditorPage` to fetch the specific page/post based on selection.
        -   Update `savePost` to `savePage`.

## Phase 3: Editor - Publishing Flow

Publishing should be explicit.

-   **Tasks:**
    1.  **Status Toggle:**
        -   Visual indicator (Draft/Published) in the header.
    2.  **Publish Action:**
        -   Button "Publicar" updates `status = 'published'` and `published_at = now()`.
        -   Add "Unpublish" option.

## Phase 4: Template (Viewer) - Blog Catalog

The viewer needs to intelligently route between specific pages and the blog catalog.

-   **Tasks:**
    1.  **Routing Logic (`apps/template/app/[slug]/page.tsx`):**
        -   If `slug` matches a specific page: Render that page.
        -   If `slug` matches `home` (or root):
            -   If a page with slug `home` exists: Render it.
            -   Else: Render **Blog Catalog**.
    2.  **Blog Catalog Component:**
        -   Fetch all `pages` where `site_id = current_site` AND `type = 'post'` AND `status = 'published'`.
        -   Display grid of posts (Title, Description, Date, Link).
    3.  **Navigation:**
        -   Ensure links in the header point to valid pages.

## Verification Checklist

-   [ ] Database has `pages` table with `status` column.
-   [ ] Editor can create a new Post.
-   [ ] Editor can switch between Home and New Post.
-   [ ] Clicking "Save" saves content without publishing.
-   [ ] Clicking "Publish" makes it visible.
-   [ ] Viewer shows the Blog Catalog if no Home page is defined.
-   [ ] Viewer renders the specific post content when clicked.

---

**Ready to start Phase 1?** I will generate the SQL migration script for you.
