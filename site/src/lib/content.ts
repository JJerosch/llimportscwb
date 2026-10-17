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
  { label: 'iPhones', href: '/#lancamentos' },
  { label: 'Experiência', href: '/#por-que' },
  { label: 'Avaliações', href: '/#avaliacoes' },
  { label: 'Clube', href: '/#clube' },
  { label: 'A loja', href: '/#loja' },
  { label: 'Catálogo', href: '/catalogo' },
]

export const categories: { kind: ProductKind; label: string; description: string; productId: number }[] = [
  { kind: 'iphone', label: 'iPhone', description: 'Do iPhone 11 ao 17 Pro Max, lacrados e com nota fiscal.', productId: 3372 },
  { kind: 'mac', label: 'Mac', description: 'MacBook Air, MacBook Pro e Mac mini com chips da linha M.', productId: 2735 },
  { kind: 'ipad', label: 'iPad', description: 'Para estudar, desenhar e trabalhar de qualquer lugar.', productId: 2682 },
  { kind: 'watch', label: 'Apple Watch', description: 'Treino, saúde e notificações direto no pulso.', productId: 2716 },
  { kind: 'acessorios', label: 'Acessórios', description: 'Capinhas, carregadores, AirPods e o que mais faltar.', productId: 2739 },
]

// Cards de iPhone da landing: o productId liga cada um ao produto do catálogo (foto e nome completo).
export const launches = [
  { productId: 3372, name: 'iPhone 17 Pro Max', chips: ['Tela de 6,9″', '3 câmeras de 48 MP'] },
  { productId: 629, name: 'iPhone 17 Pro', chips: ['Tela de 6,3″', '3 câmeras de 48 MP'] },
  { productId: 325, name: 'iPhone 17', chips: ['Tela de 6,3″', 'ProMotion'] },
  { productId: 106, name: 'iPhone Air', chips: ['Tela de 6,5″', '5,6 mm de espessura'] },
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
