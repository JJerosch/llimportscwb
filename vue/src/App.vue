<template>
  <div>
    <Header />
    <main>
      <Hero v-if="hero" :content="hero.content" />
      <Marquee v-if="marquee" :items="marquee.content.items" />
      <Catalog />
      <Flagship v-if="flagship" :content="flagship.content" />
      <Experience v-if="experience" :content="experience.content" />
      <Reviews v-if="reviews" :content="reviews.content" />
      <FAQ v-if="faq" :content="faq.content" />
      <Location />
    </main>
    <Footer />
    <WhatsAppFab />
    <AdminDrawer
      :products="products"
      :sections="sections"
      @add-product="handleAddProduct"
      @update-price="handleUpdatePrice"
      @delete-product="handleDeleteProduct"
      @toggle-section="handleToggleSection"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getSection } from '../../shared/lib/format.js'
import { sections as initialSections, products as initialProducts } from './lib/content.js'
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import Marquee from './components/Marquee.vue'
import Catalog from './components/Catalog.vue'
import Flagship from './components/Flagship.vue'
import Experience from './components/Experience.vue'
import Reviews from './components/Reviews.vue'
import FAQ from './components/FAQ.vue'
import Location from './components/Location.vue'
import Footer from './components/Footer.vue'
import WhatsAppFab from './components/WhatsAppFab.vue'
import AdminDrawer from './components/AdminDrawer.vue'

const sections = ref(initialSections)
const products = ref(initialProducts)

const hero = computed(() => getSection(sections.value, 'hero'))
const marquee = computed(() => getSection(sections.value, 'marquee'))
const flagship = computed(() => getSection(sections.value, 'flagship'))
const experience = computed(() => getSection(sections.value, 'experience'))
const reviews = computed(() => getSection(sections.value, 'reviews'))
const faq = computed(() => getSection(sections.value, 'faq'))

const handleAddProduct = (newProd) => {
  products.value.unshift(newProd)
}

const handleUpdatePrice = (id, newPrice) => {
  const item = products.value.find((p) => p.id === id)
  if (item) item.price = newPrice
}

const handleDeleteProduct = (id) => {
  products.value = products.value.filter((p) => p.id !== id)
}

const handleToggleSection = (key) => {
  const item = sections.value.find((s) => s.key === key)
  if (item) item.visible = !item.visible
}
</script>
