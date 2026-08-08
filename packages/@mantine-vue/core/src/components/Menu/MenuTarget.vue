<script setup lang="ts">
import { cloneVNode, h, nextTick, useAttrs, useSlots, type VNodeChild } from 'vue'
import { PopoverTarget } from '../Popover'
import { useMenuContext } from './Menu.context'
import { menuItems } from './menu-utils'
import type { MenuSlots, MenuTargetProps } from './Menu.types'

defineOptions({
  name: 'MenuTarget',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MenuTargetProps>(), {
  refProp: 'ref',
})

defineSlots<MenuSlots>()

const slots = useSlots()
const attrs = useAttrs()
const ctx = useMenuContext()

/** Clones the child with the trigger handlers merged in. */
function renderChild(): VNodeChild {
  const children = slots.default?.() ?? []

  // Not a single child: pass it through untouched rather than guessing.
  if (children.length !== 1) {
    return children
  }

  const child = children[0]

  return cloneVNode(
    child,
    {
      onClick:
        ctx.trigger === 'click' || ctx.trigger === 'click-hover'
          ? () => ctx.toggleDropdown()
          : undefined,
      onMouseenter:
        ctx.trigger === 'hover' || ctx.trigger === 'click-hover' ? ctx.openDropdown : undefined,
      onMouseleave: ctx.trigger === 'hover' ? ctx.closeDropdown : undefined,
      onKeydown: (event: KeyboardEvent) => {
        // The menu pattern opens on ArrowDown and moves straight to the first item.
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          ctx.openDropdown()
          nextTick(() => menuItems(document.querySelector('[data-menu-dropdown]'))[0]?.focus())
        }
      },
    },
    true,
  )
}

/**
 * Rendered through `<component :is>` rather than as markup: `Popover.Target` clones its
 * child, so the cloned element has to be its literal slot content. A template
 * `<slot />` inside it would hand down a fragment instead.
 */
const renderTarget = () =>
  h(PopoverTarget, { ...attrs, refProp: props.refProp }, { default: renderChild })
</script>

<template>
  <component :is="renderTarget" />
</template>
