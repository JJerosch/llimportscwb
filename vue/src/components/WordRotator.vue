<template>
  <span class="rotator" :style="{ width: width ? `${width}px` : undefined }" aria-live="polite">
    <span
      v-for="(word, i) in words"
      :key="word"
      :ref="(el) => setWordRef(el, i)"
      :class="[
        'rotator__word',
        { 'is-active': i === currentIndex, 'is-leaving': i === prevIndex }
      ]"
      :aria-hidden="i !== currentIndex"
    >
      {{ word }}
    </span>
  </span>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  words: {
    type: Array,
    required: true
  },
  interval: {
    type: Number,
    default: 2600
  }
})

const currentIndex = ref(0)
const prevIndex = ref(null)
const width = ref(null)
const wordRefs = ref([])

const setWordRef = (el, i) => {
  if (el) wordRefs.value[i] = el
}

let timerId = null

const measure = () => {
  const el = wordRefs.value[currentIndex.value]
  if (el) {
    width.value = el.offsetWidth
  }
}

onMounted(() => {
  nextTick(() => {
    measure()
    document.fonts?.ready?.then(measure)
  })
  window.addEventListener('resize', measure)

  if (props.words.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    timerId = setInterval(() => {
      prevIndex.value = currentIndex.value
      currentIndex.value = (currentIndex.value + 1) % props.words.length
      nextTick(measure)
    }, props.interval)
  }
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
  window.removeEventListener('resize', measure)
})
</script>
