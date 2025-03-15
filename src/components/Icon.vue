<template>
  <svg 
    :style="styles"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`0 0 ${icon[0]} ${icon[1]}`"
    role="img"
    aria-hidden="true"
    fill="currentColor"
  ><path :d="icon[4]"/></svg>
</template>

<script setup>
import { computed } from 'vue';

  const props = defineProps({
    icon: { type: Array, required: true },
    width: { type: String, default: '20px' },
    height: { type: String, default: 'auto' }
  })

  const styles = computed(() => ({
    width: props.width,
    height: props.height
  }))
</script>