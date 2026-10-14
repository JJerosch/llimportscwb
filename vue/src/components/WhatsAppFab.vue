<template>
  <a
    id="whatsapp-fab"
    :href="link"
    target="_blank"
    rel="noopener"
    class="wa-fab"
    aria-label="Falar no WhatsApp"
  >
    <WhatsAppIcon />
    <span class="wa-fab__text">Fale com a gente</span>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { waLink } from '../../../shared/lib/format.js'
import { site } from '../lib/content.js'
import WhatsAppIcon from './WhatsAppIcon.vue'

const link = computed(() =>
  waLink(site.whatsapp, 'Olá! Vim pelo site da LL Imports e gostaria de tirar algumas dúvidas.')
)
</script>
