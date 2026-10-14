<template>
  <section id="catalogo" className="section" aria-labelledby="catalog-title">
    <div className="container">
      <div className="section-head">
        <span className="section-head__tag">Catálogo Inteligente</span>
        <h2 id="catalog-title" className="section-head__title">
          Modelos Selecionados & Pronta Entrega
        </h2>
        <p className="section-head__subtitle">
          Consulte a cotação oficial do dia ou escolha entre aparelhos lacrados e seminovos revisados com garantia.
        </p>
      </div>

      <div className="catalog-filters">
        <div className="filter-pills" role="tablist" aria-label="Categorias de produtos">
          <button
            type="button"
            :class="['filter-btn', { 'is-active': selectedCat === 'all' }]"
            @click="selectedCat = 'all'"
          >
            Todos os Modelos
          </button>
          <button
            v-for="c in categories"
            :key="c.key"
            type="button"
            :class="['filter-btn', { 'is-active': selectedCat === c.key }]"
            @click="selectedCat = c.key"
          >
            {{ c.label }}
          </button>
        </div>

        <div className="filter-pills" role="tablist" aria-label="Condição do produto">
          <button
            type="button"
            :class="['filter-btn', { 'is-active': selectedCond === 'all' }]"
            @click="selectedCond = 'all'"
          >
            Qualquer Condição
          </button>
          <button
            type="button"
            :class="['filter-btn', { 'is-active': selectedCond === 'novo' }]"
            @click="selectedCond = 'novo'"
          >
            Apenas Novos Lacrados
          </button>
          <button
            type="button"
            :class="['filter-btn', { 'is-active': selectedCond === 'seminovo' }]"
            @click="selectedCond = 'seminovo'"
          >
            Seminovos Selecionados
          </button>
        </div>
      </div>

      <div className="catalog-grid">
        <article v-for="prod in filtered" :key="prod.id" className="product-card">
          <div className="product-card__top">
            <span
              :class="[
                'product-badge',
                prod.condition === 'novo' ? 'product-badge--novo' : 'product-badge--seminovo'
              ]"
            >
              {{ prod.badge || (prod.condition === 'novo' ? 'Lacrado' : 'Seminovo') }}
            </span>
            <span className="product-warranty">{{ prod.warranty }}</span>
          </div>

          <div className="product-card__media">
            <img
              v-if="prod.image_url"
              :src="prod.image_url"
              :alt="prod.name"
              className="product-card__img"
              loading="lazy"
            />
            <MediaPlaceholder
              v-else
              :label="`Mockup · ${prod.name}`"
              :device="prod.category === 'iphone'"
            />
          </div>

          <div className="product-card__body">
            <h3 className="product-card__name">{{ prod.name }}</h3>

            <div className="product-card__tags">
              <span v-for="st in prod.storage" :key="st" className="tag-spec">{{ st }}</span>
              <span v-for="col in (prod.colors || []).slice(0, 3)" :key="col" className="tag-spec">{{ col }}</span>
            </div>

            <div className="product-card__footer">
              <div>
                <span className="product-card__price-label">
                  {{ prod.price ? 'À vista no Pix' : 'Cotação Diária' }}
                </span>
                <span className="product-card__price">
                  {{ formatPrice(prod.price) }}
                </span>
              </div>

              <a
                :href="getWhatsAppLink(prod)"
                target="_blank"
                rel="noopener"
                className="btn btn--primary btn--sm"
                :aria-label="`Consultar ${prod.name} no WhatsApp`"
              >
                <WhatsAppIcon />
                Consultar
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatPrice, waLink } from '../../../shared/lib/format.js'
import { site, categories, products } from '../lib/content.js'
import MediaPlaceholder from './MediaPlaceholder.vue'
import WhatsAppIcon from './WhatsAppIcon.vue'

const selectedCat = ref('all')
const selectedCond = ref('all')

const filtered = computed(() => {
  return products.filter((p) => {
    if (selectedCat.value !== 'all' && p.category !== selectedCat.value) return false
    if (selectedCond.value !== 'all' && p.condition !== selectedCond.value) return false
    return true
  })
})

const getWhatsAppLink = (prod) => {
  const msg = `Olá! Gostaria de consultar a cotação e cores disponíveis para o ${prod.name} (${prod.condition === 'novo' ? 'Lacrado' : 'Seminovo'}).`
  return waLink(site.whatsapp, msg)
}
</script>
