<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useId } from '@mantine-vue/hooks'
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
  interactive: false,
  role: 'dialog',
})

defineSlots<HoverCardSlots>()

const emit = defineEmits<{
  open: []
  close: []
}>()

const attrs = useAttrs()
const id = useId((attrs.id as string | undefined) ?? undefined)
const events = computed(() => ({ hover: true, focus: true, touch: false, ...props.events }))

const state = useHoverCard({
  openDelay: props.openDelay,
  closeDelay: props.closeDelay,
  defaultOpened: props.initiallyOpened,
  onOpen: () => emit('open'),
  onClose: () => emit('close'),
  onDismiss: () => (attrs as any).onDismiss?.(),
})

provideHoverCardContext({
  openDropdown: state.openDropdown,
  closeDropdown: state.closeDropdown,
  assignTarget: state.assignTarget,
  get opened() {
    return state.opened.value
  },
  get events() {
    return events.value
  },
  get interactive() {
    return props.interactive
  },
  get role() {
    return props.role
  },
  get withRoles() {
    return (attrs.withRoles as boolean | undefined) !== false
  },
  get dropdownId() {
    return `${id.value}-dropdown`
  },
  closeImmediately: state.closeImmediately,
  dismiss: state.dismiss,
})
</script>

<template>
  <Popover
    v-bind="attrs"
    :id="id"
    :opened="state.opened.value"
    :return-focus="events.focus ? false : (attrs.returnFocus as boolean | undefined)"
    :with-roles="props.role === 'tooltip' ? false : (attrs.withRoles as boolean | undefined)"
    __static-selector="HoverCard"
    @update:opened="(value) => !value && state.dismiss()"
  >
    <slot />
  </Popover>
</template>
