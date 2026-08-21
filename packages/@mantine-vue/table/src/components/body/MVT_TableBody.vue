<script setup lang="ts">
import { computed, shallowRef, useAttrs } from 'vue'

import { TableTbody } from '@mantine-vue/core'

import clsx from 'clsx'

import { useMVT_Rows } from '../../hooks/useMVT_Rows'
import { useMVT_RowVirtualizer } from '../../hooks/useMVT_RowVirtualizer'
import {
  type MVT_ColumnVirtualizer,
  type MVT_Row,
  type MVT_RowData,
  type MVT_TableInstance,
  type MVT_VirtualItem,
} from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_ServerGroupingBody from '../../server-grouping/MVT_ServerGroupingBody.vue'
import MVT_TableBodyEmptyRow from './MVT_TableBodyEmptyRow.vue'
import MVT_TableBodyRow from './MVT_TableBodyRow.vue'
import classes from './MVT_TableBody.module.css'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTTableBody', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    columnVirtualizer?: MVT_ColumnVirtualizer
    table: MVT_TableInstance<MVT_RowData>
    tableProps: Record<string, any>
  }>(),
  { columnVirtualizer: undefined },
)

const attrs = useAttrs()

const rows = useMVT_Rows(props.table)
const rowVirtualizerRef = useMVT_RowVirtualizer(props.table, rows)
// Keep TanStack's shallow ref as the render dependency. The virtualizer mutates
// in place and calls triggerRef when its range changes, so wrapping this ref in
// a computed would suppress updates because the object identity stays the same.
const rowVirtualizer = rowVirtualizerRef ?? shallowRef(undefined)

const isGridLayout = computed(() => !!props.table.options.layoutMode?.startsWith('grid'))
const hasServerGrouping = computed(() => !!(props.table as any)._serverGrouping)

const tableBodyProps = computed(
  () =>
    ({
      ...parseFromValuesOrFunc(props.table.options.mantineTableBodyProps, { table: props.table }),
      ...attrs,
    }) as Record<string, any>,
)

const showTopPinnedBody = computed(
  () =>
    !props.table.options.rowPinningDisplayMode?.includes('sticky') &&
    props.table.getIsSomeRowsPinned('top'),
)
const showBottomPinnedBody = computed(
  () =>
    !props.table.options.rowPinningDisplayMode?.includes('sticky') &&
    props.table.getIsSomeRowsPinned('bottom'),
)

// Element heights are measured, not reactive, so the pinned bodies re-read them
// on every render rather than caching them in a `computed`.
const tableHeadHeight = () => {
  const { table } = props
  return (
    ((table.options.enableStickyHeader || table.getState().isFullScreen) &&
      table.refs.tableHeadRef.value?.clientHeight) ||
    0
  )
}

const tableFooterHeight = () =>
  (props.table.options.enableStickyFooter && props.table.refs.tableFooterRef.value?.clientHeight) ||
  0

const pinnedBodyClass = computed(() =>
  clsx(classes.pinned, isGridLayout.value && classes['root-grid'], tableBodyProps.value.class),
)

const topPinnedBodyProps = () => ({
  ...tableBodyProps.value,
  style: {
    '--mvt-table-head-height': `${tableHeadHeight()}`,
    ...tableBodyProps.value.style,
  },
  class: pinnedBodyClass.value,
})

const bottomPinnedBodyProps = () => ({
  ...tableBodyProps.value,
  style: {
    '--mvt-table-footer-height': `${tableFooterHeight()}`,
    ...tableBodyProps.value.style,
  },
  class: pinnedBodyClass.value,
})

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const mainBodyProps = () => ({
  ...tableBodyProps.value,
  style: {
    '--mvt-table-body-height': rowVirtualizer.value
      ? `${rowVirtualizer.value.getTotalSize()}px`
      : undefined,
    ...tableBodyProps.value.style,
  },
  class: clsx(
    classes.root,
    isGridLayout.value && classes['root-grid'],
    !rows.value.length && classes['root-no-rows'],
    rowVirtualizer.value && classes['root-virtualized'],
    tableBodyProps.value.class,
  ),
})

const pinnedRowIds = computed(() => {
  const { rowPinning } = props.table.getState()
  return !rowPinning.bottom?.length && !rowPinning.top?.length
    ? []
    : props.table
        .getRowModel()
        .rows.filter((row) => row.getIsPinned())
        .map((row) => row.id)
})

/**
 * Virtualized runs address rows by index, and skip the odd slots that a detail
 * panel occupies. Plain runs iterate the resolved rows directly.
 */
const renderedRows = computed(() => {
  const virtualizer = rowVirtualizer.value
  const currentRows = rows.value
  const { renderDetailPanel } = props.table.options

  return ((virtualizer?.virtualRows ?? currentRows) as unknown[])
    .map((rowOrVirtualRow, renderedRowIndex) => {
      let index = renderedRowIndex
      if (virtualizer) {
        if (renderDetailPanel) {
          if ((rowOrVirtualRow as MVT_VirtualItem).index % 2 === 1) return null
          index = (rowOrVirtualRow as MVT_VirtualItem).index / 2
        } else {
          index = (rowOrVirtualRow as MVT_VirtualItem).index
        }
      }
      const row = virtualizer ? currentRows[index] : (rowOrVirtualRow as MVT_Row<MVT_RowData>)
      if (!row) return null
      return {
        index,
        row,
        virtualRow: virtualizer ? (rowOrVirtualRow as MVT_VirtualItem) : undefined,
      }
    })
    .filter((entry) => entry !== null)
})

const commonRowProps = computed(() => ({
  columnVirtualizer: props.columnVirtualizer,
  numRows: rows.value.length,
  table: props.table,
  tableProps: props.tableProps,
}))

const renderBodyChildren = () => tableBodyProps.value.children
</script>

<template>
  <TableTbody v-if="showTopPinnedBody" v-bind="topPinnedBodyProps()">
    <MVT_TableBodyRow
      v-for="(row, renderedRowIndex) in table.getTopRows()"
      :key="`${row.id}-${row.index}`"
      v-bind="commonRowProps"
      :renderedRowIndex="renderedRowIndex"
      :row="row"
    />
  </TableTbody>
  <TableTbody v-bind="mainBodyProps()">
    <MVT_RenderNode v-if="tableBodyProps.children" :node="renderBodyChildren()" />
    <MVT_ServerGroupingBody v-else-if="hasServerGrouping" :table="table" :tableProps="tableProps" />
    <MVT_TableBodyEmptyRow v-else-if="!rows.length" v-bind="commonRowProps" />
    <template v-else>
      <MVT_TableBodyRow
        v-for="rendered in renderedRows"
        :key="`${rendered.row.id}-${rendered.row.index}`"
        v-bind="commonRowProps"
        :pinnedRowIds="pinnedRowIds"
        :renderedRowIndex="rendered.index"
        :row="rendered.row"
        :rowVirtualizer="rowVirtualizer"
        :virtualRow="rendered.virtualRow"
      />
    </template>
  </TableTbody>
  <TableTbody v-if="showBottomPinnedBody" v-bind="bottomPinnedBodyProps()">
    <MVT_TableBodyRow
      v-for="(row, renderedRowIndex) in table.getBottomRows()"
      :key="`${row.id}-${row.index}`"
      v-bind="commonRowProps"
      :renderedRowIndex="renderedRowIndex"
      :row="row"
    />
  </TableTbody>
</template>
