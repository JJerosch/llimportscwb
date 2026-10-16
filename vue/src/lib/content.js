/**
 * Camada de conteúdo da versão Vue 3.
 * Espelha a mesma estrutura usada no React.
 */
import seed from '../../../shared/data/seed.json'

export const site = seed.site
export const nav = seed.nav
export const sections = [...seed.sections].sort((a, b) => a.position - b.position)
export const categories = seed.categories
export const deviceQualities = seed.device_qualities || []
export const batteryQualities = seed.battery_qualities || []
export const allProducts = [...seed.products].sort((a, b) => a.position - b.position)
export const products = allProducts.filter((p) => p.active)

export const featuredProduct = products.find((p) => p.featured) ?? products[0]
