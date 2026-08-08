<script setup lang="ts">
import { computed } from 'vue'
import { DOTS } from '@mantine-vue/hooks'
import { PaginationControl } from '../PaginationControl/PaginationControl'
import { PaginationDots } from '../PaginationDots/PaginationDots'
import { usePaginationContext } from '../Pagination.context'
import type { PaginationItemsProps } from './PaginationItems.types'

defineOptions({ name: 'PaginationItems' })
const props = withDefaults(defineProps<PaginationItemsProps>(), { dotsIcon: undefined })

const ctx = usePaginationContext()
const items = computed(() =>
  ctx.range.map((page, index) => {
    if (page === DOTS) {
      return { type: 'dots' as const, key: `dots-${index}` }
    }

    const itemProps = ctx.getItemProps?.(page) ?? {}
    const { children, onClick, ...attrs } = itemProps
    return { type: 'page' as const, key: page, page, attrs, children, onClick }
  }),
)

function renderContent(content: unknown, page: number) {
  return () => content ?? page
}

function handleClick(
  item: Extract<(typeof items.value)[number], { type: 'page' }>,
  event: MouseEvent,
) {
  item.onClick?.(event)
  ctx.onChange(item.page)
}
</script>

<template>
  <template v-for="item in items" :key="item.key">
    <PaginationDots v-if="item.type === 'dots'" :icon="props.dotsIcon" />
    <PaginationControl
      v-else
      v-bind="item.attrs"
      :active="item.page === ctx.active"
      :disabled="ctx.disabled"
      :aria-label="item.attrs['aria-label'] ?? `${item.page}`"
      :aria-current="item.page === ctx.active ? 'page' : undefined"
      @click="handleClick(item, $event)"
    >
      <component :is="renderContent(item.children, item.page)" />
    </PaginationControl>
  </template>
</template>
