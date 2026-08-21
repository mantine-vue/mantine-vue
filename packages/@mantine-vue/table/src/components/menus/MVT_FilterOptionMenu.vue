<script lang="ts">
import type { MVT_InternalFilterOption, MVT_Localization } from '../../types'

export const mrtFilterOptions = (l: MVT_Localization): MVT_InternalFilterOption[] => [
  { divider: false, label: l.filterFuzzy, option: 'fuzzy', symbol: '≈' },
  { divider: false, label: l.filterContains, option: 'contains', symbol: '*' },
  { divider: false, label: l.filterStartsWith, option: 'startsWith', symbol: 'a' },
  { divider: true, label: l.filterEndsWith, option: 'endsWith', symbol: 'z' },
  { divider: false, label: l.filterEquals, option: 'equals', symbol: '=' },
  { divider: true, label: l.filterNotEquals, option: 'notEquals', symbol: '≠' },
  { divider: false, label: l.filterBetween, option: 'between', symbol: '⇿' },
  { divider: true, label: l.filterBetweenInclusive, option: 'betweenInclusive', symbol: '⬌' },
  { divider: false, label: l.filterGreaterThan, option: 'greaterThan', symbol: '>' },
  {
    divider: false,
    label: l.filterGreaterThanOrEqualTo,
    option: 'greaterThanOrEqualTo',
    symbol: '≥',
  },
  { divider: false, label: l.filterLessThan, option: 'lessThan', symbol: '<' },
  { divider: true, label: l.filterLessThanOrEqualTo, option: 'lessThanOrEqualTo', symbol: '≤' },
  { divider: false, label: l.filterEmpty, option: 'empty', symbol: '∅' },
  { divider: false, label: l.filterNotEmpty, option: 'notEmpty', symbol: '!∅' },
]

const rangeModes = ['between', 'betweenInclusive', 'inNumberRange']
const emptyModes = ['empty', 'notEmpty']
const arrModes = ['arrIncludesSome', 'arrIncludesAll', 'arrIncludes']
const rangeVariants = ['range-slider', 'date-range', 'range']
</script>

<script setup lang="ts">
import { Menu } from '@mantine-vue/core'
import { computed, h, useSlots, type VNodeChild } from 'vue'
import type { MVT_FilterOption, MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import classes from './MVT_FilterOptionMenu.module.css'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTFilterOptionMenu' })

const props = withDefaults(
  defineProps<{
    header?: MVT_Header<MVT_RowData>
    onSelect?: () => void
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { header: undefined, onSelect: undefined },
)

defineSlots<{
  default?: (arg: {
    column?: MVT_Header<MVT_RowData>['column']
    internalFilterOptions: MVT_InternalFilterOption[]
    onSelectFilterMode: (option: MVT_FilterOption) => void
    table: MVT_TableInstance<MVT_RowData>
  }) => any
}>()

const slots = useSlots()

const column = computed(() => props.header?.column)
const columnDef = computed(() => column.value?.columnDef)

const filterOptions = computed(() => {
  const { table } = props
  const def = columnDef.value
  const o = table.options

  let allowed = def?.columnFilterModeOptions ?? o.columnFilterModeOptions
  if (rangeVariants.includes(def?.filterVariant ?? ''))
    allowed = [...rangeModes, ...(allowed ?? [])].filter(
      (mode, index, all) => rangeModes.includes(mode) && all.indexOf(mode) === index,
    ) as MVT_FilterOption[]

  const options = mrtFilterOptions(o.localization).filter((entry) =>
    def
      ? allowed === undefined || allowed?.includes(entry.option as MVT_FilterOption)
      : (!o.globalFilterModeOptions ||
          o.globalFilterModeOptions.includes(entry.option as MVT_FilterOption)) &&
        ['contains', 'fuzzy', 'startsWith'].includes(entry.option),
  )
  // Never leave the list ending on a separator.
  if (options.at(-1)?.divider) options[options.length - 1].divider = false
  return options
})

const selectedOption = computed(() =>
  props.header && columnDef.value
    ? columnDef.value._filterFn
    : props.table.getState().globalFilterFn,
)

const select = (option: MVT_FilterOption) => {
  const { header, table } = props
  const col = column.value
  const def = columnDef.value
  const current = col?.getFilterValue()
  const previous = def?._filterFn ?? ''

  if (!header || !col) table.setGlobalFilterFn(option)
  else if (option !== previous) {
    table.setColumnFilterFns((old) => ({ ...old, [header.id]: option }))
    if (emptyModes.includes(option)) {
      if (current !== ' ' && !emptyModes.includes(previous)) col.setFilterValue(' ')
      else if (current) col.setFilterValue(current)
    } else if (def?.filterVariant === 'multi-select' || arrModes.includes(option)) {
      if (typeof current === 'string' || (current as unknown[])?.length) col.setFilterValue([])
      else if (current) col.setFilterValue(current)
    } else if (rangeVariants.includes(def?.filterVariant ?? '') || rangeModes.includes(option)) {
      if (
        !Array.isArray(current) ||
        (!current.every((value) => value === '') && !rangeModes.includes(previous))
      )
        col.setFilterValue(['', ''])
      else col.setFilterValue(current)
    } else if (Array.isArray(current)) col.setFilterValue('')
    else if (current === ' ' && emptyModes.includes(previous)) col.setFilterValue(undefined)
    else col.setFilterValue(current)
  }
  props.onSelect?.()
}

const symbolSection = (entry: MVT_InternalFilterOption) =>
  h('span', { class: classes.symbol }, entry.symbol)

/**
 * Slot or `renderXFilterModeMenuItems` replacing the built-in list. Resolved as
 * the template branches so each callback runs once per render.
 */
let customItems: VNodeChild
const hasCustomItems = () => {
  const { table } = props
  const def = columnDef.value
  const internalFilterOptions = filterOptions.value

  customItems =
    slots.default?.({
      internalFilterOptions,
      onSelectFilterMode: select,
      column: column.value,
      table,
    }) ??
    (def
      ? (def.renderColumnFilterModeMenuItems?.({
          column: column.value!,
          internalFilterOptions,
          onSelectFilterMode: select,
          table,
        }) ??
        table.options.renderColumnFilterModeMenuItems?.({
          column: column.value!,
          internalFilterOptions,
          onSelectFilterMode: select,
          table,
        }))
      : table.options.renderGlobalFilterModeMenuItems?.({
          internalFilterOptions,
          onSelectFilterMode: select,
          table,
        }))

  return !!customItems
}
const renderCustomItems = () => customItems
</script>

<template>
  <Menu.Dropdown>
    <MVT_RenderNode v-if="hasCustomItems()" :node="renderCustomItems()" />
    <template v-else>
      <template v-for="entry in filterOptions" :key="entry.option">
        <Menu.Item
          :color="entry.option === selectedOption ? 'blue' : undefined"
          :leftSection="symbolSection(entry)"
          :value="entry.option"
          @click="select(entry.option as MVT_FilterOption)"
        >
          {{ entry.label }}
        </Menu.Item>
        <Menu.Divider v-if="entry.divider" />
      </template>
    </template>
  </Menu.Dropdown>
</template>
