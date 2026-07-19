import clsx from 'clsx'
import { Button, Flex, Menu } from '@mantine-vue/core'
import { computed, defineComponent, h, ref, type PropType } from 'vue'
import type { MVT_Column, MVT_RowData, MVT_TableInstance } from '../../types'
import { getDefaultColumnOrderIds } from '../../utils/displayColumn.utils'
import { MVT_ShowHideColumnsMenuItems } from './MVT_ShowHideColumnsMenuItems'
import classes from './MVT_ShowHideColumnsMenu.module.css'

export const MVT_ShowHideColumnsMenu = defineComponent({
  name: 'MVTShowHideColumnsMenu',
  props: { table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true } },
  setup(props) {
    const hoveredColumn = ref<MVT_Column<MVT_RowData> | null>(null)
    const allColumns = computed(() => {
      const { table } = props
      const columns = table.getAllColumns()
      const order = table.getState().columnOrder
      if (order.length && !columns.some((c) => c.columnDef.columnDefType === 'group'))
        return [
          ...table.getLeftLeafColumns(),
          ...Array.from(new Set(order)).map((id) =>
            table.getCenterLeafColumns().find((c) => c.id === id),
          ),
          ...table.getRightLeafColumns(),
        ].filter(Boolean) as MVT_Column<MVT_RowData>[]
      return columns
    })
    return () => {
      const { table } = props
      const o = table.options
      const toggleAll = (value: boolean) =>
        table
          .getAllLeafColumns()
          .filter((c) => c.columnDef.enableHiding !== false)
          .forEach((c) => c.toggleVisibility(value))
      return h(Menu.Dropdown, { class: clsx('mvt-show-hide-columns-menu', classes.root) }, () => [
        h(Flex, { class: classes.content }, () => [
          o.enableHiding &&
            h(
              Button,
              {
                disabled: !table.getIsSomeColumnsVisible(),
                variant: 'subtle',
                onClick: () => toggleAll(false),
              },
              () => o.localization.hideAll,
            ),
          o.enableColumnOrdering &&
            h(
              Button,
              {
                variant: 'subtle',
                onClick: () => table.setColumnOrder(getDefaultColumnOrderIds(o, true)),
              },
              () => o.localization.resetOrder,
            ),
          o.enableColumnPinning &&
            h(
              Button,
              {
                disabled: !table.getIsSomeColumnsPinned(),
                variant: 'subtle',
                onClick: () => table.resetColumnPinning(true),
              },
              () => o.localization.unpinAll,
            ),
          o.enableHiding &&
            h(
              Button,
              {
                disabled: table.getIsAllColumnsVisible(),
                variant: 'subtle',
                onClick: () => toggleAll(true),
              },
              () => o.localization.showAll,
            ),
        ]),
        h(Menu.Divider),
        ...allColumns.value.map((column) =>
          h(MVT_ShowHideColumnsMenuItems, {
            key: column.id,
            allColumns: allColumns.value,
            column,
            hoveredColumn: hoveredColumn.value,
            getHoveredColumn: () => hoveredColumn.value,
            table,
            onHoveredColumnChange: (value: MVT_Column<MVT_RowData> | null) => {
              hoveredColumn.value = value
            },
          } as any),
        ),
      ])
    }
  },
})
