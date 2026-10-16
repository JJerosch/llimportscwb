<template>
  <section id="catalogo" className="section" aria-labelledby="catalog-title">
    <div className="container">
      <div className="section-head">
        <span className="section-head__tag">Catálogo Inteligente</span>
        <h2 id="catalog-title" className="section-head__title">
          Modelos Selecionados & Pronta Entrega
        </h2>
        <p className="section-head__subtitle">
          Consulte a cotação oficial do dia ou escolha entre aparelhos lacrados e seminovos com laudo de bateria e grau estético detalhado.
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
                getCondition(prod) === 'novo' ? 'product-badge--novo' : 'product-badge--seminovo'
              ]"
            >
              {{ prod.badge || (getCondition(prod) === 'novo' ? 'Lacrado' : 'Seminovo') }}
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

            <!-- Badges de Bateria e Grau Estético -->
            <div className="product-card__meta-bar">
              <span
                v-if="getAesthetic(prod)"
                :class="['grade-badge', `grade-badge--${getAesthetic(prod)}`]"
              >
                ✨ {{ formatAestheticGrade(getAesthetic(prod)) }}
              </span>

              <span
                v-if="getBattery(prod)"
                :class="[
                  'battery-badge',
                  (getActiveUnit(prod)?.battery_health || 100) >= 90
                    ? 'battery-badge--good'
                    : 'battery-badge--medium'
                ]"
              >
                🔋 {{ getBattery(prod) }}
              </span>
            </div>

            <!-- Tags gerais ou da unidade -->
            <div className="product-card__tags">
              <template v-if="getActiveUnit(prod)">
                <span className="tag-spec">{{ getActiveUnit(prod).storage }}</span>
                <span className="tag-spec">{{ getActiveUnit(prod).color }}</span>
              </template>
              <template v-else>
                <span v-for="st in prod.storage" :key="st" className="tag-spec">{{ st }}</span>
                <span v-for="col in (prod.colors || []).slice(0, 3)" :key="col" className="tag-spec">{{ col }}</span>
              </template>
            </div>

            <!-- Seletor de unidades se houver mais de uma disponível -->
            <div
              v-if="getAvailableUnits(prod).length > 1"
              className="product-card__units-box"
            >
              <div className="product-card__units-header">
                <span>Unidades Disponíveis ({{ getAvailableUnits(prod).length }})</span>
                <span>Selecione a opção</span>
              </div>
              <div className="unit-chips">
                <button
                  v-for="u in getAvailableUnits(prod)"
                  :key="u.id"
                  type="button"
                  :class="['unit-chip', { 'is-active': u.id === getActiveUnit(prod)?.id }]"
                  @click="selectUnit(prod.id, u.id)"
                >
                  <div className="unit-chip__main">
                    <span className="unit-chip__name">
                      {{ u.storage }} · {{ u.color }}
                    </span>
                    <span className="unit-chip__sub">
                      {{ formatAestheticGrade(u.aesthetic_grade) }}
                      <template v-if="u.battery_health">
                        · 🔋 {{ u.battery_health }}% ({{ u.battery_cycles || 0 }}c)
                      </template>
                    </span>
                  </div>
                  <span className="unit-chip__price">
                    {{ formatPrice(u.price) }}
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
const selectedUnits = ref({})

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

const getAvailableUnits = (prod) => {
  return (prod.units || []).filter((u) => u.status === 'disponivel')
}

const getActiveUnit = (prod) => {
  const units = getAvailableUnits(prod)
  const id = selectedUnits.value[prod.id]
  return units.find((u) => u.id === id) || units[0] || null
}

const selectUnit = (prodId, unitId) => {
  selectedUnits.value[prodId] = unitId
}

const getCondition = (prod) => {
  const u = getActiveUnit(prod)
  return u ? u.condition : prod.condition
}

const getWarranty = (prod) => {
  const u = getActiveUnit(prod)
  return u?.warranty || prod.warranty
}

const getAesthetic = (prod) => {
  const u = getActiveUnit(prod)
  return u ? u.aesthetic_grade : null
}

const getBattery = (prod) => {
  const u = getActiveUnit(prod)
  return u ? formatBattery(u.battery_health, u.battery_cycles) : null
}

const getPrice = (prod) => {
  const u = getActiveUnit(prod)
  return u ? u.price : prod.price
}

const getWhatsAppLink = (prod) => {
  const u = getActiveUnit(prod)
  let msg = ''
  if (u) {
    const condLabel = u.condition === 'novo' ? 'Novo Lacrado' : `Seminovo (${formatAestheticGrade(u.aesthetic_grade)})`
    const batt = formatBattery(u.battery_health, u.battery_cycles)
    const battLabel = batt ? ` com ${batt}` : ''
    const price = u.price ? ` por ${formatPrice(u.price)}` : ''
    msg = `Olá! Vi no catálogo da LL Imports o ${prod.name} (${condLabel}), ${u.storage} na cor ${u.color}${battLabel}${price}. Gostaria de confirmar a retirada no showroom!`
  } else {
    msg = `Olá! Gostaria de consultar a cotação e cores disponíveis para o ${prod.name} (${prod.condition === 'novo' ? 'Lacrado' : 'Seminovo'}).`
  }
  return waLink(site.whatsapp, msg)
}
</script>
