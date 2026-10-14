<template>
  <section id="experiencia" className="section" aria-labelledby="experience-title">
    <div className="container">
      <div className="section-head">
        <span className="section-head__tag">{{ content.tag }}</span>
        <h2 id="experience-title" className="section-head__title">
          {{ content.title }}
        </h2>
        <p className="section-head__subtitle">{{ content.subtitle }}</p>
      </div>

      <div className="trust-metrics">
        <div v-for="m in content.metrics" :key="m.label" className="metric-card">
          <div className="metric-card__num">{{ m.num }}</div>
          <div className="metric-card__label">{{ m.label }}</div>
        </div>
      </div>

      <div className="pillars-grid">
        <div v-for="p in content.pillars" :key="p.title" className="pillar-card">
          <div className="pillar-card__icon">
            <ShieldCheck v-if="p.icon === 'shield'" />
            <Lock v-else-if="p.icon === 'lock'" />
            <CheckCircle2 v-else />
          </div>
          <h3 className="pillar-card__title">{{ p.title }}</h3>
          <p className="pillar-card__desc">{{ p.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ShieldCheck, Lock, CheckCircle2 } from '@lucide/vue'

defineProps({
  content: {
    type: Object,
    required: true
  }
})
</script>
