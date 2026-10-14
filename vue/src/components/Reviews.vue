<template>
  <section id="avaliacoes" className="section" aria-labelledby="reviews-title">
    <div className="container">
      <div className="section-head">
        <span className="section-head__tag">{{ content.tag }}</span>
        <h2 id="reviews-title" className="section-head__title">
          {{ content.title }}
        </h2>
        <p className="section-head__subtitle">{{ content.subtitle }}</p>
      </div>

      <div className="reviews-grid">
        <article v-for="rev in content.items" :key="rev.name" className="review-card">
          <div>
            <div className="review-card__header">
              <div className="review-card__avatar" aria-hidden="true">
                {{ rev.name.charAt(0) }}
              </div>
              <div>
                <h3 className="review-card__name">{{ rev.name }}</h3>
                <span className="review-card__badge">{{ rev.badge }}</span>
              </div>
            </div>

            <div className="review-card__stars" :aria-label="`${rev.stars} estrelas`">
              <Star v-for="i in rev.stars" :key="i" />
            </div>

            <p className="review-card__text">"{{ rev.text }}"</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Star } from '@lucide/vue'

defineProps({
  content: {
    type: Object,
    required: true
  }
})
</script>
