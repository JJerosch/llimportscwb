# LL Imports CWB — Landing Page & Catálogo Dinâmico

Landing page premium e catálogo inteligente para a **LL Imports CWB** (loja especializada em produtos Apple novos e seminovos em Curitiba/PR).

O projeto foi desenvolvido com foco em alta conversão, estética cinematográfica inspirada no [motionsites.ai](https://motionsites.ai/), design monocromático fiel à identidade visual da loja e um painel administrativo para gerenciamento de modelos e seções.

---

## 🚀 Tecnologias e Arquitetura

O projeto foi construído em **duas versões front-end equivalentes** para comparação de performance e preferências de stack, compartilhando o mesmo design system, dados e backend:

```
c:\LLImports\
├── react/                  # Aplicação React 19 + Vite + Lucide React + Supabase JS
├── vue/                    # Aplicação Vue 3 + Vite + Lucide Vue + Supabase JS
├── shared/                 # Código, estilos e recursos compartilhados
│   ├── assets/brand/       # Logos e ícones oficiais
│   ├── styles/             # Design tokens (tokens.css), base (base.css) e componentes (landing.css)
│   ├── data/seed.json      # Dados iniciais e catálogo mockado
│   ├── lib/                # Utilitários (formatadores, travas de preços, helpers)
│   ├── supabase/schema.sql # Banco de dados Postgres, Row Level Security (RLS) e Seed
│   └── aws/guia_aws_s3.md  # Instruções para hospedagem de fotos no Amazon S3 / CloudFront
└── CONFIGURACAO_SUPABASE_E_AWS.md # Guia consolidado de setup
```

---

## ✨ Funcionalidades Principais

1. **Design Cinemático Monocromático**:
   - Paleta escura com reflexos em prata, titânio e grafite.
   - Hero dinâmico com revelação de palavras e rotacionador animado de termos (*iPhone*, *MacBook*, *iPad*, *Apple Watch*).
   - Mockups de alta fidelidade que substituem imagens quebradas e dão aspecto de keynote da Apple.

2. **Catálogo por Modelo (Novos & Seminovos)**:
   - Filtros instantâneos por categoria e por condição (*Novo Lacrado* vs. *Seminovo Selecionado*).
   - Preços oficiais calibrados com proteção no banco e formulário contra valores anômalos (`CHECK (price IS NULL OR price BETWEEN 50 AND 60000)`).
   - Botão direto para WhatsApp com mensagem e modelo já pré-configurados.
   - Suporte a imagens reais hospedadas na **AWS S3** ou exibição automática de mockups de fallback.

3. **Prova Social e Autoridade Real (@llimportscwb)**:
   - Métricas reais do Instagram: 4 anos de mercado, +2.000 clientes atendidos e 12,2 mil seguidores.
   - Avaliações reais com 5 estrelas do Google Reviews (clientes de Curitiba).
   - Localização no Cabral (Rua Anita Garibaldi, 850, Sala 401, Torre C) com aviso de atendimento com hora marcada.

4. **Painel do Administrador (Admin Drawer)**:
   - Acesso restrito a administradores via Supabase Auth (com RLS) ou simulação local.
   - Cadastro de novos modelos com validação de faixa de preço e URL de foto no S3.
   - Edição de preços inline e remoção de modelos.
   - Controle de visibilidade das seções da landing page em tempo real.

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
- Node.js (v18+)
- npm ou pnpm

### 1. Versão React
```bash
cd react
npm install
npm run dev
```
Acesse: `http://localhost:5173/`

### 2. Versão Vue 3
```bash
cd vue
npm install
npm run dev
```
Acesse: `http://localhost:5174/`

---

## 🗄️ Backend Supabase & AWS S3

- Para configurar o banco de dados no Supabase, execute o script [`shared/supabase/schema.sql`](shared/supabase/schema.sql) no SQL Editor do seu projeto Supabase.
- Para configurar o bucket de fotos no Amazon S3 com CORS e política pública de leitura, siga o guia [`shared/aws/guia_aws_s3.md`](shared/aws/guia_aws_s3.md).
- O resumo completo com exemplos de `.env` está em [`CONFIGURACAO_SUPABASE_E_AWS.md`](CONFIGURACAO_SUPABASE_E_AWS.md).

---

## 📄 Licença

Projeto desenvolvido para uso exclusivo da **LL Imports CWB**.
CNPJ: `51.128.849/0001-86`.
