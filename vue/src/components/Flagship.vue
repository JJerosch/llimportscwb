<template>
  <section id="destaque" className="section feature-flagship" aria-labelledby="flagship-title">
    <div className="container">
      <div className="flagship-grid">
        <div>
          <span className="section-head__tag">
            <Sparkles style="width: 14px; height: 14px; display: inline; margin-right: 4px; vertical-align: text-top;" />
            {{ content.tag }}
          </span>
          <h2 id="flagship-title" className="section-head__title" style="text-align: left;">
            {{ content.title }}
          </h2>
          <p className="section-head__subtitle" style="text-align: left; margin-left: 0;">
            {{ content.subtitle }}
          </p>

          <div className="flagship-specs">
            <div v-for="spec in content.specs" :key="spec.val" className="spec-card">
              <div className="spec-card__val">{{ spec.val }}</div>
              <div className="spec-card__label">{{ spec.label }}</div>
            </div>
          </div>

          <a :href="link" target="_blank" rel="noopener" className="btn btn--primary">
            <WhatsAppIcon />
            {{ content.cta }}
            <ArrowRight className="btn__arrow" />
          </a>
        </div>

        <div className="flagship-visual">
          <MediaPlaceholder label="Destaque Flagship · Titânio" :device="true" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowRight, Sparkles } from '@lucide/vue'
import { waLink } from '../../../shared/lib/format.js'
import { site } from '../lib/content.js'
import MediaPlaceholder from './MediaPlaceholder.vue'
import WhatsAppIcon from './WhatsAppIcon.vue'

const props = defineProps({
  content: {
    type: Object,
    required: true
  }
})

const link = computed(() =>
  waLink(site.whatsapp, `Olá! Gostaria de consultar os valores e cores disponíveis para o ${props.content.title}`)
)
</script>
