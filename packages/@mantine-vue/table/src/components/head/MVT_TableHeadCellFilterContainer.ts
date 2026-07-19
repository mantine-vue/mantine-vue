import { ActionIcon, Collapse, Flex, Menu, Text, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import { localizedFilterOption } from '../../fns/filterFns'
import type { MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import { MVT_FilterCheckbox } from '../inputs/MVT_FilterCheckbox'
import { MVT_FilterRangeFields } from '../inputs/MVT_FilterRangeFields'
import { MVT_FilterRangeSlider } from '../inputs/MVT_FilterRangeSlider'
import { MVT_FilterTextInput } from '../inputs/MVT_FilterTextInput'
import { MVT_FilterOptionMenu } from '../menus/MVT_FilterOptionMenu'
import classes from './MVT_TableHeadCellFilterContainer.module.css'

export const MVT_TableHeadCellFilterContainer = defineComponent({
  name: 'MVTTableHeadCellFilterContainer',
  inheritAttrs: false,
  props: {
    header: { type: Object as PropType<MVT_Header<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const { header, table } = props
      const { column } = header
      const def = column.columnDef
      const o = table.options
      const allowed = def.columnFilterModeOptions ?? o.columnFilterModeOptions
      const showMode =
        o.enableColumnFilterModes &&
        def.enableColumnFilterModes !== false &&
        (allowed === undefined || !!allowed?.length)
      const input =
        slots.default?.({ column, header, table }) ??
        (def.filterVariant === 'checkbox'
          ? h(MVT_FilterCheckbox, { column, table })
          : def.filterVariant === 'range-slider'
            ? h(MVT_FilterRangeSlider, { header, table })
            : ['date-range', 'range'].includes(def.filterVariant ?? '') ||
                ['between', 'betweenInclusive', 'inNumberRange'].includes(def._filterFn)
              ? h(MVT_FilterRangeFields, { header, table })
              : h(MVT_FilterTextInput, { header, table }))
      const modeMenu = showMode
        ? h(Menu, { withinPortal: o.columnFilterDisplayMode !== 'popover' }, () => [
            h(
              Tooltip,
              {
                label: o.localization.changeFilterMode,
                position: 'bottom-start',
                withinPortal: true,
              },
              () =>
                h(Menu.Target, null, () =>
                  h(
                    ActionIcon,
                    {
                      'aria-label': o.localization.changeFilterMode,
                      color: 'gray',
                      size: 'md',
                      variant: 'subtle',
                    },
                    () => h(o.icons.IconFilterCog),
                  ),
                ),
            ),
            h(MVT_FilterOptionMenu, {
              header,
              table,
              onSelect: () =>
                setTimeout(() => table.refs.filterInputRefs.value[`${column.id}-0`]?.focus(), 100),
            }),
          ])
        : null
      return h(
        Collapse,
        {
          expanded: table.getState().showColumnFilters || o.columnFilterDisplayMode === 'popover',
        } as any,
        () =>
          h(Flex, { direction: 'column', ...attrs }, () => [
            h(Flex, { align: 'flex-end' }, () => [input, modeMenu]),
            showMode
              ? h(
                  Text,
                  { c: 'dimmed', class: classes['filter-mode-label'], component: 'label' },
                  () =>
                    o.localization.filterMode.replace(
                      '{filterType}',
                      localizedFilterOption(o.localization, def._filterFn),
                    ),
                )
              : null,
          ]),
      )
    }
  },
})
