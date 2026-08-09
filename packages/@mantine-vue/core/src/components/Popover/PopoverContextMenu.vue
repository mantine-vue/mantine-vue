<script setup lang="ts">
import { cloneVNode, useSlots, type VNodeChild } from 'vue'
import { useContextMenuHandlers } from '../../utils/Floating'
import { usePopoverContext } from './Popover.context'
import { one } from './popover-utils'
import type { PopoverContextMenuProps, PopoverContextMenuSlots } from './Popover.types'

defineOptions({
  name: 'PopoverContextMenu',
})

const props = withDefaults(defineProps<PopoverContextMenuProps>(), {
  disabled: false,
  longPressDelay: 500,
})

defineSlots<PopoverContextMenuSlots>()

const slots = useSlots()
const ctx = usePopoverContext()

/**
 * The handlers need the child's own props to chain into, but the child is only known
 * during render. This is captured there and read back through the getter below.
 */
let childProps: Record<string, any> = {}

const handlers = useContextMenuHandlers({
  get childProps() {
    return childProps
  },
  get disabled() {
    return props.disabled || ctx.disabled
  },
  get opened() {
    return ctx.opened
  },
  get longPressDelay() {
    return props.longPressDelay
  },
  setReference: ctx.reference,
  // Right clicking an open menu should move it, not close it.
  open: () => !ctx.opened && ctx.onToggle(),
})

/** Rendered through `<component :is>`: the child is cloned to receive the handlers. */
const renderChild = Object.assign(
  (slotProps: { nodes?: () => VNodeChild }): VNodeChild => {
    const child = one({ default: slotProps.nodes }, 'Popover.ContextMenu')
    childProps = child.props || {}
    return cloneVNode(child, handlers, true)
  },
  { props: { nodes: { type: Function, required: false } } },
)
</script>

<template>
  <component :is="renderChild" :nodes="slots.default" />
</template>
