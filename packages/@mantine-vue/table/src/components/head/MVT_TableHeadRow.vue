<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import { Box, TableTr } from '@mantine-vue/core'

import clsx from 'clsx'

import {
  type MVT_ColumnVirtualizer,
  type MVT_Header,
  type MVT_HeaderGroup,
  type MVT_RowData,
  type MVT_TableInstance,
  type MVT_VirtualItem,
} from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_TableHeadCell from './MVT_TableHeadCell.vue'
import classes from './MVT_TableHeadRow.module.css'

defineOptions({ name: 'MVTTableHeadRow', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    columnVirtualizer?: MVT_ColumnVirtualizer
    headerGroup: MVT_HeaderGroup<MVT_RowData>
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { columnVirtualizer: undefined },
)

const attrs = useAttrs()

const virtualPaddingLeft = computed(() => props.columnVirtualizer?.virtualPaddingLeft)
const virtualPaddingRight = computed(() => props.columnVirtualizer?.virtualPaddingRight)

/** Virtualized runs address headers by index into the group; plain runs iterate them directly. */
const renderedHeaders = computed(() => {
  const { columnVirtualizer, headerGroup } = props
  return (columnVirtualizer?.virtualColumns ?? headerGroup.headers).map(
    (headerOrVirtualHeader, renderedHeaderIndex) => {
      const index = columnVirtualizer
        ? (headerOrVirtualHeader as MVT_VirtualItem).index
        : renderedHeaderIndex
      const header = columnVirtualizer
        ? headerGroup.headers[index]
        : (headerOrVirtualHeader as MVT_Header<MVT_RowData>)
      return { header, index }
    },
  )
})

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const rowProps = () => {
  const { table } = props
  const { enableStickyHeader, layoutMode } = table.options

  const tableRowProps = {
    ...parseFromValuesOrFunc(table.options.mantineTableHeadRowProps, {
      headerGroup: props.headerGroup,
      table,
    }),
    ...attrs,
  } as Record<string, any>

  return {
    ...tableRowProps,
    class: clsx(
      classes.root,
      (enableStickyHeader || table.getState().isFullScreen) && classes.sticky,
      layoutMode?.startsWith('grid') && classes['layout-mode-grid'],
      tableRowProps.class,
    ),
  }
}
</script>

<template>
  <TableTr v-bind="rowProps()">
    <Box v-if="virtualPaddingLeft" component="th" display="flex" :w="virtualPaddingLeft" />
    <MVT_TableHeadCell
      v-for="rendered in renderedHeaders"
      :key="rendered.header.id"
      :columnVirtualizer="columnVirtualizer"
      :header="rendered.header"
      :renderedHeaderIndex="rendered.index"
      :table="table"
    />
    <Box v-if="virtualPaddingRight" component="th" display="flex" :w="virtualPaddingRight" />
  </TableTr>
</template>
