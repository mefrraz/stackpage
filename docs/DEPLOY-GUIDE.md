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

## 4. Pós-Deploy (Configurar Domínio Real)

Agora que o teu site está online em `https://getstackpage.vercel.app` (ou semelhante), precisas de avisar o Supabase.

> **Nota:** Não precisas de mudar nada no Google ou GitHub! As configurações lá apontam para o Supabase, que não muda.

1. Vai ao **Supabase Dashboard > Auth > URL Configuration**.
2. Em **Site URL**, muda de `http://localhost:3000` para `https://getstackpage.vercel.app`.
3. Em **Redirect URLs**, adiciona:
   - `https://getstackpage.vercel.app/**`
   - (Mantém o `http://localhost:3000/**` se quiseres continuar a testar no teu PC).
4. Guarda.

Isto garante que quando fazes login com Google, ele volta para o site certo e não para o localhost.


## 5. Teste Final
Acede ao link da Vercel e tenta fazer Login. Se funcionar, Parabéns! O teu SaaS está no ar. 🚀
