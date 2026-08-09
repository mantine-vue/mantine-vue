<script setup lang="ts">
import { computed } from 'vue'
import {
  InlineStyles,
  filterProps,
  getBaseValue,
  getSortedBreakpoints,
  getSpacing,
  keys,
  useMantineTheme,
} from '../../core'
import {
  getMinColWidthValue,
  isObject,
  type SimpleGridVariablesProps,
} from './simple-grid-variables'

defineOptions({
  name: 'SimpleGridMediaVariables',
})

const props = defineProps<SimpleGridVariablesProps>()

const theme = useMantineTheme()

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

const media = computed(() => {
  const queries = keys(theme.value.breakpoints).reduce<Record<string, Record<string, any>>>(
    (acc, breakpoint) => {
      acc[breakpoint] = acc[breakpoint] ?? {}

      if (isObject(props.spacing) && props.spacing[breakpoint] !== undefined) {
        acc[breakpoint]['--sg-spacing-x'] = getSpacing(props.spacing[breakpoint])
      }

      if (isObject(verticalSpacing.value) && verticalSpacing.value[breakpoint] !== undefined) {
        acc[breakpoint]['--sg-spacing-y'] = getSpacing(verticalSpacing.value[breakpoint])
      }

      if (!useAutoColumns.value && isObject(props.cols) && props.cols[breakpoint] !== undefined) {
        acc[breakpoint]['--sg-cols'] = props.cols[breakpoint]
      }

      return acc
    },
    {},
  )

  // Sorted so the queries are emitted smallest first and later ones win the cascade.
  return getSortedBreakpoints(theme.value.breakpoints).reduce<Record<string, Record<string, any>>>(
    (acc, item) => {
      if (keys(queries[item.breakpoint] ?? {}).length > 0) {
        acc[`(min-width: ${theme.value.breakpoints[item.breakpoint]})`] = queries[item.breakpoint]
      }

      return acc
    },
    {},
  )
})
</script>

<template>
  <InlineStyles :selector="props.selector" :styles="baseStyles" :media="media" />
</template>
