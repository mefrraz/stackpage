# Guia de Deploy na Vercel (Monorepo)

Este guia explica como colocar o **Dashboard** online.

## 1. Preparação
Certifica-te que o código está todo no GitHub (o nosso agente já fez push, mas confirma se tens o commit mais recente).

## 2. Criar Projeto na Vercel
1. Acede a [vercel.com](https://vercel.com) e faz login.
2. Clica em **"Add New..."** > **"Project"**.
3. Seleciona o repositório **Import Git Repository**.
   - Escolhe o repositório `stackpage`.

## 3. Configurar o Monorepo (IMPORTANTE)
A Vercel vai perguntar qual a pasta do projeto. Como é um monorepo, temos duas apps.

1. **Root Directory:**
   - Clica em **Edit**.
   - Seleciona a pasta: `apps/web` (Este é o Dashboard).
   - Clica **Continue**.

2. **Framework Preset:**
   - Deve detetar automaticamente **Next.js**.

3. **Environment Variables (Variáveis de Ambiente):**
   - Expande a secção **Environment Variables**.
   - Adiciona as mesmas chaves que tens no `.env` local:
     - `NEXT_PUBLIC_SUPABASE_URL`: (A tua URL do Supabase)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (A tua chave Anon)

4. **Deploy:**
   - Clica em **Deploy**.

## 4. Pós-Deploy (Supabase)
Depois do site estar online (ex: `https://stackpage-dashboard.vercel.app`), precisas de autorizar este domínio no Supabase.

1. Copia o URL do teu novo site.
2. Vai ao **Supabase Dashboard > Auth > URL Configuration**.
3. Em **Redirect URLs**, clica em **Add URL**.
4. Cola o URL do teu site (ex: `https://stackpage-dashboard.vercel.app/**` - nota os asteriscos no fim para aceitar sub-rotas).
5. Guarda.

## 5. Teste Final
Acede ao link da Vercel e tenta fazer Login. Se funcionar, Parabéns! O teu SaaS está no ar. 🚀
