export const WHATSAPP_NUMBER = '554132275066'
export const INSTAGRAM_URL = 'https://instagram.com/llimportscwb'
export const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=Rua+Anita+Garibaldi+850+Cabral+Curitiba'
export const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps/search/?api=1&query=LL+Imports+Curitiba'

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export type ProductKind = 'iphone' | 'mac' | 'ipad' | 'watch' | 'acessorios'

// Os rótulos são os nomes das seções da landing; o href aponta para o id da seção.
export const navLinks = [
  { label: 'Categorias', href: '/#categorias' },
  { label: 'Produtos', href: '/#lancamentos' },
  { label: 'Experiência', href: '/#por-que' },
  { label: 'Avaliações', href: '/#avaliacoes' },
  { label: 'Clube', href: '/#clube' },
  { label: 'A loja', href: '/#loja' },
  { label: 'Catálogo', href: '/catalogo' },
]

/** Ficha do produto em destaque de cada categoria (cores, opções e especificações principais). */
export type FeaturedSpecs = {
  colors: { name: string; hex: string }[]
  options: { label: string; values: string[] }
  details: { label: string; value: string }[]
}

export const categories: {
  kind: ProductKind
  label: string
  description: string
  productId: number
  specs: FeaturedSpecs
}[] = [
  {
    kind: 'iphone',
    label: 'iPhone',
    description: 'Do iPhone 11 ao 17 Pro Max, lacrados e com nota fiscal.',
    productId: 3372,
    specs: {
      colors: [
        { name: 'Laranja-cósmico', hex: '#e2783a' },
        { name: 'Azul-intenso', hex: '#323e55' },
        { name: 'Prateado', hex: '#e3e3e1' },
      ],
      options: { label: 'Armazenamento', values: ['256 GB', '512 GB', '1 TB', '2 TB'] },
      details: [
        { label: 'Tela', value: '6,9″ ProMotion 120 Hz' },
        { label: 'Chip', value: 'A19 Pro' },
        { label: 'Câmeras', value: '3 de 48 MP, zoom óptico 8x' },
        { label: 'Frontal', value: '18 MP Center Stage' },
      ],
    },
  },
  {
    kind: 'mac',
    label: 'Mac',
    description: 'MacBook Air, MacBook Pro e Mac mini com chips da linha M.',
    productId: 2735,
    specs: {
      colors: [{ name: 'Prateado', hex: '#d9d9db' }],
      options: { label: 'Armazenamento', values: ['256 GB', '512 GB', '1 TB'] },
      details: [
        { label: 'Chip', value: 'M4, CPU e GPU de 10 núcleos' },
        { label: 'Memória', value: '16 GB unificada' },
        { label: 'Portas', value: '3 Thunderbolt 4, HDMI, 2 USB-C' },
        { label: 'Telas', value: 'Até 3 monitores externos' },
      ],
    },
  },
  {
    kind: 'ipad',
    label: 'iPad',
    description: 'Para estudar, desenhar e trabalhar de qualquer lugar.',
    productId: 2682,
    specs: {
      colors: [
        { name: 'Preto-espacial', hex: '#3b3b3d' },
        { name: 'Prateado', hex: '#e3e4e5' },
      ],
      options: { label: 'Armazenamento', values: ['256 GB', '512 GB', '1 TB', '2 TB'] },
      details: [
        { label: 'Tela', value: '11″ Ultra Retina XDR (OLED)' },
        { label: 'Chip', value: 'M5' },
        { label: 'Câmera', value: '12 MP traseira + frontal 12 MP' },
        { label: 'Compatível', value: 'Apple Pencil Pro' },
      ],
    },
  },
  {
    kind: 'watch',
    label: 'Apple Watch',
    description: 'Treino, saúde e notificações direto no pulso.',
    productId: 2716,
    specs: {
      colors: [
        { name: 'Titânio natural', hex: '#c9c2b6' },
        { name: 'Titânio preto', hex: '#2e2d2c' },
      ],
      options: { label: 'Tamanho', values: ['49 mm'] },
      details: [
        { label: 'Tela', value: 'OLED grande-angular, 3000 nits' },
        { label: 'Bateria', value: 'Até 42 h (72 h econ.)' },
        { label: 'Conexão', value: 'GPS + celular 5G e satélite' },
        { label: 'Resistência', value: 'Água até 100 m' },
      ],
    },
  },
  {
    kind: 'acessorios',
    label: 'Acessórios',
    description: 'Capinhas, carregadores, AirPods e o que mais faltar.',
    productId: 2739,
    specs: {
      colors: [{ name: 'Branco', hex: '#f5f5f3' }],
      options: { label: 'Versões', values: ['AirPods 4', 'Com cancelamento de ruído'] },
      details: [
        { label: 'Chip', value: 'H2' },
        { label: 'Áudio', value: 'Espacial personalizado' },
        { label: 'Bateria', value: 'Até 30 h com o estojo' },
        { label: 'Estojo', value: 'USB-C, resistente a poeira e água' },
      ],
    },
  },
]

// Cards de "Produtos disponíveis" da landing: o productId liga cada um ao produto do catálogo (foto e nome completo).
export const launches: { productId: number; name: string; kind: ProductKind; chips: string[] }[] = [
  { productId: 3372, name: 'iPhone 17 Pro Max', kind: 'iphone', chips: ['Tela de 6,9″', '3 câmeras de 48 MP'] },
  { productId: 629, name: 'iPhone 17 Pro', kind: 'iphone', chips: ['Tela de 6,3″', '3 câmeras de 48 MP'] },
  { productId: 325, name: 'iPhone 17', kind: 'iphone', chips: ['Tela de 6,3″', 'ProMotion'] },
  { productId: 106, name: 'iPhone Air', kind: 'iphone', chips: ['Tela de 6,5″', '5,6 mm de espessura'] },
  { productId: 2735, name: 'Mac mini', kind: 'mac', chips: ['Chip M4', '16 GB + 256 GB'] },
  { productId: 2682, name: 'iPad Pro 11″', kind: 'ipad', chips: ['Chip M5', '256 GB'] },
  { productId: 2716, name: 'Apple Watch Ultra 3', kind: 'watch', chips: ['49 mm', 'Titânio'] },
  { productId: 2739, name: 'AirPods 4', kind: 'acessorios', chips: ['Chip H2', 'USB-C'] },
]

// Textos clonados de llimportscwb.com.br ("Sua experiência Apple, elevada a um novo nível").
export const whyItems = [
  {
    icon: 'message',
    title: 'Atendimento Exclusivo',
    text: 'Um consultor dedicado a você, do início ao fim. Sua compra, suas regras, nosso cuidado.',
  },
  { icon: 'lock', title: 'Segurança Total', text: 'Entregas em mãos, em nosso showroom. Sua tranquilidade é nossa prioridade.' },
  { icon: 'calendar', title: 'Pós-venda de Verdade', text: 'Nosso relacionamento continua. Conte com nosso suporte para o que precisar após a compra.' },
  { icon: 'star', title: 'Confiança Garantida', text: 'Produtos 100% originais, lacrados e com garantia Apple. Compre com a certeza do melhor.' },
  { icon: 'pin', title: 'Agilidade e Novidade', text: 'Tenha os últimos lançamentos Apple antes de todo mundo. A novidade chega primeiro aqui.' },
] as const

export const reviews = [
  { text: 'Espaço para uma avaliação curta do Google.', author: 'Cliente do Google' },
  { text: 'Espaço para uma avaliação mais longa. O texto é puxado automaticamente do Google e corta depois de quatro linhas para manter o ritmo das colunas.', author: 'Cliente do Google' },
  { text: 'Espaço para uma avaliação do Google sobre o atendimento.', author: 'Cliente do Google' },
  { text: 'Espaço para uma avaliação média vinda do Google.', author: 'Cliente do Google' },
  { text: 'Espaço para uma avaliação curta do Google.', author: 'Cliente do Google' },
  { text: 'Espaço para uma avaliação do Google sobre a entrega.', author: 'Cliente do Google' },
]

export const faqs = [
  { question: 'Os produtos são originais?', answer: 'Sim. Todos são originais e lacrados, com nota fiscal e garantia Apple.' },
  { question: 'Como faço para saber o preço?', answer: 'Os valores mudam toda semana, então o preço do dia é passado no atendimento. Chame no WhatsApp e respondemos rápido.' },
  { question: 'Em quantas vezes posso parcelar?', answer: 'Parcelamos em até 18x no cartão. Também aceitamos Pix e outras formas de pagamento.' },
  { question: 'Preciso agendar para ir à loja?', answer: 'Atendemos com hora marcada, para dar atenção total a cada cliente. Agende pelo WhatsApp ou pelo Instagram.' },
  { question: 'Vocês fazem entrega?', answer: 'Sim. Fazemos entrega em mãos em Curitiba e região. Combine os detalhes no atendimento.' },
]

export const interests = ['iPhone', 'Mac', 'iPad', 'Apple Watch', 'Acessório']

/** Palavras que se alternam no título do hero ("O ___ dos seus sonhos…"). A primeira é a palavra inicial. */
export const heroWords = ['Apple', 'iPhone', 'MacBook', 'iPad', 'Apple Watch']
