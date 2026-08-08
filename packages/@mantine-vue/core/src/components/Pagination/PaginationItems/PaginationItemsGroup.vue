<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '../../../core'
import { usePaginationContext } from '../Pagination.context'
import PaginationItems from './PaginationItems.vue'

defineOptions({ name: 'PaginationItemsGroup', inheritAttrs: false })

const attrs = useAttrs()
const ctx = usePaginationContext()
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('items', { className: attrs.class, style: attrs.style as any }),
    }"
  >
    <PaginationItems />
  </Box>
</template>
