import { Flex, Modal, Stack } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_EditActionButtons } from '../buttons/MVT_EditActionButtons'
import { MVT_EditCellTextInput } from '../inputs/MVT_EditCellTextInput'

export const MVT_EditRowModal = defineComponent({
  name: 'MVTEditRowModal',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, default: false },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  emits: { close: () => true },
  setup(props, { attrs, emit, slots }) {
    return () => {
      const { table } = props
      const state = table.getState()
      const row = state.creatingRow ?? state.editingRow
      if (!row) return null
      const arg = { row, table }
      const modalProps = {
        ...parseFromValuesOrFunc(table.options.mantineEditRowModalProps, arg),
        ...(state.creatingRow
          ? parseFromValuesOrFunc(table.options.mantineCreateRowModalProps, arg)
          : {}),
        ...attrs,
      } as Record<string, any>
      const internalEditComponents = row
        .getAllCells()
        .filter((cell) => cell.column.columnDef.columnDefType === 'data')
        .map((cell) => h(MVT_EditCellTextInput, { key: cell.id, cell, table }))
      const cancel = () => {
        if (state.creatingRow) {
          table.options.onCreatingRowCancel?.({ row, table })
          table.setCreatingRow(null)
        } else {
          table.options.onEditingRowCancel?.({ row, table })
          table.setEditingRow(null)
        }
        row._valuesCache = {}
        modalProps.onClose?.()
        emit('close')
      }
      const slot = state.creatingRow
        ? (slots.create ?? slots.default)
        : (slots.edit ?? slots.default)
      const custom =
        slot?.({ internalEditComponents, row, table }) ??
        (state.creatingRow
          ? table.options.renderCreateRowModalContent?.({ internalEditComponents, row, table })
          : table.options.renderEditRowModalContent?.({ internalEditComponents, row, table }))
      return h(
        Modal,
        { opened: props.open, withCloseButton: false, ...modalProps, key: row.id, onClose: cancel },
        () =>
          custom ?? [
            h('form', { onSubmit: (e: Event) => e.preventDefault() }, [
              h(Stack, { gap: 'lg', pb: 24, pt: 16 }, () => internalEditComponents),
            ]),
            h(Flex, { justify: 'flex-end' }, () =>
              h(MVT_EditActionButtons, { row, table, variant: 'text' }),
            ),
          ],
      )
    }
  },
})
