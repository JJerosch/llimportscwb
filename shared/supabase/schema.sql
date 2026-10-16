-- ==========================================================================
-- LL IMPORTS CWB — BANCO DE DADOS COMPLETO PARA O SUPABASE (POSTGRESQL)
-- 
-- INSTRUÇÕES DE INSTALAÇÃO:
-- 1. Acesse o painel do Supabase (https://supabase.com/dashboard)
-- 2. Abra o seu projeto e clique no menu "SQL Editor" na barra lateral
-- 3. Cole este script inteiro e clique no botão verde "Run" (Executar)
-- 4. O banco será criado com todas as tabelas, regras de segurança (RLS),
--    a nova mecânica de modelos e estoque de unidades com bateria/grau estético,
--    e todo o catálogo inicial já populado com dados reais da LL Imports CWB!
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
-- 4. MECÂNICA 1: MODELOS DE PRODUTOS (CATÁLOGO DA LOJA)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.product_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                                 -- Ex: "iPhone 15 Pro", "MacBook Air 13″ M3"
  category TEXT NOT NULL CHECK (
    category IN ('iphone', 'ipad', 'macbook', 'macmini', 'watch', 'acessorios')
  ),
  default_image_url TEXT,                             -- Imagem oficial de referência no AWS S3
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
-- 5. MECÂNICA 2: UNIDADES EM ESTOQUE (CONDIÇÃO, BATERIA & CICLOS REAIS)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.product_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.product_models(id) ON DELETE CASCADE,
  
  -- Condição
  condition TEXT NOT NULL CHECK (condition IN ('novo', 'seminovo')),
  
  -- Qualidade estética
  aesthetic_grade TEXT NOT NULL CHECK (
    aesthetic_grade IN ('novo_lacrado', 'excelente', 'muito_bom', 'bom_usado')
  ),
  -- novo_lacrado: Caixa lacrada de fábrica com 1 ano Apple
  -- excelente: Sem marcas de uso, como novo (Grade A+)
  -- muito_bom: Mínimos sinais imperceptíveis (Grade A)
  -- bom_usado: Sinais normais de uso (Grade B)

  -- Qualidade da bateria
  battery_health INTEGER CHECK (
    battery_health IS NULL OR (battery_health >= 50 AND battery_health <= 100)
  ), -- Ex: 81 para 81%
  
  battery_cycles INTEGER CHECK (
    battery_cycles IS NULL OR battery_cycles >= 0
  ), -- Ex: 31 para 31 ciclos

  -- Especificações da unidade
  storage TEXT NOT NULL,                              -- Ex: "128GB", "256GB", "16GB / 512GB"
  color TEXT NOT NULL,                                -- Ex: "Titânio Natural", "Meia-noite"
  
  -- Preço da unidade com trava anti-erro (entre R$ 50 e R$ 60.000)
  price NUMERIC CHECK (price IS NULL OR (price >= 50 AND price <= 60000)),
  
  status TEXT NOT NULL DEFAULT 'disponivel' CHECK (
    status IN ('disponivel', 'reservado', 'vendido')
  ),
  
  warranty TEXT NOT NULL DEFAULT 'Garantia da Loja',
  unit_photos TEXT[] DEFAULT '{}',                   -- Fotos reais no S3 dessa unidade
  notes TEXT,                                         -- Observações (ex: "Acompanha caixa e cabo")
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_units ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de unidades disponíveis" ON public.product_units;
CREATE POLICY "Leitura pública de unidades disponíveis" 
  ON public.product_units FOR SELECT 
  TO public 
  USING (status = 'disponivel' OR auth.uid() IN (SELECT user_id FROM public.admins));

DROP POLICY IF EXISTS "Apenas admins gerenciam unidades" ON public.product_units;
CREATE POLICY "Apenas admins gerenciam unidades" 
  ON public.product_units FOR ALL 
  TO authenticated 
  USING (auth.uid() IN (SELECT user_id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admins));

-- ==========================================================================
-- 6. VIEW INTELIGENTE DO CATÁLOGO (MODELO + MENOR PREÇO + QUANTIDADES)
-- ==========================================================================
CREATE OR REPLACE VIEW public.v_catalog_showcase AS
SELECT 
  m.id AS model_id,
  m.name AS model_name,
  m.category,
  m.default_image_url,
  m.position,
  MIN(u.price) AS starting_price,
  COUNT(u.id) FILTER (WHERE u.status = 'disponivel') AS total_units_available,
  COUNT(u.id) FILTER (WHERE u.status = 'disponivel' AND u.condition = 'novo') AS new_units_count,
  COUNT(u.id) FILTER (WHERE u.status = 'disponivel' AND u.condition = 'seminovo') AS used_units_count
FROM public.product_models m
LEFT JOIN public.product_units u ON u.model_id = m.id AND u.status = 'disponivel'
WHERE m.active = true
GROUP BY m.id;

-- ==========================================================================
-- 7. TABELA DE AVALIAÇÕES / DEPOIMENTOS DE CLIENTES
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
-- 8. SEED AUTOMÁTICO COMPLETO (DADOS REAIS COM AS 2 MECÂNICAS)
-- ==========================================================================

-- 8.1 Configurações da Loja
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

-- 8.2 Seções da Landing Page
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

-- 8.3 Avaliações Reais de Clientes (Google Reviews)
DELETE FROM public.reviews;
INSERT INTO public.reviews (name, badge, stars, text, position)
VALUES
  ('Isaias Garcez', 'Local Guide Google', 5, 'Muito bem atendido via Instagram, agendamento pra ver o aparelho foi bem rápido. iPhone 13 PRO em excelente estado com Garantia de 1 ano, atendimento na loja excelente, testam tudo mesmo na sua frente. Ainda ganhei uma incrível embalagem de presente feita por eles. Vou voltar e indicar com certeza.', 1),
  ('Rita Pacheco', 'Local Guide Google', 5, 'Fui até a loja por indicação de duas amigas e não me arrependi! Atendimento personalizado e encontramos o modelo de celular perfeito funcionando bem! Oferecem acessórios também! Recomendo!', 2),
  ('Lucas K.', 'Cliente Verificado', 5, 'Comprei um MacBook Air M4 e o atendimento superou qualquer loja oficial. Preço muito mais justo, peguei em mãos na sala no Cabral no mesmo dia. Nota 10!', 3);

-- 8.4 Modelos de Catálogo (Mecânica 1) e Unidades em Estoque (Mecânica 2)
DELETE FROM public.product_units;
DELETE FROM public.product_models;

-- Modelos
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

-- Unidades com Bateria, Ciclos e Condição Estética
INSERT INTO public.product_units (model_id, condition, aesthetic_grade, battery_health, battery_cycles, storage, color, price, status, warranty, notes)
VALUES
  -- iPhone 17 Pro Max (Novo)
  ('00000000-0000-0000-0000-000000000001', 'novo', 'novo_lacrado', 100, 0, '256GB', 'Laranja Cósmico', 7599.00, 'disponivel', '1 ano Apple', 'Novo lacrado de fábrica com nota fiscal'),
  ('00000000-0000-0000-0000-000000000001', 'novo', 'novo_lacrado', 100, 0, '512GB', 'Azul Profundo', 8399.00, 'disponivel', '1 ano Apple', 'Novo lacrado de fábrica'),

  -- iPhone 17 Pro (Novo)
  ('00000000-0000-0000-0000-000000000002', 'novo', 'novo_lacrado', 100, 0, '256GB', 'Prata', 7199.00, 'disponivel', '1 ano Apple', 'Novo lacrado'),

  -- iPhone 16 Pro Max (Seminovo Excelente)
  ('00000000-0000-0000-0000-000000000003', 'seminovo', 'excelente', 89, 142, '256GB', 'Titânio Natural', 5899.00, 'disponivel', 'Garantia da Loja', 'Impecável, sem detalhes, bateria original em 89% com 142 ciclos'),

  -- iPhone 15 Pro (Seminovo Muito Bom com 81% e 31 ciclos como solicitado)
  ('00000000-0000-0000-0000-000000000004', 'seminovo', 'muito_bom', 81, 31, '128GB', 'Titânio Preto', 4299.00, 'disponivel', 'Garantia da Loja', 'Aparelho revisado, mínimas marcas de uso, bateria com 81% e apenas 31 ciclos'),
  ('00000000-0000-0000-0000-000000000004', 'seminovo', 'excelente', 94, 98, '256GB', 'Titânio Azul', 4699.00, 'disponivel', 'Garantia da Loja', 'Estado impecável de conservação, bateria 94% com 98 ciclos'),

  -- iPhone 13 Pro (Seminovo Bom/Usado)
  ('00000000-0000-0000-0000-000000000005', 'seminovo', 'bom_usado', 85, 260, '128GB', 'Grafite', 2999.00, 'disponivel', 'Garantia da Loja', 'Aparelho 100% funcional com pequenas marcas de uso na borda'),

  -- MacBook Air 13″ M4 (Novo)
  ('00000000-0000-0000-0000-000000000006', 'novo', 'novo_lacrado', 100, 0, '16GB · 256GB', 'Meia-noite', 9999.00, 'disponivel', '1 ano Apple', 'Lacrado com teclado padrão Apple e 1 ano de garantia'),

  -- MacBook Pro 14″ M3 Pro (Seminovo Excelente com ciclos de bateria)
  ('00000000-0000-0000-0000-000000000007', 'seminovo', 'excelente', 98, 45, '18GB · 512GB', 'Preto Espacial', 12499.00, 'disponivel', 'Garantia da Loja', 'Bateria com 98% e apenas 45 ciclos. Acompanha carregador MagSafe original'),

  -- Apple Watch Ultra 2 (Novo)
  ('00000000-0000-0000-0000-000000000009', 'novo', 'novo_lacrado', 100, 0, '49 mm', 'Titânio Natural', 5499.00, 'disponivel', '1 ano Apple', 'Caixa lacrada');

-- ==========================================================================
-- 9. COMO VINCULAR SEU USUÁRIO COMO ADMINISTRADOR
-- ==========================================================================
-- Após criar um usuário no Supabase Auth:
-- INSERT INTO public.admins (user_id, email)
-- SELECT id, email FROM auth.users WHERE email = 'seu_email@exemplo.com'
-- ON CONFLICT (user_id) DO NOTHING;
