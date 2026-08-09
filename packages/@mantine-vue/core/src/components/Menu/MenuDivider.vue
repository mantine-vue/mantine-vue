<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box } from '../../core'
import { useMenuContext } from './Menu.context'
import type { MenuDividerProps } from './Menu.types'

defineOptions({
  name: 'MenuDivider',
  inheritAttrs: false,
})

defineProps<MenuDividerProps>()

const attrs = useAttrs()
const ctx = useMenuContext()

const dividerStyles = computed(() =>
  ctx.getStyles('divider', { className: attrs.class, style: attrs.style }),
)
</script>

<template>
  <Box v-bind="{ ...attrs, ...dividerStyles }" role="separator" />
</template>
