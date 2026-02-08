# Configuração de Login (GitHub & Google) no Supabase

Este guia explica passo-a-passo como obter as chaves (`Client ID` e `Client Secret`) para ativar o login social.

> **Importante:** Ambos os serviços são **gratuitos** para desenvolvimento e pequenas aplicações.

---

## 1. Login com GitHub (Mais Fácil)

### Passo 1: Criar a Aplicação no GitHub
1. Acede a **[GitHub Developer Settings](https://github.com/settings/applications/new)**.
2. Preenche os campos:
   - **Application Name:** `StackPage` (ou o nome do teu projeto).
   - **Homepage URL:** `http://localhost:3000` (enquanto estiveres a testar localmente).
   - **Authorization callback URL:**
     - Vai ao teu **[Supabase Dashboard](https://supabase.com/dashboard/project/_/auth/providers)**.
     - Copia o link que diz **"Callback URL (for OAuth)"**. Deve parecer-se com: `https://<tua-ref>.supabase.co/auth/v1/callback`.
     - Cola esse link no GitHub.
3. Clica em **Register application**.

### Passo 2: Copiar as Chaves e Colocar no Supabase
1. No GitHub, verás o **Client ID**. Copia-o.
2. Clica em **"Generate a new client secret"**. Copia o segredo assim que aparecer (só vês uma vez!).
3. Vai ao **[Supabase Dashboard > Auth > Providers](https://supabase.com/dashboard/project/_/auth/providers)**.
4. Seleciona **GitHub** e ativa-o ("Enable").
5. Cola o `Client ID` e o `Client Secret`.
6. Clica em **Save**.

---

## 2. Login com Google (Um pouco mais complexo)

### Passo 1: Criar Projeto na Google Cloud
1. Acede à **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Cria um novo projeto (ex: `StackPage`).

### Passo 2: Configurar Ecrã de Consentimento (OAuth Consent Screen)
1. No menu lateral, vai a **APIs & Services > OAuth consent screen**.
2. Escolhe **External** (Externo) e clica em **Create**.
3. Preenche:
   - **App name:** `StackPage`.
   - **User support email:** O teu email.
   - **Developer contact information:** O teu email.
   - Clica em **Save and Continue** (podes deixar o resto em branco por agora).

### Passo 3: Obter as Chaves (Credentials)
1. No menu lateral, vai a **Credentials**.
2. Clica em **+ CREATE CREDENTIALS** > **OAuth client ID**.
3. **Application type:** Escolhe **Web application**.
4. **Name:** `StackPage Web`.
5. **Authorized JavaScript origins:**
   - Adiciona: `http://localhost:3000`
   - Adiciona: `https://<tua-ref>.supabase.co` (o URL base do teu Supabase, sem `/auth/...`).
6. **Authorized redirect URIs:**
   - Adiciona o **Callback URL** do Supabase (o mesmo que usaste no GitHub): `https://<tua-ref>.supabase.co/auth/v1/callback`.
7. Clica em **Create**.

### Passo 4: Colocar no Supabase
1. Copia o **Client ID** e o **Client Secret** que a Google te mostrou.
2. Vai ao **[Supabase Dashboard > Auth > Providers](https://supabase.com/dashboard/project/_/auth/providers)**.
3. Seleciona **Google** e ativa-o.
4. Cola as chaves.
5. Clica em **Save**.

---

## 3. Testar
1. Reinicia o servidor local (`npm run dev`) se estiver a correr.
2. Tenta fazer login com os botões GitHub ou Google em `http://localhost:3000/login`.
