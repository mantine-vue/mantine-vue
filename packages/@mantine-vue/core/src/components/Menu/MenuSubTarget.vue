<script setup lang="ts">
import { cloneVNode, h, useAttrs, useSlots, type VNodeChild } from 'vue'
import { PopoverTarget } from '../Popover'
import { useMenuContext } from './Menu.context'
import { call, focusFirstSubItem } from './menu-utils'
import type { MenuSlots, MenuSubTargetProps } from './Menu.types'

defineOptions({
  name: 'MenuSubTarget',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MenuSubTargetProps>(), {
  refProp: 'ref',
})

defineSlots<MenuSlots>()

const slots = useSlots()
const attrs = useAttrs()
const ctx = useMenuContext()

/** Clones the child with the submenu trigger handlers merged in. */
function renderChild(): VNodeChild {
  const children = slots.default?.() ?? []

  // Not a single child: pass it through untouched rather than guessing.
  if (children.length !== 1) {
    return children
  }

  const child = children[0]
  const childProps = (child.props ?? {}) as Record<string, any>

  return cloneVNode(
    child,
    {
      onClick: (event: MouseEvent) => {
        call(childProps.onClick, event)
        ctx.toggleDropdown()
      },
      onMouseenter: ctx.openDropdown,
      onMouseleave: ctx.closeDropdown,
      onKeydown: (event: KeyboardEvent) => {
        call(childProps.onKeydown ?? childProps.onKeyDown, event)

        if (event.defaultPrevented) {
          return
        }

        // ArrowRight enters the submenu, mirroring ArrowLeft in `MenuSubDropdown`.
        if (event.key === 'ArrowRight') {
          event.preventDefault()

          if (!ctx.opened) {
            ctx.toggleDropdown()
          }

          focusFirstSubItem(event.currentTarget as HTMLElement)
        }
      },
    },
    true,
  )
}

/**
 * Rendered through `<component :is>` rather than as markup: `Popover.Target` clones its
 * child, so the cloned element has to be its literal slot content.
 */
const renderTarget = () =>
  h(PopoverTarget, { ...attrs, refProp: props.refProp }, { default: renderChild })
</script>

<template>
  <component :is="renderTarget" />
</template>
