<script setup lang="ts">
import { useAttrs } from 'vue'
import { Popover } from '../Popover'
import { provideHoverCardContext } from './HoverCard.context'
import { useHoverCard } from './use-hover-card'
import type { HoverCardOwnProps, HoverCardSlots } from './HoverCard.types'

defineOptions({
  name: 'HoverCard',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<HoverCardOwnProps>(), {
  initiallyOpened: false,
  openDelay: 0,
  closeDelay: 150,
})

defineSlots<HoverCardSlots>()

const emit = defineEmits<{
  open: []
  close: []
}>()

const attrs = useAttrs()

const state = useHoverCard({
  openDelay: props.openDelay,
  closeDelay: props.closeDelay,
  defaultOpened: props.initiallyOpened,
  onOpen: () => emit('open'),
  onClose: () => emit('close'),
})

provideHoverCardContext({
  openDropdown: state.openDropdown,
  closeDropdown: state.closeDropdown,
  assignTarget: state.assignTarget,
})
</script>

<template>
  <Popover v-bind="attrs" :opened="state.opened.value" __static-selector="HoverCard">
    <slot />
  </Popover>
</template>
