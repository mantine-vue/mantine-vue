<script setup lang="ts">
import { computed, nextTick, useAttrs } from 'vue'
import { omitAttrs } from '../../core'
import MenuDropdown from './MenuDropdown.vue'
import { useMenuContext } from './Menu.context'
import { call } from './menu-utils'
import type { MenuSlots, MenuSubDropdownProps } from './Menu.types'

defineOptions({
  name: 'MenuSubDropdown',
  inheritAttrs: false,
})

defineProps<MenuSubDropdownProps>()

defineSlots<MenuSlots>()

const attrs = useAttrs()
const ctx = useMenuContext()

/**
 * The consumer handler is chained explicitly below, so it must not also reach
 * `MenuDropdown` through the fallthrough attributes or it would fire twice.
 */
const dropdownAttrs = computed(() => omitAttrs(attrs, ['onKeydown']))

function onKeydown(event: KeyboardEvent) {
  call((attrs as any).onKeydown, event)

  if (event.defaultPrevented) {
    return
  }

  const currentDropdown = event.currentTarget as HTMLElement
  const focused = event.target as HTMLElement

  // Only when the focus is in *this* dropdown, not in a submenu of it – otherwise the
  // key would close every level at once.
  if (event.key === 'ArrowLeft' && focused.closest('[data-menu-dropdown]') === currentDropdown) {
    event.preventDefault()

    // The parent target points at this dropdown with `aria-controls`, which is the only
    // link back up the tree.
    const id = currentDropdown.id
    const parentTarget = id ? document.querySelector<HTMLElement>(`[aria-controls="${id}"]`) : null

    ctx.closeDropdownImmediately()
    nextTick(() => parentTarget?.focus({ preventScroll: true }))
  }
}
</script>

<template>
  <MenuDropdown v-bind="dropdownAttrs" @keydown="onKeydown">
    <slot />
  </MenuDropdown>
</template>
