<script setup lang="ts">
import { useAttrs } from 'vue'
import { PopoverDropdown } from '../../Popover'
import { useHoverCardContext } from '../HoverCard.context'
import type { HoverCardDropdownSlots } from './HoverCardDropdown.types'

defineOptions({ name: 'HoverCardDropdown', inheritAttrs: false })
defineSlots<HoverCardDropdownSlots>()

const attrs = useAttrs()
const ctx = useHoverCardContext()

/**
 * A consumer `@mouseenter`/`@mouseleave` listener reaches the element through the
 * `v-bind="attrs"` spread below and is merged with this handler by Vue automatically –
 * no dedicated callback prop is needed to let internal logic hook in as well.
 */
function handleMouseenter() {
  ctx.openDropdown()
}

function handleMouseleave() {
  ctx.closeDropdown()
}
</script>

<template>
  <PopoverDropdown v-bind="attrs" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
    <slot />
  </PopoverDropdown>
</template>
