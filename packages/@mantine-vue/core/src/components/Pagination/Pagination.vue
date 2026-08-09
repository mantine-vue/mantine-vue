<script lang="ts">
const defaultProps = {
  withControls: true,
  withPages: true,
  siblings: 1,
  boundaries: 1,
  gap: 8,
} as const

export { defaultProps }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useProps } from '../../core'
import { Group } from '../Group'
import {
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from './PaginationEdges/PaginationEdges'
import { PaginationItems, PaginationItemsGroup } from './PaginationItems/PaginationItems'
import { PaginationLabel } from './PaginationLabel/PaginationLabel'
import { PaginationRoot } from './PaginationRoot/PaginationRoot'
import type { PaginationOwnProps } from './Pagination.types'

defineOptions({
  name: 'Pagination',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<PaginationOwnProps>(), {
  withControls: undefined,
  withPages: undefined,
  withEdges: false,
  hideWithOnePage: false,
  disabled: false,
  autoContrast: undefined,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [page: number]
  change: [page: number]
}>()

const attrs = useAttrs()
const props = useProps('Pagination', defaultProps, rawProps)

const visible = computed(() => props.total > 0 && !(props.hideWithOnePage && props.total === 1))

/** The responsive layout collapses the page list into a "n of m" label. */
const isResponsive = computed(() => props.withPages && props.layout === 'responsive')

const rootProps = computed(() => ({
  total: props.total,
  modelValue: props.modelValue,
  defaultValue: props.defaultValue,
  'onUpdate:modelValue': (page: number) => {
    emit('update:modelValue', page)
    emit('change', page)
  },
  siblings: props.siblings,
  boundaries: props.boundaries,
  color: props.color,
  radius: props.radius,
  size: props.size,
  disabled: props.disabled,
  autoContrast: props.autoContrast,
  getItemProps: props.getItemProps,
  layout: props.layout,
  classNames: props.classNames,
  styles: props.styles,
  vars: props.vars,
  unstyled: props.unstyled,
}))
</script>

<template>
  <PaginationRoot v-if="visible" v-bind="{ ...attrs, ...rootProps }">
    <Group :gap="props.gap" wrap="nowrap">
      <PaginationFirst v-if="props.withEdges" />
      <PaginationPrevious v-if="props.withControls" />

      <template v-if="isResponsive">
        <PaginationItemsGroup />
        <PaginationLabel />
      </template>
      <PaginationItems v-else-if="props.withPages" />

      <PaginationNext v-if="props.withControls" />
      <PaginationLast v-if="props.withEdges" />
    </Group>
  </PaginationRoot>
</template>
