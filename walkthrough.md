# Guia de Teste Manual - StackPage

> **Status:** ✅ Autenticação Ativa | ✅ Base de Dados Real

## 1. Login e Acesso
1. Aceda a [http://localhost:3000/dashboard](http://localhost:3000/dashboard).
2. Se não estiver autenticado, será redirecionado para `/login`.
3. Insira o seu email e clique em **"Enviar Magic Link"**.
4. Verifique o seu email (ou logs do Supabase) e clique no link de login.
   - **Nota:** Se estiver a usar o Supabase Local (não é o caso agora, estamos na Cloud), o link apareceria no terminal. Como estamos na Cloud, vai mesmo para o email.

## 2. Criar um Site (Real)
**Condição:** Ter executado o SQL de criação de tabelas.
1. No Dashboard, clique em **"+ Novo Site"**.
2. Preencha:
   - Nome: "Meu Blog Teste"
   - Subdomínio: "meu-teste"
3. Clique em "Criar Site".
   - **Sucesso:** Redireciona para o Dashboard com o novo site listado.
   - **Erro 42501?** Significa que o SQL de permissões (RLS) não foi rodado ou o utilizador não está logado.

## 3. Editor Visual (Real)
1. No Dashboard, clique em **"Editar"** no cartão do site criado.
2. No Editor:
   - Clique em "Hero Section" na barra lateral para adicionar o bloco.
   - Veja o bloco aparecer na área principal.
3. Clique em **"Publicar Alterações"**.
   - Deverá ver o alerta "Guardado com sucesso!".
   - Os dados são salvos na tabela `posts` do Supabase.

## 4. Verificar Persistência
1. Recarregue a página (F5) do Editor.
2. Os blocos que adicionou devem reaparecer automaticamente.
   - Isto confirma que estão a ser lidos da base de dados e não da memória local.

## 5. Próximos Passos (Fase 5 - Deploy)
- O fluxo local está validado.
- Para colocar online, configurar o projeto na Vercel e adicionar as Variáveis de Ambiente lá.
