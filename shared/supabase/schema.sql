-- ==========================================================================
-- LL IMPORTS CWB — BANCO DE DADOS SUPABASE (POSTGRESQL)
-- MODELO BASEADO EM TAGS DE QUALIDADES (SEM CONTROLE DE ESTOQUE INDIVIDUAL)
-- 
-- INSTRUÇÕES DE INSTALAÇÃO:
-- 1. Acesse o painel do Supabase (https://supabase.com/dashboard)
-- 2. Abra o seu projeto e clique no menu "SQL Editor" na barra lateral
-- 3. Cole este script inteiro e clique no botão verde "Run" (Executar)
-- 4. O banco será criado com todas as tabelas, regras de segurança (RLS),
--    a tabela de modelos, tabelas de qualidades do aparelho e de bateria,
--    a tabela relacional com tags de disponibilidade, e dados iniciais!
-- ==========================================================================

-- Extensão para geração de UUIDs (ativa por padrão no Supabase)
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
-- 4. TABELA DE MODELOS DE APARELHO
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.product_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                                 -- Ex: "iPhone 15 Pro", "MacBook Air 13″ M4"
  category TEXT NOT NULL CHECK (
    category IN ('iphone', 'ipad', 'macbook', 'macmini', 'watch', 'acessorios')
  ),
  default_image_url TEXT,                             -- Imagem de referência no AWS S3
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,               -- Exibir ou ocultar da vitrine
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_models ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de modelos ativos" ON public.product_models;
CREATE POLICY "Leitura pública de modelos ativos" 
  ON public.product_models FOR SELECT 
  TO public 
  USING (active = true OR auth.uid() IN (SELECT user_id FROM public.admins));

DROP POLICY IF EXISTS "Apenas admins gerenciam modelos" ON public.product_models;
CREATE POLICY "Apenas admins gerenciam modelos" 
  ON public.product_models FOR ALL 
  TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admins));

-- ==========================================================================
-- 5. TABELA DE QUALIDADES DO APARELHO (CONDIÇÃO ESTÉTICA)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.device_qualities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,                         -- 'novo_lacrado', 'excelente', 'muito_bom', 'usado'
  name TEXT NOT NULL,                                 -- 'Novo Lacrado', 'Excelente (Grade A+)', 'Muito Bom (Grade A)', 'Usado (Grade B)'
  badge_label TEXT NOT NULL,                          -- 'Lacrado', 'Grade A+', 'Grade A', 'Grade B'
  description TEXT,                                   -- Descrição para orientar o cliente
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.device_qualities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de qualidades de aparelho" ON public.device_qualities;
CREATE POLICY "Leitura pública de qualidades de aparelho" 
  ON public.device_qualities FOR SELECT 
  TO public 
  USING (true);

DROP POLICY IF EXISTS "Apenas admins gerenciam qualidades de aparelho" ON public.device_qualities;
CREATE POLICY "Apenas admins gerenciam qualidades de aparelho" 
  ON public.device_qualities FOR ALL 
  TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admins));

-- ==========================================================================
-- 6. TABELA DE QUALIDADES DA BATERIA
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.battery_qualities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,                         -- 'bat_100', 'bat_90_99', 'bat_81_31c', 'bat_80_89'
  name TEXT NOT NULL,                                 -- '100% (Zero Ciclos)', '81% · 31 ciclos', '90% a 99%'
  health_percentage INTEGER CHECK (
    health_percentage IS NULL OR (health_percentage >= 50 AND health_percentage <= 100)
  ),
  cycles_count INTEGER CHECK (
    cycles_count IS NULL OR cycles_count >= 0
  ),
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.battery_qualities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de qualidades de bateria" ON public.battery_qualities;
CREATE POLICY "Leitura pública de qualidades de bateria" 
  ON public.battery_qualities FOR SELECT 
  TO public 
  USING (true);

DROP POLICY IF EXISTS "Apenas admins gerenciam qualidades de bateria" ON public.battery_qualities;
CREATE POLICY "Apenas admins gerenciam qualidades de bateria" 
  ON public.battery_qualities FOR ALL 
  TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admins));

-- ==========================================================================
-- 7. TABELA RELACIONAL: MODELO X QUALIDADES DISPONÍVEIS (TAGS DE DISPONIBILIDADE)
-- Guarda quais modelos possuem quais qualidades e tags disponíveis, SEM controle de estoque numérico
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.product_qualities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.product_models(id) ON DELETE CASCADE,
  device_quality_id UUID NOT NULL REFERENCES public.device_qualities(id) ON DELETE CASCADE,
  battery_quality_id UUID REFERENCES public.battery_qualities(id) ON DELETE SET NULL, -- Opcional (MacBooks ou novos não exigem tag de bateria)
  
  -- Especificações da Tag
  storage TEXT NOT NULL,                              -- Ex: "128GB", "256GB", "16GB · 512GB"
  color TEXT NOT NULL,                                -- Ex: "Titânio Natural", "Meia-noite"
  price NUMERIC CHECK (price IS NULL OR (price >= 50 AND price <= 60000)),
  
  -- Flag de Disponibilidade: "Tem ainda" = true, "Esgotado no momento" = false
  is_available BOOLEAN NOT NULL DEFAULT true,
  warranty TEXT NOT NULL DEFAULT 'Garantia da Loja',
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_qualities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de qualidades disponíveis" ON public.product_qualities;
CREATE POLICY "Leitura pública de qualidades disponíveis" 
  ON public.product_qualities FOR SELECT 
  TO public 
  USING (is_available = true OR auth.uid() IN (SELECT user_id FROM public.admins));

DROP POLICY IF EXISTS "Apenas admins gerenciam relacional de qualidades" ON public.product_qualities;
CREATE POLICY "Apenas admins gerenciam relacional de qualidades" 
  ON public.product_qualities FOR ALL 
  TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admins));

-- ==========================================================================
-- 8. VIEWS AUXILIARES PARA O FRONTEND
-- ==========================================================================

-- 8.1 View de Resumo da Vitrine (Menor Preço e Total de Tags Disponíveis)
CREATE OR REPLACE VIEW public.v_catalog_showcase AS
SELECT 
  m.id AS model_id,
  m.name AS model_name,
  m.category,
  m.default_image_url,
  m.position,
  MIN(pq.price) AS starting_price,
  COUNT(pq.id) FILTER (WHERE pq.is_available = true) AS available_tags_count
FROM public.product_models m
LEFT JOIN public.product_qualities pq ON pq.model_id = m.id AND pq.is_available = true
WHERE m.active = true
GROUP BY m.id;

-- 8.2 View com o JOIN Completo das Tags (Modelo + Qualidade do Aparelho + Qualidade da Bateria)
CREATE OR REPLACE VIEW public.v_product_available_tags AS
SELECT 
  pq.id AS tag_id,
  pq.model_id,
  m.name AS model_name,
  m.category,
  pq.storage,
  pq.color,
  pq.price,
  pq.is_available,
  pq.warranty,
  dq.id AS device_quality_id,
  dq.slug AS device_quality_slug,
  dq.name AS device_quality_name,
  dq.badge_label AS device_quality_badge,
  bq.id AS battery_quality_id,
  bq.slug AS battery_quality_slug,
  bq.name AS battery_quality_name,
  bq.health_percentage AS battery_health,
  bq.cycles_count AS battery_cycles
FROM public.product_qualities pq
JOIN public.product_models m ON m.id = pq.model_id
JOIN public.device_qualities dq ON dq.id = pq.device_quality_id
LEFT JOIN public.battery_qualities bq ON bq.id = pq.battery_quality_id
WHERE pq.is_available = true AND m.active = true
ORDER BY pq.price ASC NULLS LAST;

-- ==========================================================================
-- 9. TABELA DE AVALIAÇÕES / DEPOIMENTOS DE CLIENTES
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
-- 10. SEED AUTOMÁTICO COMPLETO (POPULAÇÃO COM DADOS REAIS DA LL IMPORTS)
-- ==========================================================================

-- 10.1 Configurações da Loja
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

-- 10.2 Seções da Landing Page
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

-- 10.3 Avaliações Reais de Clientes (Google Reviews)
DELETE FROM public.reviews;
INSERT INTO public.reviews (name, badge, stars, text, position)
VALUES
  ('Isaias Garcez', 'Local Guide Google', 5, 'Muito bem atendido via Instagram, agendamento pra ver o aparelho foi bem rápido. iPhone 13 PRO em excelente estado com Garantia de 1 ano, atendimento na loja excelente, testam tudo mesmo na sua frente. Ainda ganhei uma incrível embalagem de presente feita por eles. Vou voltar e indicar com certeza.', 1),
  ('Rita Pacheco', 'Local Guide Google', 5, 'Fui até a loja por indicação de duas amigas e não me arrependi! Atendimento personalizado e encontramos o modelo de celular perfeito funcionando bem! Oferecem acessórios também! Recomendo!', 2),
  ('Lucas K.', 'Cliente Verificado', 5, 'Comprei um MacBook Air M4 e o atendimento superou qualquer loja oficial. Preço muito mais justo, peguei em mãos na sala no Cabral no mesmo dia. Nota 10!', 3);

-- 10.4 Limpeza e População das Tabelas de Modelos e Qualidades
DELETE FROM public.product_qualities;
DELETE FROM public.battery_qualities;
DELETE FROM public.device_qualities;
DELETE FROM public.product_models;

-- TABELA: QUALIDADES DO APARELHO (CONDIÇÃO ESTÉTICA)
INSERT INTO public.device_qualities (id, slug, name, badge_label, description, position)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'novo_lacrado', 'Novo Lacrado', 'Lacrado', 'Aparelho na caixa lacrada de fábrica com 1 ano de garantia Apple', 1),
  ('11111111-0000-0000-0000-000000000002', 'excelente', 'Excelente (Grade A+)', 'Grade A+', 'Estado impecável como novo, sem marcas ou riscos perceptíveis', 2),
  ('11111111-0000-0000-0000-000000000003', 'muito_bom', 'Muito Bom (Grade A)', 'Grade A', 'Aparelho em excelente estado estético com sinais mínimos quase imperceptíveis', 3),
  ('11111111-0000-0000-0000-000000000004', 'usado', 'Usado (Grade B)', 'Grade B', 'Sinais normais de uso na carcaça, 100% testado e funcional com garantia', 4);

-- TABELA: QUALIDADES DA BATERIA
INSERT INTO public.battery_qualities (id, slug, name, health_percentage, cycles_count, description, position)
VALUES
  ('22222222-0000-0000-0000-000000000001', 'bat_100', '100% (Zero Ciclos)', 100, 0, 'Bateria 100% original e sem ciclos', 1),
  ('22222222-0000-0000-0000-000000000002', 'bat_94_98c', '94% · 98 ciclos', 94, 98, 'Saúde em 94% com apenas 98 ciclos', 2),
  ('22222222-0000-0000-0000-000000000003', 'bat_89_142c', '89% · 142 ciclos', 89, 142, 'Saúde em 89% com 142 ciclos originais', 3),
  ('22222222-0000-0000-0000-000000000004', 'bat_81_31c', '81% · 31 ciclos', 81, 31, 'Saúde em 81% com apenas 31 ciclos', 4),
  ('22222222-0000-0000-0000-000000000005', 'bat_85_260c', '85% · 260 ciclos', 85, 260, 'Saúde em 85% com 260 ciclos', 5),
  ('22222222-0000-0000-0000-000000000006', 'bat_98_45c', '98% · 45 ciclos', 98, 45, 'MacBook com 98% e apenas 45 ciclos', 6);

-- TABELA: MODELOS DE APARELHO
INSERT INTO public.product_models (id, name, category, default_image_url, active, position)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'iPhone 17 Pro Max', 'iphone', NULL, true, 1),
  ('00000000-0000-0000-0000-000000000002', 'iPhone 17 Pro', 'iphone', NULL, true, 2),
  ('00000000-0000-0000-0000-000000000003', 'iPhone 16 Pro Max', 'iphone', NULL, true, 3),
  ('00000000-0000-0000-0000-000000000004', 'iPhone 15 Pro', 'iphone', NULL, true, 4),
  ('00000000-0000-0000-0000-000000000005', 'iPhone 13 Pro', 'iphone', NULL, true, 5),
  ('00000000-0000-0000-0000-000000000006', 'MacBook Air 13″ M4', 'macbook', NULL, true, 6),
  ('00000000-0000-0000-0000-000000000007', 'MacBook Pro 14″ M3 Pro', 'macbook', NULL, true, 7),
  ('00000000-0000-0000-0000-000000000008', 'iPad Pro M4', 'ipad', NULL, true, 8),
  ('00000000-0000-0000-0000-000000000009', 'Apple Watch Ultra 2', 'watch', NULL, true, 9);

-- TABELA RELACIONAL: MODELO X QUALIDADES DISPONÍVEIS (TAGS DE DISPONIBILIDADE)
-- Associa cada modelo às qualidades que estão disponíveis para ele no momento (SEM controle de estoque)
INSERT INTO public.product_qualities (model_id, device_quality_id, battery_quality_id, storage, color, price, is_available, warranty, notes)
VALUES
  -- iPhone 17 Pro Max (Novo Lacrado - 100% Bateria)
  ('00000000-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '256GB', 'Laranja Cósmico', 7599.00, true, '1 ano Apple', 'Novo lacrado com NF-e'),
  ('00000000-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '512GB', 'Azul Profundo', 8399.00, true, '1 ano Apple', 'Novo lacrado'),

  -- iPhone 17 Pro (Novo Lacrado)
  ('00000000-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '256GB', 'Prata', 7199.00, true, '1 ano Apple', 'Novo lacrado'),

  -- iPhone 16 Pro Max (Seminovo Excelente - 89% Bateria)
  ('00000000-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000003', '256GB', 'Titânio Natural', 5899.00, true, 'Garantia da Loja', 'Aparelho Grade A+ impecável'),

  -- iPhone 15 Pro (MUITO BOM COM 81% E 31 CICLOS + EXCELENTE COM 94%)
  ('00000000-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000004', '128GB', 'Titânio Preto', 4299.00, true, 'Garantia da Loja', 'Muito Bom com bateria 81% e 31 ciclos'),
  ('00000000-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', '256GB', 'Titânio Azul', 4699.00, true, 'Garantia da Loja', 'Excelente Grade A+ com bateria 94%'),

  -- iPhone 13 Pro (Usado Grade B - 85% Bateria)
  ('00000000-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000005', '128GB', 'Grafite', 2999.00, true, 'Garantia da Loja', 'Usado 100% revisado com garantia'),

  -- MacBook Air 13″ M4 (Novo Lacrado)
  ('00000000-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '16GB · 256GB', 'Meia-noite', 9999.00, true, '1 ano Apple', 'Caixa lacrada'),

  -- MacBook Pro 14″ M3 Pro (Seminovo Excelente - 98% Bateria e 45 ciclos)
  ('00000000-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000006', '18GB · 512GB', 'Preto Espacial', 12499.00, true, 'Garantia da Loja', 'Bateria 98% e 45 ciclos com MagSafe'),

  -- Apple Watch Ultra 2 (Novo Lacrado)
  ('00000000-0000-0000-0000-000000000009', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '49 mm', 'Titânio Natural', 5499.00, true, '1 ano Apple', 'Lacrado');
