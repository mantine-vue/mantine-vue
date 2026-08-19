<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import { ActionIcon, Indicator, Tooltip } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_Header, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { dataVariable } from '../../utils/style.utils'
import classes from './MVT_TableHeadCellSortLabel.module.css'

defineOptions({ name: 'MVTTableHeadCellSortLabel', inheritAttrs: false })

const props = defineProps<{
  header: MVT_Header<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

const attrs = useAttrs()

const column = computed(() => props.header.column)
const sorted = computed(() => column.value.getIsSorted())
const sortIndex = computed(() => column.value.getSortIndex())

const sortTooltip = computed(() => {
  const { localization } = props.table.options
  const { header } = column.value.columnDef
  return sorted.value
    ? sorted.value === 'desc'
      ? localization.sortedByColumnDesc.replace('{column}', header)
      : localization.sortedByColumnAsc.replace('{column}', header)
    : column.value.getNextSortingOrder() === 'desc'
      ? localization.sortByColumnDesc.replace('{column}', header)
      : localization.sortByColumnAsc.replace('{column}', header)
})

const sortIcon = computed(() => {
  const { IconArrowsSort, IconSortAscending, IconSortDescending } = props.table.options.icons
  return sorted.value === 'desc'
    ? IconSortDescending
    : sorted.value === 'asc'
      ? IconSortAscending
      : IconArrowsSort
})

const sortButtonProps = computed(() => ({
  'aria-label': sortTooltip.value,
  ...dataVariable('sorted', sorted.value),
  ...attrs,
  class: clsx('mvt-table-head-sort-button', classes['sort-icon'], attrs.class),
}))

const showSortIndex = computed(
  () => props.table.getState().sorting.length >= 2 && sortIndex.value !== -1,
)

const indicatorProps = computed(() => ({
  classNames: {
    root: clsx('mvt-table-head-multi-sort-indicator', classes['multi-sort-indicator']),
  },
  inline: true,
  label: sortIndex.value + 1,
  offset: 4,
}))
</script>

<template>
  <Tooltip :label="sortTooltip" :openDelay="1000" :withinPortal="true">
    <Indicator v-if="showSortIndex" v-bind="indicatorProps">
      <ActionIcon v-bind="sortButtonProps">
        <component :is="sortIcon" size="100%" />
      </ActionIcon>
    </Indicator>
    <ActionIcon v-else v-bind="sortButtonProps">
      <component :is="sortIcon" size="100%" />
    </ActionIcon>
  </Tooltip>
</template>
