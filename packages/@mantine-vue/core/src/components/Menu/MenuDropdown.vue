<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { omitAttrs } from '../../core'
import { PopoverDropdown } from '../Popover'
import { useMenuContext } from './Menu.context'
import { call, focusAt, menuItems } from './menu-utils'
import type { MenuDropdownProps, MenuSlots } from './Menu.types'

defineOptions({
  name: 'MenuDropdown',
  inheritAttrs: false,
})

defineProps<MenuDropdownProps>()

defineSlots<MenuSlots>()

const attrs = useAttrs()
const ctx = useMenuContext()

/** Typeahead buffer: consecutive letters jump to the first item that starts with them. */
let query = ''
let queryTimer: ReturnType<typeof setTimeout> | undefined

/**
 * The consumer handler is chained explicitly below, so it must not also reach the
 * element through the fallthrough attributes or it would fire twice.
 */
const dropdownAttrs = computed(() => omitAttrs(attrs, ['onKeydown']))

const dropdownStyles = computed(() =>
  ctx.getStyles('dropdown', { className: attrs.class, style: attrs.style }),
)

const onMouseenter = computed(() => (ctx.trigger !== 'click' ? ctx.openDropdown : undefined))
const onMouseleave = computed(() => (ctx.trigger !== 'click' ? ctx.closeDropdown : undefined))

function onKeydown(event: KeyboardEvent) {
  call((attrs as any).onKeydown, event)

  // With a search field the keys belong to it, and `Menu.Search` drives the navigation.
  if (event.defaultPrevented || ctx.hasSearch) {
    return
  }

  const root = event.currentTarget as HTMLElement
  const active = document.activeElement as HTMLElement

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusAt(root, active, 1, ctx.loop)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusAt(root, active, -1, ctx.loop)
  } else if (event.key === 'Home') {
    event.preventDefault()
    menuItems(root)[0]?.focus()
  } else if (event.key === 'End') {
    event.preventDefault()
    menuItems(root).at(-1)?.focus()
  } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    query += event.key.toLowerCase()
    clearTimeout(queryTimer)
    queryTimer = setTimeout(() => (query = ''), 500)

    const match = menuItems(root).find((item) =>
      item.textContent?.trim().toLowerCase().startsWith(query),
    )

    match?.focus()
  }
}

/**
 * Without it the focus trap would land on the first item and highlight it, which is not
 * what the menu pattern wants. A search field takes the focus instead.
 */
const withPlaceholder = computed(() => ctx.withInitialFocusPlaceholder && !ctx.hasSearch)
</script>

<template>
  <PopoverDropdown
    v-bind="{ ...dropdownAttrs, ...dropdownStyles }"
    role="menu"
    data-menu-dropdown=""
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
    @keydown="onKeydown"
  >
    <div
      v-if="withPlaceholder"
      role="presentation"
      :tabindex="-1"
      :data-autofocus="true"
      :data-mantine-stop-propagation="true"
      :style="{ outline: 0 }"
    />
    <slot />
  </PopoverDropdown>
</template>
