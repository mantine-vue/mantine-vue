import clsx from 'clsx'
import { Checkbox, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_Column, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_FilterCheckBox.module.css'

export const MVT_FilterCheckbox = defineComponent({
  name: 'MVTFilterCheckbox',
  inheritAttrs: false,
  props: {
    column: { type: Object as PropType<MVT_Column<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs }) {
    return () => {
      const { column, table } = props
      const arg = { column, table }
      const checkboxProps = {
        ...parseFromValuesOrFunc(table.options.mantineFilterCheckboxProps, arg),
        ...parseFromValuesOrFunc(column.columnDef.mantineFilterCheckboxProps, arg),
        ...attrs,
      } as Record<string, any>
      const label = table.options.localization.filterByColumn.replace(
        '{column}',
        String(column.columnDef.header),
      )
      const value = column.getFilterValue()
      return h(
        Tooltip,
        { label: checkboxProps.title ?? label, openDelay: 1000, withinPortal: true },
        () =>
          h(Checkbox, {
            checked: value === 'true',
            class: clsx('mvt-filter-checkbox', classes.root, checkboxProps.class),
            indeterminate: value === undefined,
            label: checkboxProps.title ?? label,
            size: table.getState().density === 'xs' ? 'sm' : 'md',
            ...checkboxProps,
            title: undefined,
            onChange: (e: Event) => {
              column.setFilterValue(
                value === undefined ? 'true' : value === 'true' ? 'false' : undefined,
              )
              checkboxProps.onChange?.(e)
            },
            onClick: (e: MouseEvent) => {
              e.stopPropagation()
              checkboxProps.onClick?.(e)
            },
          } as any),
      )
    }
  },
})
