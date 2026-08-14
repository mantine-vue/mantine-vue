<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box } from '../../../core'
import { PaginationDotsIcon } from '../Pagination.icons'
import { usePaginationContext } from '../Pagination.context'
import type { PaginationDotsOwnProps, PaginationDotsSlots } from './PaginationDots.types'

defineOptions({ name: 'PaginationDots', inheritAttrs: false })
const props = withDefaults(defineProps<PaginationDotsOwnProps>(), {
  rootRef: undefined,
  icon: undefined,
})
defineSlots<PaginationDotsSlots>()
const attrs = useAttrs()
const ctx = usePaginationContext()

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box
    :rootRef="setRootRef"
    v-bind="{
      ...attrs,
      ...ctx.getStyles('dots', { className: attrs.class, style: attrs.style as any }),
    }"
    component="span"
  >
    <slot name="icon"><component :is="props.icon || PaginationDotsIcon" /></slot>
  </Box>
</template>
