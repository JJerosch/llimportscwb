<template>
  <section id="faq" className="section" aria-labelledby="faq-title">
    <div className="container">
      <div className="section-head">
        <span className="section-head__tag">{{ content.tag }}</span>
        <h2 id="faq-title" className="section-head__title">
          {{ content.title }}
        </h2>
      </div>

      <div className="faq-list">
        <div
          v-for="(item, i) in content.items"
          :key="item.q"
          :class="['faq-item', { 'is-open': openIndex === i }]"
        >
          <button
            type="button"
            className="faq-question"
            :aria-expanded="openIndex === i"
            @click="toggle(i)"
          >
            <span>{{ item.q }}</span>
            <ChevronDown />
          </button>
          <div v-if="openIndex === i" className="faq-answer">
            {{ item.a }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown } from '@lucide/vue'

defineProps({
  content: {
    type: Object,
    required: true
  }
})

const openIndex = ref(0)

const toggle = (i) => {
  openIndex.value = openIndex.value === i ? -1 : i
}
</script>
