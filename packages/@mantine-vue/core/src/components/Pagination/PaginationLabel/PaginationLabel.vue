<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '../../../core'
import { usePaginationContext } from '../Pagination.context'
import type { PaginationLabelSlots } from './PaginationLabel.types'
defineOptions({ name: 'PaginationLabel', inheritAttrs: false })
defineSlots<PaginationLabelSlots>()
const attrs = useAttrs()
const ctx = usePaginationContext()
</script>
<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('label', { className: attrs.class, style: attrs.style as any }),
    }"
    component="span"
    ><slot :active="ctx.active" :total="ctx.total"
      >Page {{ ctx.active }} of {{ ctx.total }}</slot
    ></Box
  >
</template>
