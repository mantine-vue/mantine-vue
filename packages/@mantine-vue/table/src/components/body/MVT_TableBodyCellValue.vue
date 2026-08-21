<script lang="ts">
const allowedTypes = ['string', 'number']
const allowedFilterVariants = ['text', 'autocomplete']
</script>

<script setup lang="ts">
import { h } from 'vue'

import { Highlight } from '@mantine-vue/core'

import { type MVT_Cell, type MVT_Node, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTTableBodyCellValue' })

const props = withDefaults(
  defineProps<{
    cell: MVT_Cell<MVT_RowData>
    renderedColumnIndex?: number
    renderedRowIndex?: number
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { renderedColumnIndex: 0, renderedRowIndex: 0 },
)

/**
 * Resolves the cell down to a single renderable value: aggregated/grouped
 * overrides first, then optional filter-match highlighting, then the column's
 * own `Cell` renderer. Kept as a render function because the result can be a
 * string, a number, or a vnode.
 */
const renderCellValue = () => {
  const { cell, renderedColumnIndex, renderedRowIndex, table } = props
  const { enableFilterMatchHighlighting, mantineHighlightProps = { size: 'sm' } } = table.options
  const { column, row } = cell
  const { columnDef } = column
  const { globalFilter, globalFilterFn } = table.getState()
  const filterValue = column.getFilterValue()

  const highlightProps = parseFromValuesOrFunc(mantineHighlightProps, {
    cell,
    column,
    row,
    table,
  }) as Record<string, any>

  let renderedCellValue: MVT_Node | number | string | undefined =
    cell.getIsAggregated() && columnDef.AggregatedCell
      ? columnDef.AggregatedCell({ cell, column, row, table })
      : row.getIsGrouped() && !cell.getIsGrouped()
        ? null
        : cell.getIsGrouped() && columnDef.GroupedCell
          ? columnDef.GroupedCell({ cell, column, row, table })
          : undefined

  const isGroupedValue = renderedCellValue !== undefined

  if (!isGroupedValue) {
    renderedCellValue = cell.renderValue() as number | string
  }

  if (
    enableFilterMatchHighlighting &&
    columnDef.enableFilterMatchHighlighting !== false &&
    renderedCellValue &&
    allowedTypes.includes(typeof renderedCellValue) &&
    ((filterValue &&
      allowedTypes.includes(typeof filterValue) &&
      allowedFilterVariants.includes(columnDef.filterVariant as string)) ||
      (globalFilter && allowedTypes.includes(typeof globalFilter) && column.getCanGlobalFilter()))
  ) {
    let highlight: string | string[] = (
      column.getFilterValue() ??
      globalFilter ??
      ''
    ).toString() as string
    if ((filterValue ? columnDef._filterFn : globalFilterFn) === 'fuzzy') {
      highlight = highlight.split(' ')
    }
    const text = renderedCellValue.toString()

    renderedCellValue = h(
      Highlight,
      { color: 'yellow.3', highlight, ...highlightProps } as any,
      () => text,
    )
  }

  if (columnDef.Cell && !isGroupedValue) {
    renderedCellValue = columnDef.Cell({
      cell,
      column,
      renderedCellValue,
      renderedColumnIndex,
      renderedRowIndex,
      row,
      table,
    })
  }

  return renderedCellValue
}
</script>

<template>
  <MVT_RenderNode :node="renderCellValue()" />
</template>
