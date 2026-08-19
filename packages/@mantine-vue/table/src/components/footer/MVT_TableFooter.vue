<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import { TableTfoot } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_ColumnVirtualizer, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_TableFooterRow from './MVT_TableFooterRow.vue'
import classes from './MVT_TableFooter.module.css'

defineOptions({ name: 'MVTTableFooter', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    columnVirtualizer?: MVT_ColumnVirtualizer
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { columnVirtualizer: undefined },
)

const attrs = useAttrs()

const footerGroups = computed<any>(() => props.table.getFooterGroups())

const setFooterRef = (el: any, forwardTo?: { value: HTMLTableSectionElement | null }) => {
  const { tableFooterRef } = props.table.refs
  const node = (el?.$el ?? el) as HTMLTableSectionElement
  tableFooterRef.value = node
  if (forwardTo) forwardTo.value = node
}

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating the wrapper — and with it the
// footer rows below, which depend on more than these props.
const footerProps = () => {
  const { table } = props
  const { enableStickyFooter, layoutMode } = table.options

  const tableFooterProps = {
    ...parseFromValuesOrFunc(table.options.mantineTableFooterProps, { table }),
    ...attrs,
  } as Record<string, any>

  const stickFooter =
    (table.getState().isFullScreen || enableStickyFooter) && enableStickyFooter !== false

  return {
    ...tableFooterProps,
    class: clsx(
      classes.root,
      tableFooterProps.class,
      stickFooter && classes.sticky,
      layoutMode?.startsWith('grid') && classes.grid,
    ),
    ref: (el: any) => setFooterRef(el, tableFooterProps.ref),
  }
}
</script>

<template>
  <TableTfoot v-bind="footerProps()">
    <MVT_TableFooterRow
      v-for="footerGroup in footerGroups"
      :key="footerGroup.id"
      :columnVirtualizer="columnVirtualizer"
      :footerGroup="footerGroup"
      :table="table"
    />
  </TableTfoot>
</template>
