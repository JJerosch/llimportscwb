// Gera src/data/catalog.generated.ts a partir do catálogo público (WooCommerce) do site original.
// Uso: node scripts/build-catalog.mjs
// É uma ponte temporária: quando o catálogo for para o Supabase, este script deixa de existir.
import { writeFileSync, mkdirSync } from 'node:fs'

const API = 'https://llimportscwb.com.br/wp-json/wc/store/v1/products?per_page=100'

const CATEGORY_BY_SLUG = {
  iphone: 'iphone',
  macbook: 'macbook',
  'mac-mini': 'mac-mini',
  ipad: 'ipad',
  'apple-watch': 'watch',
  'acessorios-apple': 'acessorios',
}
// Produto em várias categorias (ex.: Apple Pencil em iPad e Acessórios): vale a mais específica desta ordem.
const PRIORITY = ['acessorios-apple', 'iphone', 'macbook', 'mac-mini', 'ipad', 'apple-watch']

const decode = (s) =>
  s
    .replace(/&#8243;/g, '″')
    .replace(/&#8211;/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))

// Remove emoji e símbolos decorativos do início/meio do nome.
const clean = (s) =>
  decode(s)
    .replace(/[\p{Extended_Pictographic}‍️]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()

const COLORS = [
  'cinza espacial',
  'preto espacial',
  'preto brilhante',
  'meia-noite',
  'azul céu',
  'ouro-rosa',
  'estrelar',
  'prata',
  'preto',
  'rosa',
  'azul',
  'roxo',
  'natural',
  'amarelo',
  'verde',
  'dourado',
]

/** Separa o nome em título + especificações (tela, chip, memória, cor) para virarem chips. */
function split(name) {
  let title = name.replace(/\(([^)]+)\)/, ' $1 ') // "(preto espacial)" vira cor
  const chips = []
  const take = (re, fmt = (m) => m[0]) => {
    const m = title.match(re)
    if (m) {
      chips.push(fmt(m))
      title = title.replace(m[0], ' ')
    }
  }
  // Cores primeiro (as mais longas antes), para "azul céu" não virar "azul".
  let color = ''
  for (const c of COLORS) {
    const re = new RegExp(`(^|\\s)${c}(\\s|$)`, 'i')
    if (re.test(title)) {
      color = c
      title = title.replace(re, ' ')
      break
    }
  }
  take(/\b(\d{2})\s?MM\b/i, (m) => `${m[1]} mm`)
  take(/\b(\d{2}(?:[.,]\d)?)″/, (m) => `Tela de ${m[1]}″`)
  take(/\b(M\d(?: Pro| Max)?|A\d{2}(?: Pro)?)\b/, (m) => `Chip ${m[1]}`)
  const mem = [...title.matchAll(/\b(\d+)\s?(GB|TB)\b/gi)].map((m) => `${m[1]} ${m[2].toUpperCase()}`)
  if (mem.length) {
    chips.push(mem.join(' + '))
    title = title.replace(/\b\d+\s?(GB|TB)\b/gi, ' ')
  }
  if (color) chips.push(color[0].toUpperCase() + color.slice(1))
  title = title.replace(/\s+/g, ' ').trim()
  return { title, chips }
}

const res = await fetch(API, { headers: { 'User-Agent': 'Mozilla/5.0' } })
if (!res.ok) throw new Error(`API respondeu ${res.status}`)
const raw = await res.json()

const seen = new Set()
const products = []
for (const p of raw) {
  const name = clean(p.name)
  const key = name.toLowerCase()
  if (seen.has(key)) continue // o cadastro original repete produtos (versão com emoji e sem)
  seen.add(key)

  const slugs = p.categories.map((c) => c.slug)
  const primary = PRIORITY.find((s) => slugs.includes(s))
  const category = CATEGORY_BY_SLUG[primary]
  if (!category) continue

  let { title, chips } = split(name)
  if (category === 'iphone') {
    // Nos iPhones o título já é o modelo; as cores reais vêm do atributo "Cor" quando existe.
    title = name
    const cores = p.attributes.find((a) => a.taxonomy === 'pa_cor')
    chips = cores?.terms.length ? [`${cores.terms.length} cores`] : []
  }
  products.push({
    id: p.id,
    slug: p.slug,
    name,
    title,
    category,
    chips,
    image: p.images[0]?.src ?? null,
  })
}

const order = ['iphone', 'macbook', 'mac-mini', 'ipad', 'watch', 'acessorios']
products.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || b.id - a.id)

mkdirSync('src/data', { recursive: true })
writeFileSync(
  'src/data/catalog.generated.ts',
  `// Gerado por scripts/build-catalog.mjs a partir de llimportscwb.com.br. Não editar à mão.\nimport type { Product } from '../lib/catalog'\n\nexport const products: Product[] = ${JSON.stringify(products, null, 2)}\n`,
)
const counts = products.reduce((a, p) => ((a[p.category] = (a[p.category] ?? 0) + 1), a), {})
console.log(`${products.length} produtos (de ${raw.length})`, counts)
