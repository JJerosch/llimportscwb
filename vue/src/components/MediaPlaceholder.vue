<template>
  <div class="media-ph" role="img" :aria-label="label">
    <div v-if="device" class="media-ph__device" />
    <span class="media-ph__label">
      <ImagePlus />
      {{ label }}
    </span>
  </div>
</template>

<script setup>
import { ImagePlus } from '@lucide/vue'

defineProps({
  label: {
    type: String,
    default: 'Espaço para imagem ou vídeo do produto'
  },
  device: {
    type: Boolean,
    default: true
  }
})
</script>
