<script setup lang="ts">
import { computed, h, useAttrs, type Ref, type VNodeChild } from 'vue'

import { Collapse, TableTd, TableTr } from '@mantine-vue/core'

import clsx from 'clsx'

import {
  type MVT_Row,
  type MVT_RowData,
  type MVT_RowVirtualizer,
  type MVT_TableInstance,
  type MVT_VirtualItem,
} from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_EditCellTextInput from '../inputs/MVT_EditCellTextInput.vue'
import { renderMVT_Renderable, useMVT_Slots } from '../MVT_TableSlots'
import classes from './MVT_TableDetailPanel.module.css'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTTableDetailPanel', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    parentRowRef: Ref<HTMLTableRowElement | null>
    renderedRowIndex?: number
    row: MVT_Row<MVT_RowData>
    rowVirtualizer?: MVT_RowVirtualizer
    striped?: boolean | string
    table: MVT_TableInstance<MVT_RowData>
    virtualRow?: MVT_VirtualItem
  }>(),
  { renderedRowIndex: 0, rowVirtualizer: undefined, striped: undefined, virtualRow: undefined },
)

const attrs = useAttrs()
const mvtSlots = useMVT_Slots()

const isGridLayout = computed(() => !!props.table.options.layoutMode?.startsWith('grid'))

const setRowRef = (el: any) => {
  const node = (el?.$el ?? el) as HTMLTableRowElement
  if (node) props.rowVirtualizer?.measureElement?.(node)
}

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const rowProps = (): any => {
  const { renderedRowIndex, row, striped, table, virtualRow } = props
  const tableRowProps = (parseFromValuesOrFunc(table.options.mantineTableBodyRowProps, {
    isDetailPanel: true,
    row,
    table,
  }) ?? {}) as Record<string, any>

  return {
    'data-index': table.options.renderDetailPanel ? renderedRowIndex * 2 + 1 : renderedRowIndex,
    'data-striped': striped,
    ref: setRowRef,
    ...tableRowProps,
    style: {
      '--mvt-parent-row-height': virtualRow
        ? `${props.parentRowRef.value?.getBoundingClientRect()?.height}px`
        : undefined,
      '--mvt-virtual-row-start': virtualRow ? `${virtualRow.start}px` : undefined,
      ...tableRowProps.style,
    },
    class: clsx(
      'mantine-Table-tr-detail-panel',
      classes.root,
      isGridLayout.value && classes['root-grid'],
      virtualRow && classes['root-virtual-row'],
      tableRowProps.class,
    ),
  }
}

/** The row's edit inputs, as vnodes, so a custom panel can lay them out itself. */
const internalEditComponents = () =>
  props.row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => h(MVT_EditCellTextInput, { cell, key: cell.id, table: props.table }))

/**
 * The resolved panel is needed both for the cell's padding and as its content.
 * `cellProps()` resolves it, and the children read the cached value — props are
 * evaluated before children, so the order holds.
 */
let detailPanelNode: VNodeChild | false = false

const cellProps = (): any => {
  const { row, table } = props

  detailPanelNode =
    !table.getState().isLoading &&
    row.getIsExpanded() &&
    renderMVT_Renderable(mvtSlots.detailPanel, table.options.renderDetailPanel, {
      internalEditComponents: internalEditComponents(),
      row,
      table,
    })

  return {
    colspan: table.getVisibleLeafColumns().length,
    component: 'td',
    ...parseFromValuesOrFunc(table.options.mantineDetailPanelProps, { row, table }),
    ...attrs,
    style: { '--mvt-inner-width': `${table.getTotalSize()}px` },
    class: clsx(
      'mantine-Table-td-detail-panel',
      classes.inner,
      isGridLayout.value && classes['inner-grid'],
      row.getIsExpanded() && classes['inner-expanded'],
      props.virtualRow && classes['inner-virtual'],
    ),
    p: row.getIsExpanded() && detailPanelNode ? 'md' : 0,
  }
}

const renderDetailPanel = () => detailPanelNode
</script>

<template>
  <TableTr v-bind="rowProps()">
    <TableTd v-bind="cellProps()">
      <MVT_RenderNode v-if="rowVirtualizer" :node="renderDetailPanel()" />
      <Collapse v-else :expanded="row.getIsExpanded()">
        <MVT_RenderNode :node="renderDetailPanel()" />
      </Collapse>
    </TableTd>
  </TableTr>
</template>
