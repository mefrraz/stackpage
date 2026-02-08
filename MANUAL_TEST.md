# Manual Test Guide: Blog System 🧪

Since I cannot access your production environment's authentication, please follow these steps to verify the system manually.

## 1. Setup
- Open [Dashboard](https://getstackpage.vercel.app/dashboard)
- Ensure you are logged in.

## 2. Create Site
1. Click **"Novo Site"**.
2. Name: `Blog Teste`
3. Subdomain: `blog-teste-[teu-nome]`
4. Click **"Criar"**.
   - *Expected:* Redirects to Editor.

## 3. Create Post (New Feature)
1. In the sidebar, look for the **"Estrutura"** section.
2. Click **"Post"** button.
3. Title: `O Meu Primeiro Post`
4. Click **"OK"**.
   - *Expected:* "O Meu Primeiro Post" appears in the list and is selected. Editor canvas is empty.

## 4. Add Content
1. Click **"Hero"** in the "Adicionar" sidebar.
2. Click on the Hero block in the canvas to select it.
3. In "Propriedades" (right sidebar), change Title to `Olá Mundo!`.
4. Click **"Guardar"**.
   - *Expected:* Alert "Guardado com sucesso!".

## 5. Publish
1. Look at the header status. It should say "Rascunho" (Yellow).
2. Click **"Publicar"**.
   - *Expected:* Status changes to "Publicado" (Green). Alert "Publicado com sucesso!".

## 6. Verify Viewer
1. Click the **Eye Icon** (👁️) in the header.
2. A new tab should open at `yourstackpage.vercel.app/blog-teste-[teu-nome]/o-meu-primeiro-post`.
   - *Expected:* You see the "Olá Mundo!" hero section.

## 7. Verify Blog Catalog
1. Go to the root of your site: `yourstackpage.vercel.app/blog-teste-[teu-nome]`.
   - *Expected:* Since you haven't created a "home" page yet, you should see the **Blog Catalog** with "O Meu Primeiro Post" listed there.
