<script setup lang="ts">
import { provide } from 'vue'
import { TooltipGroupKey } from './TooltipGroup.context'
import type { TooltipGroupProps, TooltipGroupSlots } from './TooltipGroup.types'

defineOptions({ name: 'TooltipGroup' })

const props = withDefaults(defineProps<TooltipGroupProps>(), {
  openDelay: 0,
  closeDelay: 0,
})

defineSlots<TooltipGroupSlots>()

/**
 * Renderless: the group only shares its delays with descendant `Tooltip` components.
 * Getters keep the provided value reactive without wrapping it in a ref, matching the
 * shape the consumers already read.
 */
provide(TooltipGroupKey, {
  withinGroup: true,
  get openDelay() {
    return props.openDelay
  },
  get closeDelay() {
    return props.closeDelay
  },
})
</script>

<template>
  <slot />
</template>
