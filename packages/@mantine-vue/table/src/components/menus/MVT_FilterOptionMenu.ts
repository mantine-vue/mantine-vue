import { Menu } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type {
  MVT_FilterOption,
  MVT_Header,
  MVT_InternalFilterOption,
  MVT_Localization,
  MVT_RowData,
  MVT_TableInstance,
} from '../../types'
import classes from './MVT_FilterOptionMenu.module.css'

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

export const MVT_FilterOptionMenu = defineComponent({
  name: 'MVTFilterOptionMenu',
  props: {
    header: { type: Object as PropType<MVT_Header<MVT_RowData>>, default: undefined },
    onSelect: { type: Function as PropType<() => void>, default: undefined },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { slots }) {
    return () => {
      const { table, header } = props
      const o = table.options
      const column = header?.column
      const def = column?.columnDef
      const current = column?.getFilterValue()
      let allowed = def?.columnFilterModeOptions ?? o.columnFilterModeOptions
      if (rangeVariants.includes(def?.filterVariant ?? ''))
        allowed = [...rangeModes, ...(allowed ?? [])].filter(
          (v, i, a) => rangeModes.includes(v) && a.indexOf(v) === i,
        ) as MVT_FilterOption[]
      const options = mrtFilterOptions(o.localization).filter((entry) =>
        def
          ? allowed === undefined || allowed?.includes(entry.option as MVT_FilterOption)
          : (!o.globalFilterModeOptions ||
              o.globalFilterModeOptions.includes(entry.option as MVT_FilterOption)) &&
            ['contains', 'fuzzy', 'startsWith'].includes(entry.option),
      )
      if (options.at(-1)?.divider) options[options.length - 1].divider = false
      const select = (option: MVT_FilterOption) => {
        const previous = def?._filterFn ?? ''
        if (!header || !column) table.setGlobalFilterFn(option)
        else if (option !== previous) {
          table.setColumnFilterFns((old) => ({ ...old, [header.id]: option }))
          if (emptyModes.includes(option)) {
            if (current !== ' ' && !emptyModes.includes(previous)) column.setFilterValue(' ')
            else if (current) column.setFilterValue(current)
          } else if (def?.filterVariant === 'multi-select' || arrModes.includes(option)) {
            if (typeof current === 'string' || (current as unknown[])?.length)
              column.setFilterValue([])
            else if (current) column.setFilterValue(current)
          } else if (
            rangeVariants.includes(def?.filterVariant ?? '') ||
            rangeModes.includes(option)
          ) {
            if (
              !Array.isArray(current) ||
              (!current.every((v) => v === '') && !rangeModes.includes(previous))
            )
              column.setFilterValue(['', ''])
            else column.setFilterValue(current)
          } else if (Array.isArray(current)) column.setFilterValue('')
          else if (current === ' ' && emptyModes.includes(previous))
            column.setFilterValue(undefined)
          else column.setFilterValue(current)
        }
        props.onSelect?.()
      }
      const custom =
        slots.default?.({
          internalFilterOptions: options,
          onSelectFilterMode: select,
          column,
          table,
        }) ??
        (def
          ? (def.renderColumnFilterModeMenuItems?.({
              column: column!,
              internalFilterOptions: options,
              onSelectFilterMode: select,
              table,
            }) ??
            o.renderColumnFilterModeMenuItems?.({
              column: column!,
              internalFilterOptions: options,
              onSelectFilterMode: select,
              table,
            }))
          : o.renderGlobalFilterModeMenuItems?.({
              internalFilterOptions: options,
              onSelectFilterMode: select,
              table,
            }))
      const selected = header && def ? def._filterFn : table.getState().globalFilterFn
      return h(
        Menu.Dropdown,
        null,
        () =>
          custom ??
          options.flatMap((entry) => [
            h(
              Menu.Item,
              {
                color: entry.option === selected ? 'blue' : undefined,
                leftSection: h('span', { class: classes.symbol }, entry.symbol),
                value: entry.option,
                onClick: () => select(entry.option as MVT_FilterOption),
              },
              () => entry.label,
            ),
            entry.divider ? h(Menu.Divider) : null,
          ]),
      )
    }
  },
})
