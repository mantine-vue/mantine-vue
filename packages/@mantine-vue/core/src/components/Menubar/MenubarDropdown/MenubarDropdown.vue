<script setup lang="ts">
import { useAttrs } from 'vue'
import { useDirection } from '../../../core'
import { MenuDropdown } from '../../Menu'
import { useMenubarContext, useMenubarMenuContext } from '../Menubar.context'
import type { MenubarDropdownOwnProps, MenubarDropdownSlots } from './MenubarDropdown.types'

defineOptions({ name: 'MenubarDropdown', inheritAttrs: false })
const props = withDefaults(defineProps<MenubarDropdownOwnProps>(), {
  onKeydown: undefined,
  onMouseenter: undefined,
  onMouseleave: undefined,
})
defineSlots<MenubarDropdownSlots>()

const attrs = useAttrs()
const ctx = useMenubarContext()
const menuCtx = useMenubarMenuContext()
const { dir } = useDirection()

function runComposed(
  userHandler: ((event: any) => void) | undefined,
  event: Event,
  internal: (event: any) => void,
) {
  userHandler?.(event)
  if (!event.defaultPrevented) internal(event)
}

function switchToAdjacent(direction: 1 | -1) {
  const nextIndex = ctx.getAdjacentIndex(menuCtx.index, direction)
  if (nextIndex !== menuCtx.index) {
    ctx.setActiveIndex(nextIndex)
    ctx.openMenu(nextIndex, 'click')
    ctx.focusMenuItem(nextIndex, 'first')
  }
}

function handleKeydown(event: KeyboardEvent) {
  runComposed(props.onKeydown, event, () => {
    const target = event.target as HTMLElement

    if (event.key === 'Tab') {
      ctx.focusTarget(menuCtx.index)
      ctx.closeMenu()
      return
    }

    if (target.closest('[data-menu-dropdown]') !== event.currentTarget) return

    const forwardKey = dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    const backKey = dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'

    if (event.key === forwardKey) {
      if (target.closest('[data-menu-item]')?.hasAttribute('data-sub-menu-item')) return
      event.preventDefault()
      switchToAdjacent(1)
    } else if (event.key === backKey) {
      event.preventDefault()
      switchToAdjacent(-1)
    } else if (event.key === 'Escape') {
      const index = menuCtx.index
      ctx.setActiveIndex(index)
      window.setTimeout(() => ctx.focusTarget(index), 0)
    }
  })
}

function handleMouseenter(event: MouseEvent) {
  runComposed(props.onMouseenter, event, () => ctx.cancelClose())
}

function handleMouseleave(event: MouseEvent) {
  runComposed(props.onMouseleave, event, () => {
    if (ctx.trigger === 'hover') ctx.scheduleClose()
  })
}
</script>

<template>
  <MenuDropdown
    v-bind="attrs"
    :data-menubar-dropdown="ctx.id"
    data-mantine-stop-propagation=""
    @keydown="handleKeydown"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <slot />
  </MenuDropdown>
</template>
