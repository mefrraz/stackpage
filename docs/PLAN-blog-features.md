# Plan: Blog Features & Advanced Layout

## Context
The user wants to enhance the blog creation experience by enforcing specific default layouts for "Home" and "Post" pages, introducing new block types (Spacer, Post Grid), and adding advanced spacing controls to all blocks.

## Goals
1.  **New Block Types:** Implement `Spacer`, `PostGrid` (with search), and `TextBlock`.
2.  **Advanced Styling:** Allow custom top/bottom padding for *every* block.
3.  **Default Layouts:** Automatically populate new pages with specific block structures.
    *   **Home:** Spacer -> Hero -> Post Grid.
    *   **Post:** Post Hero -> Text Block.

## Phase 1: Block System Architecture
- [ ] **Update `Block` Interface (@stackpage/blocks)**
    - Add `style?: { paddingTop?: string; paddingBottom?: string; }` to the base interface.
- [ ] **Create New Components**
    - `SpacerBlock`: Renders a div with adjustable height.
    - `PostGridBlock`: Fetches and renders posts in 3 cols (PC) / 1 col (Mobile) + Search Bar.
    - `TextBlock`: Simple text rendering (pre-WYSIWYG).
- [ ] **Refactor Existing Components**
    - `HeroBlock`: Ensure it supports the new "Post Hero" variant (title + optional description).

## Phase 2: Editor Implementation (apps/web)
- [ ] **Properties Sidebar**
    - Add an "Advanced" accordion/section to *all* blocks.
    - Inputs for "Spacing Top" and "Spacing Bottom" (e.g., select: None, Small, Medium, Large, or raw px).
- [ ] **Block Specific Inputs**
    - **Spacer:** Input for height.
    - **Post Hero:** Title, Description (optional).
    - **Post Grid:** (No specific props yet, maybe "Posts per page"?).
- [ ] **Add Block Sidebar**
    - Enable buttons for Spacer, Text, and Post Grid.

## Phase 3: Template Implementation (apps/template)
- [ ] **Update `BlockRenderer`**
    - Apply the `style` props (padding) to the wrapper of each block.
- [ ] **Implement Components**
    - `Spacer`: Visual implementation.
    - `PostGrid`: Logic to fetch posts (client-side or server-component) and filter by search term.
    - `Text`: Render text content.

## Phase 4: Default Content Logic
- [ ] **Update `createPage` (lib/pages.ts)**
    - MODIFY logic to check `type` ('page' or 'post').
    - **If 'page' (Home implied):** Insert [Spacer, Hero, PostGrid] blocks automatically.
    - **If 'post':** Insert [Hero (Post variant), Text] blocks automatically.

## Phase 5: Verification
- [ ] **Test Manual Flow**
    - Create new site -> Check Home default blocks.
    - Create new post -> Check Post default blocks.
    - Edit Spacing -> Verify visual change in Editor & Preview.
