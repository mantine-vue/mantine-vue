import { ActionIcon, Menu, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import { renderMVT_Renderable, useMVT_Slots } from '../MVT_TableSlots'

export const MVT_RowActionMenu = defineComponent({
  name: 'MVTRowActionMenu',
  inheritAttrs: false,
  props: {
    handleEdit: { type: Function as PropType<(event: MouseEvent) => void>, required: true },
    row: { type: Object as PropType<MVT_Row<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs, slots }) {
    const mvtSlots = useMVT_Slots()
    return () => {
      const { table, row } = props
      const o = table.options

      const custom =
        slots.default?.({ row, table }) ??
        renderMVT_Renderable(mvtSlots.rowActionMenuItems, o.renderRowActionMenuItems, {
          row,
          table,
        })
      return h(
        Menu,
        {
          closeOnItemClick: true,
          position:
            o.positionActionsColumn === 'first'
              ? 'bottom-start'
              : o.positionActionsColumn === 'last'
                ? 'bottom-end'
                : undefined,
          withinPortal: true,
        },
        () => [
          h(
            Tooltip,
            { label: o.localization.rowActions, openDelay: 1000, withinPortal: true },
            () =>
              h(Menu.Target, null, () =>
                h(
                  ActionIcon,
                  {
                    'aria-label': o.localization.rowActions,
                    color: 'gray',
                    size: 'sm',
                    variant: 'subtle',
                    ...attrs,
                    onClick: (e: MouseEvent) => e.stopPropagation(),
                  },
                  () => h(o.icons.IconDots),
                ),
              ),
          ),
          h(Menu.Dropdown, { onClick: (e: MouseEvent) => e.stopPropagation() }, () => [
            o.enableEditing &&
              o.editDisplayMode !== 'table' &&
              h(
                Menu.Item,
                { leftSection: h(o.icons.IconEdit), onClick: props.handleEdit },
                () => o.localization.edit,
              ),
            custom,
          ]),
        ],
      )
    }
  },
})
