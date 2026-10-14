/**
 * Camada de conteúdo da versão Vue 3.
 * Espelha a mesma estrutura usada no React.
 */
import seed from '../../../shared/data/seed.json'

export const site = seed.site
export const nav = seed.nav
export const sections = [...seed.sections].sort((a, b) => a.position - b.position)
export const categories = seed.categories
export const products = seed.products
  .filter((p) => p.active)
  .sort((a, b) => a.position - b.position)

export const featuredProduct = products.find((p) => p.featured) ?? products[0]
