<script lang="ts">
import {
  PaginationFirstIcon,
  PaginationLastIcon,
  PaginationNextIcon,
  PaginationPreviousIcon,
} from '../Pagination.icons'
import type { PaginationEdgeKind } from './PaginationEdges.types'

/**
 * Everything that differs between the four edge controls, keyed by edge. Declared at
 * module scope so the lookup is shared by every instance.
 */
const EDGES: Record<
  PaginationEdgeKind,
  {
    icon: any
    label: string
    isAtEdge: (ctx: any) => boolean
    action: (ctx: any) => () => void
  }
> = {
  next: {
    icon: PaginationNextIcon,
    label: 'Next page',
    isAtEdge: (ctx) => ctx.active >= ctx.total,
    action: (ctx) => ctx.onNext,
  },
  previous: {
    icon: PaginationPreviousIcon,
    label: 'Previous page',
    isAtEdge: (ctx) => ctx.active <= 1,
    action: (ctx) => ctx.onPrevious,
  },
  first: {
    icon: PaginationFirstIcon,
    label: 'First page',
    isAtEdge: (ctx) => ctx.active <= 1,
    action: (ctx) => ctx.onFirst,
  },
  last: {
    icon: PaginationLastIcon,
    label: 'Last page',
    isAtEdge: (ctx) => ctx.active >= ctx.total,
    action: (ctx) => ctx.onLast,
  },
}

export { EDGES }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { usePaginationContext } from '../Pagination.context'
import { PaginationControl } from '../PaginationControl/PaginationControl'
import type { PaginationEdgeOwnProps } from './PaginationEdges.types'

defineOptions({
  name: 'PaginationEdge',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PaginationEdgeOwnProps & { __edge: PaginationEdgeKind }>(), {
  icon: undefined,
  disabled: false,
})

defineSlots<{ icon?: () => any }>()

const attrs = useAttrs()
const ctx = usePaginationContext()

const edge = computed(() => EDGES[props.__edge])
const IconComponent = computed(() => props.icon ?? edge.value.icon)
const disabled = computed(() => props.disabled || ctx.disabled || edge.value.isAtEdge(ctx))

function onClick() {
  if (!disabled.value) {
    edge.value.action(ctx)()
  }
}
</script>

<template>
  <PaginationControl
    v-bind="attrs"
    :disabled="disabled"
    :with-padding="false"
    :aria-label="(attrs['aria-label'] as string) ?? edge.label"
    @click="onClick"
  >
    <slot name="icon">
      <component :is="IconComponent" class="mantine-rotate-rtl" />
    </slot>
  </PaginationControl>
</template>
