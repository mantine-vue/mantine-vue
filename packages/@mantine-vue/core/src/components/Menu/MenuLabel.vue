<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box } from '../../core'
import { useMenuContext } from './Menu.context'
import type { MenuLabelProps, MenuSlots } from './Menu.types'

defineOptions({
  name: 'MenuLabel',
  inheritAttrs: false,
})

defineProps<MenuLabelProps>()

defineSlots<MenuSlots>()

const attrs = useAttrs()
const ctx = useMenuContext()

const labelStyles = computed(() =>
  ctx.getStyles('label', { className: attrs.class, style: attrs.style }),
)
</script>

<template>
  <Box v-bind="{ ...attrs, ...labelStyles }">
    <slot />
  </Box>
</template>
