<script setup lang="ts">
import { cloneVNode, h, useAttrs, useSlots, type VNodeChild } from 'vue'
import { PopoverContextMenu } from '../Popover'
import { useMenuContext } from './Menu.context'
import type { MenuContextMenuProps, MenuSlots } from './Menu.types'

defineOptions({
  name: 'MenuContextMenu',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MenuContextMenuProps>(), {
  disabled: false,
})

defineSlots<MenuSlots>()

const slots = useSlots()
const attrs = useAttrs()
const ctx = useMenuContext()

/** A plain click on the target closes the menu rather than reopening it. */
function renderChild(): VNodeChild {
  const children = slots.default?.() ?? []

  return children.length === 1
    ? cloneVNode(children[0], { onClick: ctx.closeDropdownImmediately }, true)
    : children
}

/**
 * Rendered through `<component :is>` rather than as markup: `Popover.ContextMenu` clones
 * its child, so the cloned element has to be its literal slot content.
 */
const renderTarget = () =>
  h(
    PopoverContextMenu,
    { ...attrs, disabled: props.disabled, longPressDelay: props.longPressDelay },
    { default: renderChild },
  )
</script>

<template>
  <component :is="renderTarget" />
</template>
