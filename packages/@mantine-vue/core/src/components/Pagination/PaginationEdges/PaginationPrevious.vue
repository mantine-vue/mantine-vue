<script setup lang="ts">
import { useAttrs } from 'vue'
import PaginationEdge from './PaginationEdge.vue'
import type { PaginationEdgeOwnProps, PaginationEdgeSlots } from './PaginationEdges.types'

defineOptions({
  name: 'PaginationPrevious',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PaginationEdgeOwnProps>(), {
  icon: undefined,
  disabled: false,
})

defineSlots<PaginationEdgeSlots>()

const attrs = useAttrs()
</script>

<template>
  <PaginationEdge v-bind="attrs" __edge="previous" :icon="props.icon" :disabled="props.disabled">
    <template v-if="$slots.icon" #icon><slot name="icon" /></template>
  </PaginationEdge>
</template>
