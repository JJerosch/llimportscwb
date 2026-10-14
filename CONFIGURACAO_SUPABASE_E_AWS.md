# Guia de Configuração: Supabase & AWS S3
## LL Imports CWB

Este documento resume como colocar o banco de dados e as imagens em produção.

---

### 1. Banco de Dados no Supabase

O arquivo com o script SQL completo e pronto para execução está em:
👉 [`shared/supabase/schema.sql`](file:///c:/LLImports/shared/supabase/schema.sql)

#### Passo a passo para rodar no Supabase:
1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e crie um novo projeto (ex: `llimports-cwb`).
2. No menu lateral do projeto, clique no ícone **SQL Editor**.
3. Clique em **New Query** (Nova Consulta).
4. Abra o arquivo [`shared/supabase/schema.sql`](file:///c:/LLImports/shared/supabase/schema.sql), copie todo o conteúdo e cole no SQL Editor do Supabase.
5. Clique no botão verde **Run** (Executar).
6. **Pronto!** O banco será criado com:
   - Tabela `admins` com segurança RLS (apenas admins alteram dados).
   - Tabela `products` com catálogo inicial completo (modelos, capacidades, cores, garantia).
   - Trava contra preços absurdos (`CHECK price BETWEEN 50 AND 60000`).
   - Tabela `sections` com controle de visibilidade da landing page.
   - Tabela `reviews` com os depoimentos reais de clientes de Curitiba.
   - Tabela `site_settings` com dados da loja (Cabral, WhatsApp, CNPJ).

#### Como criar seu login de Administrador:
1. No menu lateral do Supabase, vá em **Authentication** -> **Users**.
2. Clique em **Add user** -> **Create user** e cadastre seu e-mail e senha.
3. Volte ao **SQL Editor** e rode este comando (substituindo pelo seu e-mail cadastrado):
```sql
INSERT INTO public.admins (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'seu_email@exemplo.com';
```

---

### 2. Hospedagem de Imagens na AWS S3

O guia detalhado com permissões de leitura pública e CORS está em:
👉 [`shared/aws/guia_aws_s3.md`](file:///c:/LLImports/shared/aws/guia_aws_s3.md)

#### Resumo rápido:
1. Crie um bucket no S3 (ex: `llimports-assets-cwb`).
2. Desmarque a opção "Block all public access" (para que as fotos dos aparelhos sejam visíveis na web).
3. Na aba **Permissions**, adicione a **Bucket Policy** com permissão `s3:GetObject` pública para a pasta de imagens.
4. Faça o upload das fotos dos modelos na pasta `produtos/` (ex: `iphone-17-pro-max.webp`).
5. A URL pública da imagem será:
   `https://llimports-assets-cwb.s3.sa-east-1.amazonaws.com/produtos/iphone-17-pro-max.webp`
6. Cole essa URL no campo **"URL da Imagem (AWS S3)"** no painel de administração da landing page ou direto no banco do Supabase!

---

### 3. Conectar a Landing Page ao Supabase

Basta preencher o arquivo `.env` na raiz das pastas `react/` e `vue/`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica-do-supabase
```
*(Você encontra essas duas chaves em Supabase -> Project Settings -> API)*
