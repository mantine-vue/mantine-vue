<script lang="ts">
import type { MVT_DensityState } from '../../types'

const defaultRowHeightByDensity: Record<MVT_DensityState, number> = {
  lg: 61,
  md: 53,
  sm: 45,
  xl: 69,
  xs: 37,
}
</script>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

import { Box, TableTr } from '@mantine-vue/core'

import clsx from 'clsx'

import {
  type MVT_Cell,
  type MVT_ColumnVirtualizer,
  type MVT_Row,
  type MVT_RowData,
  type MVT_RowVirtualizer,
  type MVT_TableInstance,
  type MVT_VirtualItem,
} from '../../types'
import { getIsRowSelected } from '../../utils/row.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { useMVT_Slots } from '../MVT_TableSlots'
import MVT_TableBodyCell from './MVT_TableBodyCell.vue'
import MVT_TableDetailPanel from './MVT_TableDetailPanel.vue'
import classes from './MVT_TableBodyRow.module.css'

defineOptions({ name: 'MVTTableBodyRow', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    columnVirtualizer?: MVT_ColumnVirtualizer
    numRows?: number
    pinnedRowIds?: string[]
    renderedRowIndex?: number
    row: MVT_Row<MVT_RowData>
    rowVirtualizer?: MVT_RowVirtualizer
    table: MVT_TableInstance<MVT_RowData>
    tableProps: Record<string, any>
    virtualRow?: MVT_VirtualItem
  }>(),
  {
    columnVirtualizer: undefined,
    numRows: undefined,
    pinnedRowIds: undefined,
    renderedRowIndex: 0,
    rowVirtualizer: undefined,
    virtualRow: undefined,
  },
)

defineSlots<{ default?: () => any }>()

const attrs = useAttrs()
const mvtSlots = useMVT_Slots()

const rowRef = ref<HTMLTableRowElement | null>(null)

// Cells and the detail panel take the ref object itself. A plain `:rowRef="rowRef"`
// binding would hand them the unwrapped element instead.
const getRowRef = () => rowRef

const isGridLayout = computed(() => !!props.table.options.layoutMode?.startsWith('grid'))

// Injected slots are not reactive, so this stays a plain function.
const hasDetailPanel = () => !!(props.table.options.renderDetailPanel || mvtSlots.detailPanel)

const virtualPaddingLeft = computed(() => props.columnVirtualizer?.virtualPaddingLeft)
const virtualPaddingRight = computed(() => props.columnVirtualizer?.virtualPaddingRight)

/** Virtualized runs address cells by index into the visible set; plain runs iterate them. */
const renderedCells = computed(() => {
  const { columnVirtualizer, row } = props
  const visibleCells = row.getVisibleCells()
  return (columnVirtualizer?.virtualColumns ?? visibleCells).map(
    (cellOrVirtualCell, renderedColumnIndex) => {
      const index = columnVirtualizer
        ? (cellOrVirtualCell as MVT_VirtualItem).index
        : renderedColumnIndex
      const cell = columnVirtualizer
        ? visibleCells[index]
        : (cellOrVirtualCell as MVT_Cell<MVT_RowData>)
      return {
        cell,
        index,
        virtualCell: columnVirtualizer ? (cellOrVirtualCell as MVT_VirtualItem) : undefined,
      }
    },
  )
})

const isRowPinned = computed(() => props.table.options.enableRowPinning && props.row.getIsPinned())

const isRowStickyPinned = computed(
  () =>
    isRowPinned.value && props.table.options.rowPinningDisplayMode?.includes('sticky') && 'sticky',
)

const tableRowProps = computed(
  () =>
    ({
      ...parseFromValuesOrFunc(props.table.options.mantineTableBodyRowProps, {
        renderedRowIndex: props.renderedRowIndex,
        row: props.row,
        table: props.table,
      }),
      ...attrs,
    }) as Record<string, any>,
)

/** Mantine's `striped` is resolved per row so pinned/detail rows can inherit it. */
const striped = computed(() => {
  let value = props.tableProps.striped as boolean | string
  if (value) {
    if (value === true) value = 'odd'
    if (value === 'odd' && props.renderedRowIndex % 2 !== 0) value = false
    if (value === 'even' && props.renderedRowIndex % 2 === 0) value = false
  }
  return value
})

// Reads measured element heights, which are not reactive, so it re-derives on
// every render instead of caching in a `computed`.
const rowStyle = () => {
  const { pinnedRowIds, row, table, virtualRow } = props
  const { enableStickyFooter, enableStickyHeader } = table.options
  const { density, isFullScreen } = table.getState()
  const { tableFooterRef, tableHeadRef } = table.refs

  const [bottomPinnedIndex, topPinnedIndex] =
    !table.options.enableRowPinning ||
    !isRowStickyPinned.value ||
    !pinnedRowIds ||
    !row.getIsPinned()
      ? [undefined, undefined]
      : [[...pinnedRowIds].reverse().indexOf(row.id), pinnedRowIds.indexOf(row.id)]

  const tableHeadHeight =
    ((enableStickyHeader || isFullScreen) && tableHeadRef.value?.clientHeight) || 0
  const tableFooterHeight = (enableStickyFooter && tableFooterRef.value?.clientHeight) || 0

  const rowHeight =
    parseInt(tableRowProps.value.style?.height, 10) ||
    (defaultRowHeightByDensity[density] ?? defaultRowHeightByDensity['md'])

  return {
    ...tableRowProps.value.style,
    '--mvt-pinned-row-bottom':
      !virtualRow && bottomPinnedIndex !== undefined && isRowPinned.value
        ? `${bottomPinnedIndex * rowHeight + (enableStickyFooter ? tableFooterHeight - 1 : 0)}`
        : undefined,
    '--mvt-pinned-row-top': virtualRow
      ? undefined
      : topPinnedIndex !== undefined && isRowPinned.value
        ? `${topPinnedIndex * rowHeight + (enableStickyHeader || isFullScreen ? tableHeadHeight - 1 : 0)}`
        : undefined,
    '--mvt-virtual-row-start': virtualRow ? `${virtualRow.start}` : undefined,
  }
}

const handleDragEnter = () => {
  if (props.table.options.enableRowOrdering && props.table.getState().draggingRow) {
    props.table.setHoveredRow(props.row)
  }
}

const setRowRef = (el: any) => {
  const node = (el?.$el ?? el) as HTMLTableRowElement
  if (node) {
    rowRef.value = node
    props.rowVirtualizer?.measureElement?.(node)
  }
}

const rowBindings = () => {
  const { renderedRowIndex, row, table, virtualRow } = props
  const { draggingRow, hoveredRow } = table.getState()

  return {
    'data-dragging-row': draggingRow?.id === row.id || undefined,
    'data-hovered-row-target': hoveredRow?.id === row.id || undefined,
    'data-index': hasDetailPanel() ? renderedRowIndex * 2 : renderedRowIndex,
    'data-row-pinned': isRowStickyPinned.value || isRowPinned.value || undefined,
    'data-selected': getIsRowSelected({ row, table }) || undefined,
    'data-striped': striped.value,
    onDragenter: handleDragEnter,
    ref: setRowRef,
    ...tableRowProps.value,
    style: rowStyle(),
    class: clsx(
      classes.root,
      isGridLayout.value && classes['root-grid'],
      virtualRow && classes['root-virtualized'],
      tableRowProps.value.class,
    ),
  }
}

const showDetailPanelRow = () => hasDetailPanel() && !props.row.getIsGrouped()
</script>

<template>
  <TableTr v-bind="rowBindings()">
    <Box v-if="virtualPaddingLeft" component="td" display="flex" :w="virtualPaddingLeft" />
    <slot>
      <MVT_TableBodyCell
        v-for="rendered in renderedCells"
        :key="rendered.cell.id"
        :cell="rendered.cell"
        :numRows="numRows"
        :renderedColumnIndex="rendered.index"
        :renderedRowIndex="renderedRowIndex"
        :rowRef="getRowRef()"
        :table="table"
        :virtualCell="rendered.virtualCell"
      />
    </slot>
    <Box v-if="virtualPaddingRight" component="td" display="flex" :w="virtualPaddingRight" />
  </TableTr>
  <MVT_TableDetailPanel
    v-if="showDetailPanelRow()"
    :parentRowRef="getRowRef()"
    :renderedRowIndex="renderedRowIndex"
    :row="row"
    :rowVirtualizer="rowVirtualizer"
    :striped="striped"
    :table="table"
    :virtualRow="virtualRow"
  />
</template>
