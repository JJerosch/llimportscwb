<template>
  <template v-for="(word, i) in words" :key="`${word}-${i}`">
    <span class="reveal-word" :style="{ '--i': start + i }">{{ word }}</span>
    <span v-if="i < words.length - 1">{{ ' ' }}</span>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { splitWords } from '../../../shared/lib/format.js'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  start: {
    type: Number,
    default: 0
  }
})

const words = computed(() => splitWords(props.text))
</script>
