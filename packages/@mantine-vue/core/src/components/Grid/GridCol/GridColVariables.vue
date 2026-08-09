<script lang="ts">
import type { AlignItems, StyleProp } from '../../../core'

export type ColSpan = number | 'auto' | 'content'

/** Props of `GridColVariables`. This component is internal to `Grid.Col`. */
export interface GridColVariablesProps {
  /** CSS selector the generated variables are scoped to. */
  selector: string

  /** Number of columns the col spans, or `auto`/`content`. */
  span?: StyleProp<ColSpan>

  /** `order` of the col. */
  order?: StyleProp<number>

  /** Number of columns the col is offset by. */
  offset?: StyleProp<number>

  /** `align-self` of the col. */
  align?: StyleProp<AlignItems>
}

/** A responsive value is an object keyed by breakpoint; anything else is a base value. */
function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * `content` sizes to its content and `auto` fills the remaining space, so neither has a
 * percentage basis. Everything else subtracts its share of the column gap.
 */
const getColumnFlexBasis = (span: ColSpan | undefined, columns: number) => {
  if (span === 'content') {
    return 'auto'
  }

  if (span === 'auto') {
    return '0rem'
  }

  if (!span) {
    return undefined
  }

  if (span === columns) {
    return '100%'
  }

  const percentage = (100 * span) / columns
  const gapFactor = (columns - span) / columns
  return `calc(${percentage}% - ${gapFactor} * var(--grid-column-gap))`
}

const getColumnMaxWidth = (span: ColSpan | undefined, columns: number, grow?: boolean) => {
  if (grow || span === 'auto') {
    return '100%'
  }

  if (span === 'content') {
    return 'unset'
  }

  return getColumnFlexBasis(span, columns)
}

const getColumnFlexGrow = (span: ColSpan | undefined, grow?: boolean) => {
  if (!span) {
    return undefined
  }

  return span === 'auto' || grow ? '1' : 'auto'
}

/** Mirrors `getColumnFlexBasis`, but adds the gap instead of subtracting it. */
const getColumnOffset = (offset: number | undefined, columns: number) => {
  if (offset === 0) {
    return '0'
  }

  if (!offset) {
    return undefined
  }

  const percentage = (100 * offset) / columns
  const gapFactor = offset / columns
  return `calc(${percentage}% + ${gapFactor} * var(--grid-column-gap))`
}

export { isObject, getColumnFlexBasis, getColumnFlexGrow, getColumnMaxWidth, getColumnOffset }
</script>

<script setup lang="ts">
import { computed } from 'vue'
import {
  InlineStyles,
  filterProps,
  getBaseValue,
  getSortedBreakpoints,
  keys,
  useMantineTheme,
} from '../../../core'
import { useGridContext } from '../Grid.context'

defineOptions({
  name: 'GridColVariables',
})

const props = defineProps<GridColVariablesProps>()

const theme = useMantineTheme()
const ctx = useGridContext()

const breakpoints = computed(() => ctx.breakpoints || theme.value.breakpoints)

/** Values that apply below the smallest breakpoint. A col spans the full grid by default. */
const baseStyles = computed(() => {
  const baseSpan = (getBaseValue(props.span) ?? 12) as ColSpan
  const baseOrder = getBaseValue(props.order as any) as number | undefined
  const baseOffset = getBaseValue(props.offset as any) as number | undefined
  const baseAlign = getBaseValue(props.align as any) as string | undefined

  return filterProps({
    '--col-order': baseOrder?.toString(),
    '--col-flex-grow': getColumnFlexGrow(baseSpan, ctx.grow),
    '--col-flex-basis': getColumnFlexBasis(baseSpan, ctx.columns),
    '--col-width': baseSpan === 'content' ? 'auto' : undefined,
    '--col-max-width': getColumnMaxWidth(baseSpan, ctx.columns, ctx.grow),
    '--col-offset': getColumnOffset(baseOffset, ctx.columns),
    '--col-align-self': baseAlign,
  })
})

/** One block of variables per breakpoint, keyed by the query they belong in. */
const values = computed(() => {
  const queries = keys(breakpoints.value).reduce<Record<string, Record<string, any>>>(
    (acc, breakpoint) => {
      acc[breakpoint] = {}

      if (isObject(props.order) && props.order[breakpoint] !== undefined) {
        acc[breakpoint]['--col-order'] = props.order[breakpoint]?.toString()
      }

      if (isObject(props.span) && props.span[breakpoint] !== undefined) {
        const span = props.span[breakpoint] as ColSpan
        acc[breakpoint]['--col-flex-grow'] = getColumnFlexGrow(span, ctx.grow)
        acc[breakpoint]['--col-flex-basis'] = getColumnFlexBasis(span, ctx.columns)
        acc[breakpoint]['--col-width'] = span === 'content' ? 'auto' : undefined
        acc[breakpoint]['--col-max-width'] = getColumnMaxWidth(span, ctx.columns, ctx.grow)
      }

      if (isObject(props.offset) && props.offset[breakpoint] !== undefined) {
        acc[breakpoint]['--col-offset'] = getColumnOffset(props.offset[breakpoint], ctx.columns)
      }

      const responsiveAlign = isObject(props.align)
        ? (props.align as Record<string, AlignItems>)[breakpoint]
        : undefined

      if (responsiveAlign !== undefined) {
        acc[breakpoint]['--col-align-self'] = responsiveAlign
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
          ctx.type === 'container'
            ? `mantine-grid (min-width: ${breakpoints.value[item.breakpoint]})`
            : `(min-width: ${breakpoints.value[item.breakpoint]})`
        acc[query] = queries[item.breakpoint]
      }

      return acc
    },
    {},
  )
})

const media = computed(() => (ctx.type === 'container' ? undefined : values.value))
const container = computed(() => (ctx.type === 'container' ? values.value : undefined))
</script>

<template>
  <InlineStyles
    :selector="props.selector"
    :styles="baseStyles"
    :media="media"
    :container="container"
  />
</template>
