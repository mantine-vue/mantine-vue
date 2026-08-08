<script lang="ts">
import { createVarsResolver, getSpacing, getThemeColor, rem } from '../../core'

const defaultProps = {
  withRowBorders: true,
  verticalSpacing: 7,
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>(
  (
    theme,
    {
      layout,
      captionSide,
      horizontalSpacing,
      verticalSpacing,
      borderColor,
      stripedColor,
      highlightOnHoverColor,
      striped,
      highlightOnHover,
      stickyHeaderOffset,
      stickyHeader,
    },
  ) => ({
    table: {
      '--table-layout': layout,
      '--table-caption-side': captionSide,
      '--table-horizontal-spacing': getSpacing(horizontalSpacing),
      '--table-vertical-spacing': getSpacing(verticalSpacing),
      '--table-border-color': borderColor ? getThemeColor(borderColor, theme) : undefined,
      '--table-striped-color':
        striped && stripedColor ? getThemeColor(stripedColor, theme) : undefined,
      '--table-highlight-on-hover-color':
        highlightOnHover && highlightOnHoverColor
          ? getThemeColor(highlightOnHoverColor, theme)
          : undefined,
      '--table-sticky-header-offset': stickyHeader ? rem(stickyHeaderOffset) : undefined,
    },
  }),
)

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { provideTableContext } from './Table.context'
import { TableDataRenderer } from './TableDataRenderer'
import type { TableOwnProps, TableSlots } from './Table.types'
import classes from './Table.module.css'

defineOptions({
  name: 'Table',
  inheritAttrs: false,
})

/**
 * Intentionally undefined to preserve downstream defaults.
 */
const rawProps = withDefaults(defineProps<TableOwnProps>(), {
  withTableBorder: false,
  withColumnBorders: false,
  withRowBorders: undefined,
  striped: false,
  highlightOnHover: false,
  stickyHeader: false,
  tabularNums: false,
  unstyled: false,
})

defineSlots<TableSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('Table', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'Table',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

/**
 * Getters keep the provided object reactive. The table elements read these to decide
 * which `data-` attributes they carry.
 */
provideTableContext({
  getStyles,
  get stickyHeader() {
    return props.stickyHeader
  },
  get striped() {
    // `true` is shorthand for shading the odd rows.
    return props.striped === true ? 'odd' : props.striped || undefined
  },
  get highlightOnHover() {
    return props.highlightOnHover
  },
  get withColumnBorders() {
    return props.withColumnBorders
  },
  get withRowBorders() {
    return props.withRowBorders
  },
  get captionSide() {
    return props.captionSide || 'bottom'
  },
})

const tableStyles = computed(() =>
  getStyles('table', { className: attrs.class, style: attrs.style as any }),
)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...tableStyles }"
    component="table"
    :variant="props.variant"
    :mod="[{ withTableBorder: props.withTableBorder, tabularNums: props.tabularNums }, props.mod]"
  >
    <slot v-if="slots.default" />
    <TableDataRenderer v-else-if="props.data" :data="props.data" />
  </Box>
</template>
