<script lang="ts">
import type { StyleProp } from '../../core'
import type { GridBreakpoints } from './Grid.context'

/** Props of `GridVariables`. This component is internal to `Grid`. */
export interface GridVariablesProps {
  /** CSS selector the generated variables are scoped to. */
  selector: string

  /** Gap between the columns and the rows. */
  gap?: StyleProp<string | number>

  /** Gap between the rows. */
  rowGap?: StyleProp<string | number>

  /** Gap between the columns. */
  columnGap?: StyleProp<string | number>

  /** Breakpoints the responsive values are resolved against. Defaults to `theme.breakpoints`. */
  breakpoints?: GridBreakpoints

  /** Whether the responsive values use container queries or media queries. */
  type?: 'container' | 'media'
}

/** A responsive value is an object keyed by breakpoint; anything else is a base value. */
function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export { isObject }
</script>

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

defineOptions({
  name: 'GridVariables',
})

const props = defineProps<GridVariablesProps>()

const theme = useMantineTheme()

const breakpoints = computed(() => props.breakpoints || theme.value.breakpoints)

/** Values that apply below the smallest breakpoint. */
const baseStyles = computed(() =>
  filterProps({
    '--grid-gap': getSpacing(getBaseValue(props.gap)),
    '--grid-row-gap': getSpacing(getBaseValue(props.rowGap)),
    '--grid-column-gap': getSpacing(getBaseValue(props.columnGap)),
  }),
)

/** One block of variables per breakpoint, keyed by the query they belong in. */
const values = computed(() => {
  const queries = keys(breakpoints.value).reduce<Record<string, Record<string, any>>>(
    (acc, breakpoint) => {
      acc[breakpoint] = {}

      if (isObject(props.gap) && props.gap[breakpoint] !== undefined) {
        acc[breakpoint]['--grid-gap'] = getSpacing(props.gap[breakpoint])
      }

      if (isObject(props.rowGap) && props.rowGap[breakpoint] !== undefined) {
        acc[breakpoint]['--grid-row-gap'] = getSpacing(props.rowGap[breakpoint])
      }

      if (isObject(props.columnGap) && props.columnGap[breakpoint] !== undefined) {
        acc[breakpoint]['--grid-column-gap'] = getSpacing(props.columnGap[breakpoint])
      }

      return acc
    },
    {},
  )

  // Sorted so the queries are emitted smallest first and later ones win the cascade.
  return getSortedBreakpoints(breakpoints.value).reduce<Record<string, Record<string, any>>>(
    (acc, item) => {
      if (keys(queries[item.breakpoint] ?? {}).length > 0) {
        const query =
          props.type === 'container'
            ? `mantine-grid (min-width: ${breakpoints.value[item.breakpoint]})`
            : `(min-width: ${breakpoints.value[item.breakpoint]})`
        acc[query] = queries[item.breakpoint]
      }

      return acc
    },
    {},
  )
})

const media = computed(() => (props.type === 'container' ? undefined : values.value))
const container = computed(() => (props.type === 'container' ? values.value : undefined))
</script>

<template>
  <InlineStyles
    :selector="props.selector"
    :styles="baseStyles"
    :media="media"
    :container="container"
  />
</template>
