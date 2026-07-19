import clsx from 'clsx'
import { ActionIcon, Popover, Tooltip, Transition } from '@mantine-vue/core'
import { defineComponent, h, ref, type PropType } from 'vue'
import { localizedFilterOption } from '../../fns/filterFns'
import type { MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import { dataVariable } from '../../utils/style.utils'
import { MVT_TableHeadCellFilterContainer } from './MVT_TableHeadCellFilterContainer'
import classes from './MVT_TableHeadCellFilterLabel.module.css'

export const MVT_TableHeadCellFilterLabel = defineComponent({
  name: 'MVTTableHeadCellFilterLabel',
  inheritAttrs: false,
  props: {
    header: { type: Object as PropType<MVT_Header<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs }) {
    const popoverOpened = ref(false)
    return () => {
      const { header, table } = props
      const { column } = header
      const def = column.columnDef
      const o = table.options
      const value = column.getFilterValue()
      const active = Array.isArray(value) ? value.some(Boolean) : !!value
      const range =
        def.filterVariant === 'range' ||
        def.filterVariant === 'date-range' ||
        ['between', 'betweenInclusive', 'inNumberRange'].includes(def._filterFn)
      const format =
        def.filterTooltipValueFn ?? ((filterValue: unknown) => String(filterValue ?? ''))
      const displayed = Array.isArray(value)
        ? value
            .map((entry) => format(entry))
            .join(`" ${range ? o.localization.and : o.localization.or} "`)
        : format(value)
      const tooltip =
        o.columnFilterDisplayMode === 'popover' && !active
          ? o.localization.filterByColumn.replace('{column}', String(def.header))
          : o.localization.filteringByColumn
              .replace('{column}', String(def.header))
              .replace('{filterType}', localizedFilterOption(o.localization, def._filterFn))
              .replace('{filterValue}', `"${displayed}"`)
              .replace('" "', '')
      const showIcon =
        o.columnFilterDisplayMode === 'popover' ||
        (!!value && !range) ||
        (range && (!!(value as unknown[])?.[0] || !!(value as unknown[])?.[1]))
      const click = (event: MouseEvent) => {
        event.stopPropagation()
        if (o.columnFilterDisplayMode === 'popover') popoverOpened.value = !popoverOpened.value
        else table.setShowColumnFilters(true)
        setTimeout(() => {
          const input = table.refs.filterInputRefs.value[`${column.id}-0`]
          input?.focus()
          input?.select()
        }, 100)
      }
      return h(
        Popover,
        {
          keepMounted: def.filterVariant === 'range-slider',
          opened: popoverOpened.value,
          position: 'top',
          shadow: 'xl',
          width: 360,
          withinPortal: true,
          onChange: (opened: boolean) => {
            popoverOpened.value = opened
          },
        },
        () => [
          h(Transition, { mounted: showIcon, transition: 'scale' } as any, () =>
            h(Popover.Target, null, () =>
              h(
                Tooltip,
                {
                  disabled: popoverOpened.value,
                  label: tooltip,
                  multiline: true,
                  w: tooltip.length > 40 ? 300 : undefined,
                  withinPortal: true,
                },
                () =>
                  h(
                    ActionIcon,
                    {
                      'aria-label': tooltip,
                      class: clsx('mvt-table-head-cell-filter-label-icon', classes.root),
                      size: 18,
                      ...dataVariable('active', active),
                      ...attrs,
                      onClick: click,
                    } as any,
                    () => h(o.icons.IconFilter, { size: '100%' }),
                  ),
              ),
            ),
          ),
          o.columnFilterDisplayMode === 'popover'
            ? h(
                Popover.Dropdown,
                {
                  onClick: (event: MouseEvent) => event.stopPropagation(),
                  onKeydown: (event: KeyboardEvent) => {
                    if (event.key === 'Enter') popoverOpened.value = false
                  },
                  onMousedown: (event: MouseEvent) => event.stopPropagation(),
                },
                () => h(MVT_TableHeadCellFilterContainer, { header, table }),
              )
            : null,
        ],
      )
    }
  },
})
