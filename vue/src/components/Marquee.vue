<template>
  <section class="marquee" aria-label="Diferenciais da LL Imports">
    <div class="marquee__track">
      <div class="marquee__group">
        <span v-for="item in items" :key="`a-${item}`" class="marquee__item">
          {{ item }}
          <span class="marquee__sep" />
        </span>
      </div>
      <div class="marquee__group" aria-hidden="true">
        <span v-for="item in items" :key="`b-${item}`" class="marquee__item">
          {{ item }}
          <span class="marquee__sep" />
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>
