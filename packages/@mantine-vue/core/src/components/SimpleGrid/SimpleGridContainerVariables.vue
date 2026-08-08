<script setup lang="ts">
import { computed } from 'vue'
import { InlineStyles, filterProps, getBaseValue, getSpacing } from '../../core'
import {
  getBreakpoints,
  getMinColWidthValue,
  isObject,
  sortBreakpoints,
  type SimpleGridVariablesProps,
} from './simple-grid-variables'

defineOptions({
  name: 'SimpleGridContainerVariables',
})

const props = defineProps<SimpleGridVariablesProps>()

/** Vertical spacing falls back to the horizontal one when it is not set. */
const verticalSpacing = computed(() =>
  props.verticalSpacing === undefined ? props.spacing : props.verticalSpacing,
)

/** A minimum column width switches the grid to auto-fit, where a column count is meaningless. */
const useAutoColumns = computed(() => props.minColWidth !== undefined)

const baseStyles = computed(() =>
  filterProps({
    '--sg-spacing-x': getSpacing(getBaseValue(props.spacing)),
    '--sg-spacing-y': getSpacing(getBaseValue(verticalSpacing.value)),
    '--sg-auto-rows': props.autoRows,
    ...(useAutoColumns.value
      ? { '--sg-min-col-width': getMinColWidthValue(props.minColWidth) }
      : { '--sg-cols': getBaseValue(props.cols)?.toString() }),
  }),
)

/**
 * Container queries are not bound to `theme.breakpoints`: the breakpoints are whatever
 * keys the responsive values themselves use, so they have to be collected and sorted.
 */
const container = computed(() => {
  const breakpoints = sortBreakpoints(
    Array.from(
      new Set([
        ...getBreakpoints(props.spacing),
        ...getBreakpoints(verticalSpacing.value),
        ...(useAutoColumns.value ? [] : getBreakpoints(props.cols)),
      ]),
    ),
  )

  return breakpoints.reduce<Record<string, Record<string, any>>>((acc, breakpoint) => {
    const query = `simple-grid (min-width: ${breakpoint})`
    acc[query] = {}

    if (isObject(props.spacing) && props.spacing[breakpoint] !== undefined) {
      acc[query]['--sg-spacing-x'] = getSpacing(props.spacing[breakpoint])
    }

    if (isObject(verticalSpacing.value) && verticalSpacing.value[breakpoint] !== undefined) {
      acc[query]['--sg-spacing-y'] = getSpacing(verticalSpacing.value[breakpoint])
    }

    if (!useAutoColumns.value && isObject(props.cols) && props.cols[breakpoint] !== undefined) {
      acc[query]['--sg-cols'] = props.cols[breakpoint]
    }

    return acc
  }, {})
})
</script>

<template>
  <InlineStyles :selector="props.selector" :styles="baseStyles" :container="container" />
</template>
