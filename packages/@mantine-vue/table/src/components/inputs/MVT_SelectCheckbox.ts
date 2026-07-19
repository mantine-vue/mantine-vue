import { Checkbox, Radio, Switch, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import {
  getIsRowSelected,
  getMVT_RowSelectionHandler,
  getMVT_SelectAllHandler,
} from '../../utils/row.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'

export const MVT_SelectCheckbox = defineComponent({
  name: 'MVTSelectCheckbox',
  inheritAttrs: false,
  props: {
    renderedRowIndex: { type: Number, default: 0 },
    row: { type: Object as PropType<MVT_Row<MVT_RowData>>, default: undefined },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs }) {
    let lastShiftKey = false
    return () => {
      const { row, table } = props
      const o = table.options
      const state = table.getState()
      const selectAll = !row
      const checked = selectAll
        ? o.selectAllMode === 'page'
          ? table.getIsAllPageRowsSelected()
          : table.getIsAllRowsSelected()
        : getIsRowSelected({ row, table })
      const checkboxProps = {
        ...(selectAll
          ? parseFromValuesOrFunc(o.mantineSelectAllCheckboxProps, { table })
          : parseFromValuesOrFunc(o.mantineSelectCheckboxProps, { row, table })),
        ...attrs,
      } as Record<string, any>
      const label =
        checkboxProps.title ??
        (selectAll ? o.localization.toggleSelectAll : o.localization.toggleSelectRow)
      const selection = row
        ? getMVT_RowSelectionHandler({ renderedRowIndex: props.renderedRowIndex, row, table })
        : getMVT_SelectAllHandler({ table })
      const common = {
        'aria-label': label,
        checked,
        disabled: state.isLoading || (row && !row.getCanSelect()) || row?.id === 'mvt-row-create',
        size: state.density === 'xs' ? 'sm' : 'md',
        ...checkboxProps,
        title: undefined,
        onChange: (event: Event) => {
          event.stopPropagation()
          if ((event as any).shiftKey === undefined) {
            ;(event as any).shiftKey = lastShiftKey
          }
          selection(event)
          checkboxProps.onChange?.(event)
        },
        onClick: (event: MouseEvent) => {
          event.stopPropagation()
          lastShiftKey = event.shiftKey
          checkboxProps.onClick?.(event)
        },
      }
      const control =
        o.selectDisplayMode === 'switch'
          ? h(Switch, common as any)
          : o.selectDisplayMode === 'radio' || o.enableMultiRowSelection === false
            ? h(Radio, common as any)
            : h(Checkbox, {
                indeterminate:
                  !checked && selectAll
                    ? table.getIsSomeRowsSelected()
                    : row?.getIsSomeSelected() && row.getCanSelectSubRows(),
                ...common,
              } as any)
      return h(Tooltip, { label, openDelay: 1000, withinPortal: true }, () =>
        h('span', null, control),
      )
    }
  },
})
