# Plan: UI/UX Polish & Feature Expansion

## 🤖 Orchestration Context
*   **Goal:** Elevate the quality of generated sites (design, features) and the dashboard (usability).
*   **Agents:** `frontend-specialist`, `backend-specialist`.

## 📋 Task Breakdown

### 1. Dashboard Improvements (Priority: High)
*   **Fix URL Display:** Update the "Preview" card to show `yourstackpage.vercel.app` instead of `.stackpage.app`.
*   **Delete Site Functionality:**
    *   [Backend] Add `deleteSite` function in `lib/sites.ts` (RPC or direct DB delete).
    *   [Frontend] Add "Delete" button to the site card (with confirmation dialog).
*   **UI Polish:** Improve the "My Sites" grid design.

### 2. Template (Generated Site) Fixes (Priority: High)
*   **Dark Mode Toggle:**
    *   Fix misalignment in `apps/template/app/[siteSlug]/layout.tsx`.
    *   Ensure functionality works (it seemed "buggy").
*   **Post Search:**
    *   Review `PostGrid` search logic (client-side vs server-side).
    *   Ensure it filters correctly in the "Viewer" mode.

### 3. Template Design Overhaul (Priority: Medium)
*   **"Prettier" Design:**
    *   Enhance `globals.css` with better typography scaling and spacing.
    *   Add subtle animations (fade-in) to blocks.
*   **New Sections (Blocks):**
    *   Create **Features Block** (Icon + Title + Text grid).
    *   Create **CTA Block** (Centered call to action).
    *   *Note: User asked for "more sections" in the generated site, which implies more block types.*

## 👤 Agent Assignments

### 🎨 Frontend Specialist
*   **File:** `apps/web/app/dashboard/page.tsx` (URL Fix, Delete UI)
*   **File:** `apps/template/app/[siteSlug]/layout.tsx` (Dark Mode Fix)
*   **File:** `packages/blocks/src/...` (New Blocks, Animations)

### ⚙️ Backend Specialist
*   **File:** `apps/web/lib/sites.ts` (Delete Logic)
*   **File:** `apps/template/lib/posts.ts` (Search Logic Review)
