<template>
  <section id="topo" class="hero" aria-labelledby="hero-title">
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__spotlight" />
      <div class="hero__orb hero__orb--1" />
      <div class="hero__orb hero__orb--2" />
      <div class="hero__orb hero__orb--3" />
      <div class="hero__grid" />
      <div class="hero__noise" />
      <div class="hero__fade" />
    </div>

    <div class="container hero__content">
      <span class="eyebrow">
        <span class="live-dot" aria-hidden="true" />
        {{ content.badge }}
      </span>

      <h1 id="hero-title" class="hero__title">
        <span class="hero__line">
          <RevealText :text="content.titleBefore" />{{ ' ' }}
          <span class="reveal-word" :style="{ '--i': before }">
            <WordRotator :words="content.rotatingWords" />
          </span>
        </span>
        <span class="hero__line">
          <RevealText :text="content.titleAfter" :start="before + 1" />
        </span>
        <span class="hero__line muted">
          <RevealText :text="content.titleMuted" :start="before + 1 + after" />
        </span>
      </h1>

      <p class="hero__subtitle">{{ content.subtitle }}</p>

      <div class="hero__actions">
        <a
          id="hero-cta-primary"
          :href="primaryLink"
          target="_blank"
          rel="noopener"
          class="btn btn--primary"
        >
          <WhatsAppIcon />
          {{ content.primaryCta.label }}
          <ArrowRight class="btn__arrow" />
        </a>
        <a
          id="hero-cta-secondary"
          :href="secondaryLink"
          target="_blank"
          rel="noopener"
          class="btn btn--ghost"
        >
          <CalendarDays />
          {{ content.secondaryCta.label }}
        </a>
      </div>

      <ul class="hero__meta">
        <li>
          <MapPin />
          {{ site.address.district }} · {{ site.address.city }}/{{ site.address.state }}
        </li>
        <li>
          <span class="stars" aria-hidden="true">
            <Star v-for="i in 5" :key="i" />
          </span>
          {{ rating }} no Google
        </li>
        <li>
          <ShieldCheck />
          Nota fiscal e garantia
        </li>
      </ul>

      <div class="hero__stage-wrap">
        <div class="hero__stage">
          <div class="hero__stage-inner">
            <MediaPlaceholder />

            <div class="stage-chip stage-chip--right">
              <span class="stage-chip__icon">
                <Smartphone />
              </span>
              <span>
                <span class="stage-chip__label">{{ featuredProduct.name }}</span>
                <span class="stage-chip__value">
                  {{ featuredProduct.price ? `a partir de ${formatPrice(featuredProduct.price)}` : 'Consulte condições' }}
                </span>
              </span>
            </div>

            <div class="stage-chip stage-chip--left">
              <span class="stage-chip__icon">
                <PackageCheck />
              </span>
              <span>
                <span class="stage-chip__label">Showroom</span>
                <span class="stage-chip__value">{{ content.stageChip }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Star
} from '@lucide/vue'
import { formatPrice, splitWords, waLink } from '../../../shared/lib/format.js'
import { site, featuredProduct } from '../lib/content.js'
import RevealText from './RevealText.vue'
import WordRotator from './WordRotator.vue'
import MediaPlaceholder from './MediaPlaceholder.vue'
import WhatsAppIcon from './WhatsAppIcon.vue'

const props = defineProps({
  content: {
    type: Object,
    required: true
  }
})

const before = computed(() => splitWords(props.content.titleBefore).length)
const after = computed(() => splitWords(props.content.titleAfter).length)
const rating = computed(() => site.googleRating.toLocaleString('pt-BR', { minimumFractionDigits: 1 }))

const primaryLink = computed(() => waLink(site.whatsapp, props.content.primaryCta.message))
const secondaryLink = computed(() => waLink(site.whatsapp, props.content.secondaryCta.message))
</script>
