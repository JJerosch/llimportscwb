import { products } from '../data/catalog.generated'
import type { ProductKind } from './content'

export type CatalogCategory = 'iphone' | 'macbook' | 'mac-mini' | 'ipad' | 'watch' | 'acessorios'

export type Product = {
  id: number
  slug: string
  /** Nome completo, usado na mensagem do WhatsApp. */
  name: string
  /** Nome curto exibido no card (sem as especificações que viram chips). */
  title: string
  category: CatalogCategory
  chips: string[]
  image: string | null
}

export const catalogCategories: { id: CatalogCategory; label: string; kind: ProductKind }[] = [
  { id: 'iphone', label: 'iPhone', kind: 'iphone' },
  { id: 'macbook', label: 'MacBook', kind: 'mac' },
  { id: 'mac-mini', label: 'Mac mini', kind: 'mac' },
  { id: 'ipad', label: 'iPad', kind: 'ipad' },
  { id: 'watch', label: 'Apple Watch', kind: 'watch' },
  { id: 'acessorios', label: 'Acessórios', kind: 'acessorios' },
]

/**
 * Fonte única do catálogo. Hoje vem de um arquivo estático; quando o banco entrar,
 * só esta função muda (as telas continuam consumindo `Product[]`).
 */
export function getCatalog(): Product[] {
  return products
}

export function getProduct(id: number): Product | undefined {
  return products.find((p) => p.id === id)
}

export function groupByCategory(list: Product[]) {
  return catalogCategories
    .map((cat) => ({ ...cat, items: list.filter((p) => p.category === cat.id) }))
    .filter((g) => g.items.length > 0)
}
