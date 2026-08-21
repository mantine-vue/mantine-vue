<script setup lang="ts">
import clsx from 'clsx'
import { ActionIcon, Popover, Tooltip, Transition as MantineTransition } from '@mantine-vue/core'
import { computed, ref, useAttrs } from 'vue'
import { localizedFilterOption } from '../../fns/filterFns'
import type { MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import { dataVariable } from '../../utils/style.utils'
import MVT_TableHeadCellFilterContainer from './MVT_TableHeadCellFilterContainer.vue'
import classes from './MVT_TableHeadCellFilterLabel.module.css'

defineOptions({ name: 'MVTTableHeadCellFilterLabel', inheritAttrs: false })

const props = defineProps<{
  header: MVT_Header<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

const attrs = useAttrs()
const popoverOpened = ref(false)

const column = computed(() => props.header.column)
const columnDef = computed(() => column.value.columnDef)
const filterValue = computed(() => column.value.getFilterValue())

const isActive = computed(() =>
  Array.isArray(filterValue.value) ? filterValue.value.some(Boolean) : !!filterValue.value,
)

const isRange = computed(() => {
  const def = columnDef.value
  return (
    def.filterVariant === 'range' ||
    def.filterVariant === 'date-range' ||
    ['between', 'betweenInclusive', 'inNumberRange'].includes(def._filterFn)
  )
})

const tooltipLabel = computed(() => {
  const { localization, columnFilterDisplayMode } = props.table.options
  const def = columnDef.value
  const value = filterValue.value

  if (columnFilterDisplayMode === 'popover' && !isActive.value)
    return localization.filterByColumn.replace('{column}', String(def.header))

  const format = def.filterTooltipValueFn ?? ((entry: unknown) => String(entry ?? ''))
  const displayed = Array.isArray(value)
    ? value
        .map((entry) => format(entry))
        .join(`" ${isRange.value ? localization.and : localization.or} "`)
    : format(value)

  return localization.filteringByColumn
    .replace('{column}', String(def.header))
    .replace('{filterType}', localizedFilterOption(localization, def._filterFn))
    .replace('{filterValue}', `"${displayed}"`)
    .replace('" "', '')
})

const showIcon = computed(() => {
  const value = filterValue.value
  return (
    props.table.options.columnFilterDisplayMode === 'popover' ||
    (!!value && !isRange.value) ||
    (isRange.value && (!!(value as unknown[])?.[0] || !!(value as unknown[])?.[1]))
  )
})

const isPopoverMode = computed(() => props.table.options.columnFilterDisplayMode === 'popover')

const handleClick = (event: MouseEvent) => {
  event.stopPropagation()
  if (isPopoverMode.value) popoverOpened.value = !popoverOpened.value
  else props.table.setShowColumnFilters(true)
  setTimeout(() => {
    const input = props.table.refs.filterInputRefs.value[`${column.value.id}-0`]
    input?.focus()
    input?.select()
  }, 100)
}

const iconProps = computed(() => ({
  'aria-label': tooltipLabel.value,
  class: clsx('mvt-table-head-cell-filter-label-icon', classes.root),
  size: 18,
  ...dataVariable('active', isActive.value),
  ...attrs,
  onClick: handleClick,
}))

const closeOnEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter') popoverOpened.value = false
}
const stopPropagation = (event: Event) => event.stopPropagation()
</script>

<template>
  <Popover
    :keepMounted="columnDef.filterVariant === 'range-slider'"
    :opened="popoverOpened"
    position="top"
    shadow="xl"
    :width="360"
    :withinPortal="true"
    @change="popoverOpened = $event"
  >
    <MantineTransition :mounted="showIcon" transition="scale">
      <Popover.Target>
        <Tooltip
          :disabled="popoverOpened"
          :label="tooltipLabel"
          :multiline="true"
          :w="tooltipLabel.length > 40 ? 300 : undefined"
          :withinPortal="true"
        >
          <ActionIcon v-bind="iconProps">
            <component :is="table.options.icons.IconFilter" size="100%" />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
    </MantineTransition>
    <Popover.Dropdown
      v-if="isPopoverMode"
      @click="stopPropagation"
      @keydown="closeOnEnter"
      @mousedown="stopPropagation"
    >
      <MVT_TableHeadCellFilterContainer :header="header" :table="table" />
    </Popover.Dropdown>
  </Popover>
</template>
