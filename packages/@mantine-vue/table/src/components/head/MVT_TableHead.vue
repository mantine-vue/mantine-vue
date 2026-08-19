<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import { TableTh, TableThead, TableTr } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_ColumnVirtualizer, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_ToolbarAlertBanner from '../toolbar/MVT_ToolbarAlertBanner.vue'
import MVT_TableHeadRow from './MVT_TableHeadRow.vue'
import classes from './MVT_TableHead.module.css'

defineOptions({ name: 'MVTTableHead', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    columnVirtualizer?: MVT_ColumnVirtualizer
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { columnVirtualizer: undefined },
)

const attrs = useAttrs()

const isGridLayout = computed(() => !!props.table.options.layoutMode?.startsWith('grid'))
const stickyHeader = computed(
  () => props.table.options.enableStickyHeader || props.table.getState().isFullScreen,
)

const showBannerRow = computed(() => {
  const { table } = props
  return (
    table.options.positionToolbarAlertBanner === 'head-overlay' &&
    (table.getState().showAlertBanner || table.getSelectedRowModel().rows.length > 0)
  )
})

const headerGroups = computed(() => props.table.getHeaderGroups())

const setHeadRef = (el: any, forwardTo?: { value: HTMLTableSectionElement | null }) => {
  const { tableHeadRef } = props.table.refs
  const node = (el?.$el ?? el) as HTMLTableSectionElement
  tableHeadRef.value = node
  if (forwardTo) forwardTo.value = node
}

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating the wrapper — and with it the
// header rows below, which depend on more than these props.
const headProps = () => {
  const { table } = props
  const tableHeadProps = {
    ...parseFromValuesOrFunc(table.options.mantineTableHeadProps, { table }),
    ...attrs,
  } as Record<string, any>

  return {
    ...tableHeadProps,
    class: clsx(
      classes.root,
      isGridLayout.value ? classes['root-grid'] : classes['root-table-row-group'],
      stickyHeader.value && classes['root-sticky'],
      tableHeadProps.class,
    ),
    pos: stickyHeader.value && isGridLayout.value ? 'sticky' : 'relative',
    ref: (el: any) => setHeadRef(el, tableHeadProps.ref),
  }
}
</script>

<template>
  <TableThead v-bind="headProps()">
    <TableTr v-if="showBannerRow" :class="clsx(classes['banner-tr'], isGridLayout && classes.grid)">
      <TableTh
        :class="clsx(classes['banner-th'], isGridLayout && classes.grid)"
        :colspan="table.getVisibleLeafColumns().length"
      >
        <MVT_ToolbarAlertBanner :table="table" />
      </TableTh>
    </TableTr>
    <template v-else>
      <MVT_TableHeadRow
        v-for="headerGroup in headerGroups"
        :key="headerGroup.id"
        :columnVirtualizer="columnVirtualizer"
        :headerGroup="headerGroup"
        :table="table"
      />
    </template>
  </TableThead>
</template>
