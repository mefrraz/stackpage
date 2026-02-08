# Plan: Blog Routing & Architecture Refactor

## 🎯 Goal
Refactor `apps/template` routing to support clean, path-based URLs (`/site`, `/site/posts`, `/site/post/slug`) and implement a consistent Theme Toggle.

## 🏗️ Architecture

### 1. URL Structure (Next.js Routing)
We will move away from `?p=slug` query parameters to proper nested dynamic routes.

*   Current: `apps/template/app/[slug]/page.tsx`
*   New Structure:
    *   `apps/template/app/[siteSlug]/page.tsx` -> **Home** (Landing)
    *   `apps/template/app/[siteSlug]/posts/page.tsx` -> **Catalog** (All Posts)
    *   `apps/template/app/[siteSlug]/post/[postSlug]/page.tsx` -> **Single Post**
    *   `apps/template/app/[siteSlug]/[pageSlug]/page.tsx` -> **Generic Pages** (About, Contact)

### 2. Layout & Theme
*   **Root Layout (`[siteSlug]/layout.tsx`)**:
    *   Will handle Site Lookup (metadata).
    *   Will inject the **Theme Toggle** and **Common Navigation** (Home, Blog).
    *   Wraps all sub-pages.

## 📋 Task Breakdown

### Phase 1: Routing Refactor <!-- id: 1 -->
- [ ] Rename `app/[slug]` to `app/[siteSlug]` (conceptually) <!-- id: 2 -->
- [ ] Create `app/[siteSlug]/layout.tsx` for site context & theme <!-- id: 3 -->
- [ ] Implement `app/[siteSlug]/page.tsx` (Home Logic) <!-- id: 4 -->
- [ ] Implement `app/[siteSlug]/posts/page.tsx` (Catalog Logic) <!-- id: 5 -->
- [ ] Implement `app/[siteSlug]/post/[postSlug]/page.tsx` (Post Logic) <!-- id: 6 -->
- [ ] Implement `app/[siteSlug]/[pageSlug]/page.tsx` (Generic Page Logic) <!-- id: 7 -->

### Phase 2: Editor Updates <!-- id: 8 -->
- [ ] Update "Eye" (Preview) button to generate new clean URLs <!-- id: 9 -->
- [ ] Ensure "Home" page creation matches the new root route <!-- id: 10 -->

### Phase 3: Verification <!-- id: 11 -->
- [ ] Verify `check-db.ts` against new structure <!-- id: 12 -->
- [ ] Test 404 handling for invalid sites/pages <!-- id: 13 -->

## 👤 Agent Assignments
- **Project Planner**: Architecture definition (This file).
- **Frontend Specialist**: Next.js routing, Layout implementation, Theme Toggle.
- **Backend Specialist**: Database queries for specific slugs.
