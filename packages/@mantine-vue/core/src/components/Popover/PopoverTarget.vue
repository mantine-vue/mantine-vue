<script setup lang="ts">
import { cloneVNode, useAttrs, useSlots, type VNodeChild } from 'vue'
import { mergeRefs } from '@mantine-vue/hooks'
import { usePopoverContext } from './Popover.context'
import { call, one } from './popover-utils'
import type { PopoverTargetProps, PopoverTargetSlots } from './Popover.types'

defineOptions({
  name: 'PopoverTarget',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PopoverTargetProps>(), {
  refProp: 'ref',
  popupType: 'dialog',
})

defineSlots<PopoverTargetSlots>()

const slots = useSlots()
const attrs = useAttrs()
const ctx = usePopoverContext()

/**
 * Rendered through `<component :is>`: the child has to be cloned so the reference ref,
 * the ARIA wiring and the toggle handler can be merged into whatever it already declares.
 */
const renderChild = Object.assign(
  (slotProps: { nodes?: () => VNodeChild }): VNodeChild => {
    const child = one({ default: slotProps.nodes }, 'Popover.Target')
    const childProps = child.props || {}

    const forwarded: any = {
      ...attrs,
      ...ctx.targetProps,
      [props.refProp]: mergeRefs(ctx.reference, (child as any).ref),
    }

    if (ctx.withRoles) {
      Object.assign(forwarded, {
        'aria-haspopup': props.popupType,
        'aria-expanded': ctx.opened,
        'aria-controls': ctx.opened ? ctx.getDropdownId() : undefined,
        id: ctx.getTargetId(),
      })
    }

    // A controlled popover is driven entirely by its consumer, so the target must not
    // toggle it behind their back.
    if (!ctx.controlled) {
      forwarded.onClick = (event: MouseEvent) => {
        ctx.onToggle()
        call((childProps as any).onClick, event)
      }
    }

    return cloneVNode(child, forwarded, true)
  },
  // Declared so the slot does not fall through onto the cloned child as an attribute.
  { props: { nodes: { type: Function, required: false } } },
)
</script>

<template>
  <component :is="renderChild" :nodes="slots.default" />
</template>
