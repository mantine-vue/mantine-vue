<script setup lang="ts">
import { computed, useAttrs, type CSSProperties } from 'vue'

import { TableTh, useDirection, useMantineTheme } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_Header, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseCSSVarId } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_TableFooterCell.module.css'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTTableFooterCell', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    footer: MVT_Header<MVT_RowData>
    renderedColumnIndex?: number
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { renderedColumnIndex: undefined },
)

const attrs = useAttrs()
const direction = useDirection()
const theme = useMantineTheme()

const column = computed(() => props.footer.column)
const columnDef = computed(() => column.value.columnDef)

const isColumnPinned = computed(
  () =>
    props.table.options.enableColumnPinning &&
    columnDef.value.columnDefType !== 'group' &&
    column.value.getIsPinned(),
)

const tableCellProps = computed(() => {
  const context = { column: column.value, table: props.table }
  return {
    ...parseFromValuesOrFunc(props.table.options.mantineTableFooterCellProps, context),
    ...parseFromValuesOrFunc(columnDef.value.mantineTableFooterCellProps, context),
    ...attrs,
  } as Record<string, any>
})

const widthStyles = computed(() => {
  const { footer, table } = props
  const { layoutMode } = table.options
  const def = columnDef.value

  const styles: CSSProperties = {
    minWidth: `max(calc(var(--header-${parseCSSVarId(footer?.id)}-size) * 1px), ${def.minSize ?? 30}px)`,
    width: `calc(var(--header-${parseCSSVarId(footer.id)}-size) * 1px)`,
  }
  if (layoutMode === 'grid') {
    styles.flex = `${
      [0, false].includes(def.grow!) ? 0 : `var(--header-${parseCSSVarId(footer.id)}-size)`
    } 0 auto`
  } else if (layoutMode === 'grid-no-grow') {
    styles.flex = `${+(def.grow || 0)} 0 auto`
  }
  return styles
})

const cellStyle = computed(() => {
  const pinned = isColumnPinned.value
  return {
    ...widthStyles.value,
    '--mvt-cell-align':
      tableCellProps.value.align ??
      (columnDef.value.columnDefType === 'group'
        ? 'center'
        : direction.dir.value === 'rtl'
          ? 'right'
          : 'left'),
    '--mvt-table-cell-left': pinned === 'left' ? `${column.value.getStart(pinned)}` : undefined,
    '--mvt-table-cell-right': pinned === 'right' ? `${column.value.getAfter(pinned)}` : undefined,
    ...parseFromValuesOrFunc(tableCellProps.value.style, theme),
  }
})

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const cellProps = () => {
  const { footer, renderedColumnIndex, table } = props
  const pinned = isColumnPinned.value
  const tableCellRest = { ...tableCellProps.value }
  delete tableCellRest.children

  return {
    colspan: footer.colSpan,
    'data-column-pinned': pinned || undefined,
    'data-first-right-pinned':
      (pinned === 'right' && column.value.getIsFirstColumn(pinned)) || undefined,
    'data-index': renderedColumnIndex,
    'data-last-left-pinned':
      (pinned === 'left' && column.value.getIsLastColumn(pinned)) || undefined,
    ...tableCellRest,
    class: clsx(
      classes.root,
      table.options.layoutMode?.startsWith('grid') && classes.grid,
      columnDef.value.columnDefType === 'group' && classes.group,
      tableCellProps.value.class,
    ),
    style: cellStyle.value,
  }
}

const renderContent = () => {
  const { footer, table } = props
  return (
    tableCellProps.value.children ??
    (footer.isPlaceholder
      ? null
      : (parseFromValuesOrFunc(columnDef.value.Footer, { column: column.value, footer, table }) ??
        columnDef.value.footer ??
        null))
  )
}
</script>

<template>
  <TableTh v-bind="cellProps()">
    <MVT_RenderNode :node="renderContent()" />
  </TableTh>
</template>
