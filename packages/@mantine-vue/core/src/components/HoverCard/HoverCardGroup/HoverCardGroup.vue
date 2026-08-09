<script setup lang="ts">
import { provide } from 'vue'
import { HoverCardGroupKey } from './HoverCardGroup.context'
import type { HoverCardGroupProps, HoverCardGroupSlots } from './HoverCardGroup.types'

defineOptions({ name: 'HoverCardGroup' })

const props = withDefaults(defineProps<HoverCardGroupProps>(), {
  openDelay: 0,
  closeDelay: 0,
})

defineSlots<HoverCardGroupSlots>()

/**
 * Renderless: the group only shares its delays with descendant `HoverCard` components.
 * Getters keep the provided value reactive without wrapping it in a ref, matching the
 * shape the consumers already read.
 */
provide(HoverCardGroupKey, {
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
