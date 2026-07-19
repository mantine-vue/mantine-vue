import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_Cell, MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_RowActionMenu } from '../menus/MVT_RowActionMenu'
import { useMVT_Slots } from '../MVT_TableSlots'
import { MVT_EditActionButtons } from './MVT_EditActionButtons'

export const MVT_ToggleRowActionMenuButton = defineComponent({
  name: 'MVTToggleRowActionMenuButton',
  props: {
    cell: { type: Object as PropType<MVT_Cell<MVT_RowData>>, required: true },
    row: { type: Object as PropType<MVT_Row<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { slots }) {
    const mvtSlots = useMVT_Slots()
    return () => {
      const { cell, row, table } = props
      const o = table.options
      const hasRowActions = slots.default || mvtSlots.rowActions || o.renderRowActions
      const hasRowActionMenuItems = mvtSlots.rowActionMenuItems || o.renderRowActionMenuItems
      const state = table.getState()
      const creating = state.creatingRow?.id === row.id
      const editing = state.editingRow?.id === row.id
      const showEdit =
        (creating && o.createDisplayMode === 'row') || (editing && o.editDisplayMode === 'row')
      const startEdit = (event: MouseEvent) => {
        event.stopPropagation()
        table.setEditingRow({ ...row })
      }
      if (showEdit) return h(MVT_EditActionButtons, { row, table })
      if (hasRowActions)
        return (
          slots.default?.({ cell, row, table }) ??
          (mvtSlots.rowActions ?? o.renderRowActions)?.({ cell, row, table })
        )
      if (!hasRowActionMenuItems && parseFromValuesOrFunc(o.enableEditing, row))
        return h(
          Tooltip,
          { label: o.localization.edit, openDelay: 1000, position: 'right', withinPortal: true },
          () =>
            h(
              ActionIcon,
              {
                'aria-label': o.localization.edit,
                color: 'gray',
                disabled: !!state.editingRow && state.editingRow.id !== row.id,
                size: 'md',
                variant: 'subtle',
                onClick: startEdit,
              },
              () => h(o.icons.IconEdit),
            ),
        )
      return hasRowActionMenuItems
        ? h(MVT_RowActionMenu, { handleEdit: startEdit, row, table })
        : null
    }
  },
})
