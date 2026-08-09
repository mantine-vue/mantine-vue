<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '../../../core'
import { PaginationDotsIcon } from '../Pagination.icons'
import { usePaginationContext } from '../Pagination.context'
import type { PaginationDotsOwnProps, PaginationDotsSlots } from './PaginationDots.types'

defineOptions({ name: 'PaginationDots', inheritAttrs: false })
const props = withDefaults(defineProps<PaginationDotsOwnProps>(), { icon: undefined })
defineSlots<PaginationDotsSlots>()
const attrs = useAttrs()
const ctx = usePaginationContext()
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('dots', { className: attrs.class, style: attrs.style as any }),
    }"
    component="span"
  >
    <slot name="icon"><component :is="props.icon || PaginationDotsIcon" /></slot>
  </Box>
</template>
