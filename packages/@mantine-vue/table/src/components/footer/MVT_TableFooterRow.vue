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
import MVT_TableFooterCell from './MVT_TableFooterCell.vue'
import classes from './MVT_TableFooterRow.module.css'

defineOptions({ name: 'MVTTableFooterRow', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    columnVirtualizer?: MVT_ColumnVirtualizer
    footerGroup: MVT_HeaderGroup<MVT_RowData>
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { columnVirtualizer: undefined },
)

const attrs = useAttrs()

const hasContent = computed(() =>
  props.footerGroup.headers?.some(
    (header) =>
      (typeof header.column.columnDef.footer === 'string' && !!header.column.columnDef.footer) ||
      header.column.columnDef.Footer,
  ),
)

const virtualPaddingLeft = computed(() => props.columnVirtualizer?.virtualPaddingLeft)
const virtualPaddingRight = computed(() => props.columnVirtualizer?.virtualPaddingRight)

/** Virtualized runs address footers by index into the group; plain runs iterate them directly. */
const renderedFooters = computed(() => {
  const { columnVirtualizer, footerGroup } = props
  return (columnVirtualizer?.virtualColumns ?? footerGroup.headers).map(
    (footerOrVirtualFooter, renderedColumnIndex) => {
      const index = columnVirtualizer
        ? (footerOrVirtualFooter as MVT_VirtualItem).index
        : renderedColumnIndex
      const footer = columnVirtualizer
        ? footerGroup.headers[index]
        : (footerOrVirtualFooter as MVT_Header<MVT_RowData>)
      return { footer, index }
    },
  )
})

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const rowProps = (): any => ({
  class: clsx(
    classes.root,
    props.table.options.layoutMode?.startsWith('grid') && classes['layout-mode-grid'],
  ),
  ...parseFromValuesOrFunc(props.table.options.mantineTableFooterRowProps, {
    footerGroup: props.footerGroup,
    table: props.table,
  }),
  ...attrs,
})
</script>

<template>
  <TableTr v-if="hasContent" v-bind="rowProps()">
    <Box v-if="virtualPaddingLeft" component="th" display="flex" :w="virtualPaddingLeft" />
    <MVT_TableFooterCell
      v-for="rendered in renderedFooters"
      :key="rendered.footer.id"
      :footer="rendered.footer"
      :renderedColumnIndex="rendered.index"
      :table="table"
    />
    <Box v-if="virtualPaddingRight" component="th" display="flex" :w="virtualPaddingRight" />
  </TableTr>
</template>
