<template>
  <section id="catalogo" className="section" aria-labelledby="catalog-title">
    <div className="container">
      <div className="section-head">
        <span className="section-head__tag">Catálogo Inteligente</span>
        <h2 id="catalog-title" className="section-head__title">
          Modelos & Qualidades Disponíveis
        </h2>
        <p className="section-head__subtitle">
          Consulte os modelos disponíveis no showroom com tags claras de qualidade do aparelho e saúde de bateria.
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
                isNovo(prod) ? 'product-badge--novo' : 'product-badge--seminovo'
              ]"
            >
              {{ isNovo(prod) ? 'Novo Lacrado' : (getDeviceQualityName(prod) || 'Seminovo') }}
            </span>
            <span className="product-warranty">{{ getWarranty(prod) }}</span>
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

            <!-- Badges de Qualidade do Aparelho & Qualidade da Bateria -->
            <div className="product-card__meta-bar">
              <span
                v-if="getDeviceQualitySlug(prod)"
                :class="['grade-badge', `grade-badge--${getDeviceQualitySlug(prod)}`]"
              >
                ✨ {{ getDeviceQualityName(prod) }}
              </span>

              <span
                v-if="getBatteryLabel(prod)"
                :class="[
                  'battery-badge',
                  (getActiveTag(prod)?.battery_health || 100) >= 90
                    ? 'battery-badge--good'
                    : 'battery-badge--medium'
                ]"
              >
                🔋 {{ getBatteryLabel(prod) }}
              </span>
            </div>

            <!-- Tags gerais ou da opção selecionada -->
            <div className="product-card__tags">
              <template v-if="getActiveTag(prod)">
                <span className="tag-spec">{{ getActiveTag(prod).storage }}</span>
                <span className="tag-spec">{{ getActiveTag(prod).color }}</span>
              </template>
              <template v-else>
                <span v-for="st in prod.storage" :key="st" className="tag-spec">{{ st }}</span>
                <span v-for="col in (prod.colors || []).slice(0, 3)" :key="col" className="tag-spec">{{ col }}</span>
              </template>
            </div>

            <!-- Seletor de Qualidades/Tags disponíveis -->
            <div
              v-if="getAvailableTags(prod).length > 1"
              className="product-card__units-box"
            >
              <div className="product-card__units-header">
                <span>Qualidades Disponíveis ({{ getAvailableTags(prod).length }})</span>
                <span>Selecione a opção</span>
              </div>
              <div className="unit-chips">
                <button
                  v-for="t in getAvailableTags(prod)"
                  :key="t.id"
                  type="button"
                  :class="['unit-chip', { 'is-active': t.id === getActiveTag(prod)?.id }]"
                  @click="selectTag(prod.id, t.id)"
                >
                  <div className="unit-chip__main">
                    <span className="unit-chip__name">
                      {{ t.storage }} · {{ t.color }}
                    </span>
                    <span className="unit-chip__sub">
                      {{ t.device_quality_name || formatAestheticGrade(t.device_quality_slug || t.aesthetic_grade) }}
                      <template v-if="t.battery_quality_name || t.battery_health">
                        · 🔋 {{ t.battery_quality_name || `${t.battery_health}%` }}
                      </template>
                    </span>
                  </div>
                  <span className="unit-chip__price">
                    {{ formatPrice(t.price) }}
                  </span>
                </button>
              </div>
            </div>

            <div className="product-card__footer">
              <div>
                <span className="product-card__price-label">
                  {{ getPrice(prod) ? 'À vista no Pix' : 'Cotação Diária' }}
                </span>
                <span className="product-card__price">
                  {{ formatPrice(getPrice(prod)) }}
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
import { formatPrice, waLink, formatAestheticGrade, formatBattery } from '../../../shared/lib/format.js'
import { site, categories, products as defaultProducts } from '../lib/content.js'
import MediaPlaceholder from './MediaPlaceholder.vue'
import WhatsAppIcon from './WhatsAppIcon.vue'

const props = defineProps({
  products: {
    type: Array,
    default: () => defaultProducts
  }
})

const selectedCat = ref('all')
const selectedCond = ref('all')
const selectedTags = ref({})

const allActiveProducts = computed(() => {
  return (props.products || defaultProducts).filter((p) => p.active !== false)
})

const filtered = computed(() => {
  return allActiveProducts.value.filter((p) => {
    if (selectedCat.value !== 'all' && p.category !== selectedCat.value) return false
    if (selectedCond.value !== 'all' && p.condition !== selectedCond.value) return false
    return true
  })
})

const getAvailableTags = (prod) => {
  const raw = prod.tags || prod.units || []
  return raw.filter((t) => t.is_available !== false && t.status !== 'vendido')
}

const getActiveTag = (prod) => {
  const tags = getAvailableTags(prod)
  const id = selectedTags.value[prod.id]
  return tags.find((t) => t.id === id) || tags[0] || null
}

const selectTag = (prodId, tagId) => {
  selectedTags.value[prodId] = tagId
}

const getDeviceQualitySlug = (prod) => {
  const t = getActiveTag(prod)
  return t ? (t.device_quality_slug || t.aesthetic_grade) : null
}

const getDeviceQualityName = (prod) => {
  const t = getActiveTag(prod)
  if (!t) return null
  return t.device_quality_name || formatAestheticGrade(t.device_quality_slug || t.aesthetic_grade)
}

const isNovo = (prod) => {
  const slug = getDeviceQualitySlug(prod)
  return slug === 'novo_lacrado' || prod.condition === 'novo'
}

const getBatteryLabel = (prod) => {
  const t = getActiveTag(prod)
  if (!t) return null
  return t.battery_quality_name || formatBattery(t.battery_health, t.battery_cycles)
}

const getWarranty = (prod) => {
  const t = getActiveTag(prod)
  return t?.warranty || prod.warranty
}

const getPrice = (prod) => {
  const t = getActiveTag(prod)
  return t ? t.price : prod.price
}

const getWhatsAppLink = (prod) => {
  const t = getActiveTag(prod)
  let msg = ''
  if (t) {
    const devName = t.device_quality_name || formatAestheticGrade(t.device_quality_slug || t.aesthetic_grade)
    const qualityText = devName ? ` (${devName})` : ''
    const batt = t.battery_quality_name || formatBattery(t.battery_health, t.battery_cycles)
    const batteryText = batt ? ` com ${batt}` : ''
    const price = t.price ? ` por ${formatPrice(t.price)}` : ''
    msg = `Olá! Vi no catálogo da LL Imports o ${prod.name}${qualityText}, ${t.storage} na cor ${t.color}${batteryText}${price}. Gostaria de confirmar disponibilidade no showroom!`
  } else {
    msg = `Olá! Gostaria de consultar a cotação e cores disponíveis para o ${prod.name} (${prod.condition === 'novo' ? 'Lacrado' : 'Seminovo'}).`
  }
  return waLink(site.whatsapp, msg)
}
</script>
