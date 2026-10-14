<template>
  <header :class="['site-header', { 'is-scrolled': scrolled, 'is-open': open }]">
    <div class="site-header__bar">
      <a href="#topo" class="brand" aria-label="LL Imports CWB: início">
        <img :src="logo" alt="LL Imports" width="114" height="20" />
      </a>

      <nav class="nav" aria-label="Navegação principal">
        <a v-for="item in nav" :key="item.href" :href="item.href" class="nav__link">
          {{ item.label }}
        </a>
      </nav>

      <div class="site-header__actions">
        <a id="header-whatsapp" :href="cta" target="_blank" rel="noopener" class="btn btn--primary btn--sm">
          <WhatsAppIcon />
          WhatsApp
        </a>
        <button
          id="menu-toggle"
          type="button"
          class="menu-toggle"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="open ? 'Fechar menu' : 'Abrir menu'"
          @click="open = !open"
        >
          <X v-if="open" />
          <Menu v-else />
        </button>
      </div>

      <nav id="mobile-nav" class="mobile-nav" aria-label="Navegação mobile">
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          class="nav__link"
          @click="open = false"
        >
          {{ item.label }}
        </a>
        <a :href="cta" target="_blank" rel="noopener" class="btn btn--primary">
          <WhatsAppIcon />
          Falar no WhatsApp
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Menu, X } from '@lucide/vue'
import logo from '../../../shared/assets/brand/ll-logo-wide.png'
import { waLink } from '../../../shared/lib/format.js'
import { site, nav } from '../lib/content.js'
import WhatsAppIcon from './WhatsAppIcon.vue'

const scrolled = ref(false)
const open = ref(false)

const cta = computed(() =>
  waLink(site.whatsapp, 'Olá! Vim pelo site da LL Imports e gostaria de atendimento.')
)

const onScroll = () => {
  scrolled.value = window.scrollY > 24
}

const onKey = (e) => {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})
</script>
