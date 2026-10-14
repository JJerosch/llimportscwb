-- ==========================================================================
-- LL IMPORTS CWB — BANCO DE DADOS COMPLETO PARA O SUPABASE (POSTGRESQL)
-- 
-- INSTRUÇÕES DE INSTALAÇÃO:
-- 1. Acesse o painel do Supabase (https://supabase.com/dashboard)
-- 2. Abra o seu projeto e clique no menu "SQL Editor" na barra lateral
-- 3. Cole este script inteiro e clique no botão verde "Run" (Executar)
-- 4. O banco será criado com todas as tabelas, regras de segurança (RLS)
--    e todo o catálogo inicial já populado com dados reais da LL Imports CWB!
-- ==========================================================================

-- Extensão para geração de UUIDs (geralmente ativa por padrão no Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================================
-- 1. TABELA DE ADMINISTRADORES
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins podem visualizar administradores" ON public.admins;
CREATE POLICY "Admins podem visualizar administradores" 
  ON public.admins FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- ==========================================================================
-- 2. TABELA DE CONFIGURAÇÕES DO SITE (CONTATOS, HORÁRIOS, ENDEREÇO)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de configurações" ON public.site_settings;
CREATE POLICY "Leitura pública de configurações" 
  ON public.site_settings FOR SELECT 
  TO public 
  USING (true);

DROP POLICY IF EXISTS "Apenas admins alteram configurações" ON public.site_settings;
CREATE POLICY "Apenas admins alteram configurações" 
  ON public.site_settings FOR ALL 
  TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admins));

-- ==========================================================================
-- 3. TABELA DE SEÇÕES DA LANDING PAGE
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  visible BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de seções" ON public.sections;
CREATE POLICY "Leitura pública de seções" 
  ON public.sections FOR SELECT 
  TO public 
  USING (visible = true OR auth.uid() IN (SELECT user_id FROM public.admins));

DROP POLICY IF EXISTS "Apenas admins alteram seções" ON public.sections;
CREATE POLICY "Apenas admins alteram seções" 
  ON public.sections FOR ALL 
  TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admins));

-- ==========================================================================
-- 4. TABELA DE PRODUTOS / MODELOS (COM SUPORTE A IMAGENS NA AWS S3)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('iphone', 'ipad', 'macbook', 'macmini', 'watch', 'acessorios')),
  condition TEXT NOT NULL CHECK (condition IN ('novo', 'seminovo')),
  -- PROTEÇÃO CONTRA PREÇOS ABSURDOS:
  -- NULL = "Consulte no WhatsApp". Se numérico, entre R$ 50 e R$ 60.000.
  price NUMERIC CHECK (price IS NULL OR (price >= 50 AND price <= 60000)),
  storage TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  badge TEXT,
  warranty TEXT NOT NULL DEFAULT '1 ano Apple',
  -- Link da imagem hospedada na AWS S3 ou CloudFront (ex: https://meu-bucket.s3.amazonaws.com/ip17promax.png)
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de produtos ativos" ON public.products;
CREATE POLICY "Leitura pública de produtos ativos" 
  ON public.products FOR SELECT 
  TO public 
  USING (active = true OR auth.uid() IN (SELECT user_id FROM public.admins));

DROP POLICY IF EXISTS "Apenas admins gerenciam produtos" ON public.products;
CREATE POLICY "Apenas admins gerenciam produtos" 
  ON public.products FOR ALL 
  TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admins));

-- ==========================================================================
-- 5. TABELA DE AVALIAÇÕES / DEPOIMENTOS DE CLIENTES
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  badge TEXT NOT NULL DEFAULT 'Local Guide Google',
  stars INTEGER NOT NULL DEFAULT 5 CHECK (stars BETWEEN 1 AND 5),
  text TEXT NOT NULL,
  avatar_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de reviews" ON public.reviews;
CREATE POLICY "Leitura pública de reviews" 
  ON public.reviews FOR SELECT 
  TO public 
  USING (true);

DROP POLICY IF EXISTS "Apenas admins gerenciam reviews" ON public.reviews;
CREATE POLICY "Apenas admins gerenciam reviews" 
  ON public.reviews FOR ALL 
  TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admins));

-- ==========================================================================
-- 6. DADOS INICIAIS (SEED AUTOMÁTICO COMPLETO)
-- ==========================================================================

-- 6.1 Configurações da Loja
INSERT INTO public.site_settings (key, value)
VALUES 
  ('general', '{
    "name": "LL Imports CWB",
    "tagline": "iPhone, iPad, MacBook e Apple Watch em Curitiba",
    "whatsapp": "554132275066",
    "whatsappDisplay": "(41) 3227-5066",
    "email": "llimportscwb@gmail.com",
    "instagram": "llimportscwb",
    "followers": "12,2 mil",
    "yearsInMarket": "4 anos",
    "clientsServed": "+2.000 clientes",
    "googleRating": 4.9,
    "cnpj": "51.128.849/0001-86",
    "address": {
      "street": "Rua Anita Garibaldi, 850",
      "complement": "Sala 401 · Torre C",
      "district": "Cabral",
      "city": "Curitiba",
      "state": "PR"
    },
    "hours": "Segunda a Sexta: 09h às 19h · Sábado: 09h às 14h (Atendimento com hora marcada)"
  }'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 6.2 Seções da Landing Page
INSERT INTO public.sections (key, title, subtitle, content, visible, position)
VALUES
  ('hero', 'O Apple dos seus sonhos', 'com a exclusividade que você merece.', '{
    "badge": "Linha iPhone 17 disponível no showroom",
    "titleBefore": "O",
    "rotatingWords": ["iPhone", "MacBook", "iPad", "Apple Watch"],
    "titleAfter": "dos seus sonhos,",
    "titleMuted": "com a exclusividade que você merece.",
    "subtitle": "Lançamentos Apple, novos e seminovos, com atendimento personalizado, segurança e as melhores condições de Curitiba.",
    "primaryCta": {
      "label": "Falar com especialista",
      "message": "Olá! Vim pelo site da LL Imports e gostaria de falar com um especialista."
    },
    "secondaryCta": {
      "label": "Agendar visita",
      "message": "Olá! Gostaria de agendar um horário exclusivo no showroom da LL Imports."
    },
    "stageChip": "Entrega em mãos no showroom"
  }'::jsonb, true, 1),

  ('marquee', 'Diferenciais', '', '{
    "items": [
      "Produtos 100% originais",
      "Nota fiscal (NF-e)",
      "Lacrados e seminovos selecionados",
      "Showroom exclusivo no Cabral",
      "4,9 estrelas no Google",
      "12,2 mil seguidores no Instagram",
      "Mais de 2.000 clientes atendidos",
      "Pós-venda de verdade"
    ]
  }'::jsonb, true, 2),

  ('flagship', 'iPhone 17 Pro Max.', 'Titânio aeroespacial e o sistema de câmeras mais avançado já criado pela Apple.', '{
    "tag": "Edição de Destaque",
    "title": "iPhone 17 Pro Max.",
    "subtitle": "Titânio aeroespacial e o sistema de câmeras mais avançado já criado pela Apple. Pronto para retirada em mãos em Curitiba.",
    "specs": [
      { "val": "Tela 6.9″", "label": "Super Retina XDR com ProMotion e até 3000 nits" },
      { "val": "48 MP Fusion", "label": "Sistema Pro com zoom óptico de 8x (200mm)" },
      { "val": "Chip A18 Pro", "label": "GPU de 6 núcleos e suporte a Ray Tracing acelerado" },
      { "val": "4.823 mAh", "label": "Bateria de longa duração com recarga ultrarrápida" }
    ],
    "cta": "Consultar Disponibilidade do 17 Pro Max"
  }'::jsonb, true, 3),

  ('experience', 'Por que a LL Imports é a escolha número 1 em Curitiba', 'Uma experiência de showroom pensada para quem valoriza tempo, discrição e segurança absoluta.', '{
    "tag": "Autoridade & Confiança",
    "title": "Por que a LL Imports é a escolha número 1 em Curitiba",
    "subtitle": "Uma experiência de showroom pensada para quem valoriza tempo, discrição e segurança absoluta.",
    "metrics": [
      { "num": "4+", "label": "Anos de mercado em Curitiba" },
      { "num": "+2.000", "label": "Clientes atendidos e satisfeitos" },
      { "num": "4.9 ★", "label": "Avaliação média no Google Reviews" },
      { "num": "100%", "label": "Originais com garantia oficial" }
    ],
    "pillars": [
      {
        "icon": "shield",
        "title": "Atendimento com Hora Marcada",
        "desc": "Agende seu horário exclusivo na Torre C do Cabral. Espaço reservado, consultor dedicado e total privacidade."
      },
      {
        "icon": "lock",
        "title": "Segurança e Pagamento na Entrega",
        "desc": "Conferência minuciosa na sua frente: consulte número de série, estado do lacre e pague somente ao receber o aparelho."
      },
      {
        "icon": "check",
        "title": "Garantia Real e Transparência",
        "desc": "Aparelhos lacrados com 1 ano oficial Apple. Seminovos criteriosamente revisados com bateria íntegra e garantia da loja."
      }
    ]
  }'::jsonb, true, 4),

  ('faq', 'Tudo o que você precisa saber', '', '{
    "tag": "Dúvidas Frequentes",
    "title": "Tudo o que você precisa saber",
    "items": [
      {
        "q": "Os aparelhos são originais e têm garantia Apple?",
        "a": "Sim. Todos os produtos lacrados têm garantia mundial oficial de 1 ano pela Apple, aceita em qualquer assistência autorizada. Os seminovos possuem garantia direta com a LL Imports."
      },
      {
        "q": "Como funciona o atendimento presencial no Cabral?",
        "a": "Nosso showroom fica no Edifício Anita Garibaldi, Torre C, Sala 401. Para oferecer segurança e privacidade total, atendemos com agendamento prévio no WhatsApp."
      },
      {
        "q": "Posso dar o meu iPhone usado na troca (Trade-in)?",
        "a": "Sim! Avaliamos o seu aparelho usado no ato e abatemos o valor diretamente no novo modelo. O saldo restante pode ser pago via Pix ou parcelado no cartão."
      },
      {
        "q": "Quais as formas de pagamento aceitas?",
        "a": "Aceitamos pagamento via Pix com desconto exclusivo à vista ou cartão de crédito em até 18x com as melhores taxas de Curitiba."
      }
    ]
  }'::jsonb, true, 5)
ON CONFLICT (key) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  content = EXCLUDED.content,
  visible = EXCLUDED.visible,
  position = EXCLUDED.position;

-- 6.3 Avaliações Reais de Clientes (Google Reviews)
DELETE FROM public.reviews;
INSERT INTO public.reviews (name, badge, stars, text, position)
VALUES
  ('Isaias Garcez', 'Local Guide Google', 5, 'Muito bem atendido via Instagram, agendamento pra ver o aparelho foi bem rápido. iPhone 13 PRO em excelente estado com Garantia de 1 ano, atendimento na loja excelente, testam tudo mesmo na sua frente. Ainda ganhei uma incrível embalagem de presente feita por eles. Vou voltar e indicar com certeza.', 1),
  ('Rita Pacheco', 'Local Guide Google', 5, 'Fui até a loja por indicação de duas amigas e não me arrependi! Atendimento personalizado e encontramos o modelo de celular perfeito funcionando bem! Oferecem acessórios também! Recomendo!', 2),
  ('Lucas K.', 'Cliente Verificado', 5, 'Comprei um MacBook Air M4 e o atendimento superou qualquer loja oficial. Preço muito mais justo, peguei em mãos na sala no Cabral no mesmo dia. Nota 10!', 3);

-- 6.4 Modelos de Produtos (Catálogo Inicial - Novos & Seminovos com Preços Calibrados)
DELETE FROM public.products;
INSERT INTO public.products (name, category, condition, price, storage, colors, badge, warranty, featured, active, position)
VALUES
  ('iPhone 17 Pro Max', 'iphone', 'novo', 7599.00, ARRAY['256GB', '512GB', '1TB', '2TB'], ARRAY['Laranja Cósmico', 'Azul Profundo', 'Prata'], 'Lançamento', '1 ano Apple', true, true, 1),
  ('iPhone 17 Pro', 'iphone', 'novo', 7199.00, ARRAY['256GB', '512GB', '1TB'], ARRAY['Laranja Cósmico', 'Azul Profundo', 'Prata'], 'Lançamento', '1 ano Apple', false, true, 2),
  ('iPhone Air', 'iphone', 'novo', 5799.00, ARRAY['256GB', '512GB', '1TB'], ARRAY['Preto Espacial', 'Branco Nuvem', 'Dourado Claro', 'Azul Céu'], 'Lacrado', '1 ano Apple', false, true, 3),
  ('iPhone 17', 'iphone', 'novo', 5599.00, ARRAY['256GB', '512GB'], ARRAY['Preto', 'Branco', 'Lavanda', 'Sálvia', 'Azul Névoa'], 'Lacrado', '1 ano Apple', false, true, 4),
  ('iPhone 16 Pro Max', 'iphone', 'seminovo', NULL, ARRAY['256GB', '512GB'], ARRAY['Titânio Natural', 'Titânio Deserto', 'Titânio Preto'], 'Seminovo Selecionado', 'Garantia da loja', false, true, 5),
  ('iPhone 15 Pro', 'iphone', 'seminovo', NULL, ARRAY['128GB', '256GB'], ARRAY['Titânio Natural', 'Titânio Azul'], 'Seminovo Selecionado', 'Garantia da loja', false, true, 6),
  ('iPhone 13 Pro', 'iphone', 'seminovo', NULL, ARRAY['128GB', '256GB'], ARRAY['Grafite', 'Azul-Sierra'], 'Seminovo Selecionado', 'Garantia da loja', false, true, 7),
  
  ('iPad Pro M4', 'ipad', 'novo', NULL, ARRAY['256GB', '512GB', '1TB'], ARRAY['Preto Espacial', 'Prateado'], 'Lacrado', '1 ano Apple', false, true, 8),
  ('iPad Air M2', 'ipad', 'novo', NULL, ARRAY['128GB', '256GB'], ARRAY['Cinza Espacial', 'Azul', 'Estelar'], 'Lacrado', '1 ano Apple', false, true, 9),
  ('iPad 10ª Geração', 'ipad', 'novo', NULL, ARRAY['64GB', '256GB'], ARRAY['Prateado', 'Azul', 'Rosa', 'Amarelo'], 'Lacrado', '1 ano Apple', false, true, 10),

  ('MacBook Air 13″ M4', 'macbook', 'novo', 9999.00, ARRAY['16GB · 256GB', '16GB · 512GB'], ARRAY['Meia-noite', 'Estelar', 'Azul-céu', 'Prateado'], 'Promoção', '1 ano Apple', false, true, 11),
  ('MacBook Air 15″ M4', 'macbook', 'novo', NULL, ARRAY['16GB · 256GB', '16GB · 512GB'], ARRAY['Meia-noite', 'Estelar', 'Prateado'], 'Lacrado', '1 ano Apple', false, true, 12),
  ('MacBook Pro 14″ M4 Pro', 'macbook', 'novo', NULL, ARRAY['24GB · 512GB', '48GB · 1TB'], ARRAY['Preto Espacial', 'Prateado'], 'Lacrado', '1 ano Apple', false, true, 13),

  ('Mac mini M4', 'macmini', 'novo', NULL, ARRAY['16GB · 256GB', '16GB · 512GB'], ARRAY['Prateado'], 'Lacrado', '1 ano Apple', false, true, 14),

  ('Apple Watch Ultra 2', 'watch', 'novo', NULL, ARRAY['49 mm'], ARRAY['Titânio Natural', 'Titânio Preto'], 'Lacrado', '1 ano Apple', false, true, 15),
  ('Apple Watch Series 10', 'watch', 'novo', NULL, ARRAY['42 mm', '46 mm'], ARRAY['Preto Brilhante', 'Prateado', 'Ouro Rosa'], 'Lacrado', '1 ano Apple', false, true, 16),
  ('Apple Watch SE', 'watch', 'novo', NULL, ARRAY['40 mm', '44 mm'], ARRAY['Meia-noite', 'Estelar', 'Prateado'], 'Lacrado', '1 ano Apple', false, true, 17),

  ('AirPods Pro 2', 'acessorios', 'novo', NULL, ARRAY[]::TEXT[], ARRAY['Branco'], 'Lacrado', '1 ano Apple', false, true, 18),
  ('AirPods 4', 'acessorios', 'novo', NULL, ARRAY[]::TEXT[], ARRAY['Branco'], 'Lacrado', '1 ano Apple', false, true, 19),
  ('Carregador Apple 20W USB-C', 'acessorios', 'novo', 199.00, ARRAY[]::TEXT[], ARRAY['Branco'], 'Original', '1 ano Apple', false, true, 20);

-- ==========================================================================
-- 7. COMO CADASTRAR O SEU USUÁRIO COMO ADMINISTRADOR
-- ==========================================================================
-- Após criar uma conta no Supabase Auth com seu e-mail:
-- Basta rodar este comando substituindo 'SEU_EMAIL_AQUI' pelo seu e-mail:
-- 
-- INSERT INTO public.admins (user_id, email)
-- SELECT id, email FROM auth.users WHERE email = 'seu_email@exemplo.com'
-- ON CONFLICT (user_id) DO NOTHING;
