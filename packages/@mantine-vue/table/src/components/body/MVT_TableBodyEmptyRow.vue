<script setup lang="ts">
import { computed } from 'vue'

import { createRow } from '@tanstack/vue-table'

import { TableTd, Text } from '@mantine-vue/core'

import clsx from 'clsx'

import {
  type MVT_ColumnVirtualizer,
  type MVT_Row,
  type MVT_RowData,
  type MVT_TableInstance,
} from '../../types'
import MVT_ExpandButton from '../buttons/MVT_ExpandButton.vue'
import MVT_TableBodyRow from './MVT_TableBodyRow.vue'
import classes from './MVT_TableBody.module.css'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTTableBodyEmptyRow', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    columnVirtualizer?: MVT_ColumnVirtualizer
    numRows?: number
    table: MVT_TableInstance<MVT_RowData>
    tableProps: Record<string, any>
  }>(),
  { columnVirtualizer: undefined, numRows: undefined },
)

const emptyRow = createRow(
  props.table as any,
  'mvt-row-empty',
  {} as MVT_RowData,
  0,
  0,
) as MVT_Row<MVT_RowData>

const isGridLayout = computed(() => !!props.table.options.layoutMode?.startsWith('grid'))

const rowClass = computed(() =>
  clsx('mvt-table-body-row', isGridLayout.value && classes['empty-row-tr-grid']),
)

const cellClass = computed(() =>
  clsx('mvt-table-body-cell', isGridLayout.value && classes['empty-row-td-grid']),
)

// The paper width is measured, not reactive, so it is read on every render.
const fallbackStyle = () => ({
  '--mvt-paper-width': `${props.table.refs.tablePaperRef.value?.clientWidth}`,
})

const emptyMessage = computed(() => {
  const { columnFilters, globalFilter } = props.table.getState()
  const { localization } = props.table.options
  return globalFilter || columnFilters.length
    ? localization.noResultsFound
    : localization.noRecordsToDisplay
})

const hasCustomFallback = () => !!props.table.options.renderEmptyRowsFallback
const renderCustomFallback = () =>
  props.table.options.renderEmptyRowsFallback?.({ table: props.table })
</script>

<template>
  <MVT_TableBodyRow
    :columnVirtualizer="columnVirtualizer"
    :numRows="numRows"
    :class="rowClass"
    :renderedRowIndex="0"
    :row="emptyRow"
    :table="table"
    :tableProps="tableProps"
    :virtualRow="undefined"
  >
    <TableTd v-if="table.options.renderDetailPanel" :class="cellClass" :colspan="1">
      <MVT_ExpandButton :row="emptyRow" :table="table" />
    </TableTd>
    <td :class="cellClass" :colspan="table.getVisibleLeafColumns().length">
      <MVT_RenderNode v-if="hasCustomFallback()" :node="renderCustomFallback()" />
      <Text v-else :style="fallbackStyle()" :class="clsx(classes['empty-row-td-content'])">
        {{ emptyMessage }}
      </Text>
    </td>
  </MVT_TableBodyRow>
</template>
