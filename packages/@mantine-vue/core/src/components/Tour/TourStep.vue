<script setup lang="ts">
import type { TourStepProps } from './Tour.types'
defineOptions({ name: 'TourStep' })
defineProps<TourStepProps>()
defineSlots<{ default?: () => any }>()
</script>

<template>
  <span v-if="false"><slot /></span>
</template>
