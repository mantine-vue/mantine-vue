import clsx from 'clsx'
import { ActionIcon, Box, Button, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import classes from './MVT_EditActionButtons.module.css'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'

export const MVT_EditActionButtons = defineComponent({
  name: 'MVTEditActionButtons',
  inheritAttrs: false,
  props: {
    row: { type: Object as PropType<MVT_Row<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
    variant: { type: String as PropType<'icon' | 'text'>, default: 'icon' },
  },
  setup(props, { attrs }) {
    return () => {
      const { row, table } = props
      const state = table.getState()
      const l = table.options.localization
      const creating = state.creatingRow?.id === row.id
      const editing = state.editingRow?.id === row.id
      const cancel = () => {
        if (creating) {
          table.options.onCreatingRowCancel?.({ row, table })
          table.setCreatingRow(null)
        } else if (editing) {
          table.options.onEditingRowCancel?.({ row, table })
          table.setEditingRow(null)
        }
        row._valuesCache = {}
      }
      const save = () => {
        Object.values(table.refs.editInputRefs.value)
          .filter((input) => row.id === input?.name?.split('_')?.[0])
          .forEach((input) => {
            if (input.value !== undefined && Object.hasOwn(row._valuesCache as object, input.name))
              row._valuesCache[input.name] = input.value
          })
        if (creating)
          table.options.onCreatingRowSave?.({
            exitCreatingMode: () => table.setCreatingRow(null),
            row,
            table,
            values: row._valuesCache,
          })
        else if (editing)
          table.options.onEditingRowSave?.({
            exitEditingMode: () => table.setEditingRow(null),
            row,
            table,
            values: row._valuesCache,
          })
      }
      const buttons =
        props.variant === 'icon'
          ? [
              h(Tooltip, { label: l.cancel, withinPortal: true }, () =>
                h(
                  ActionIcon,
                  { 'aria-label': l.cancel, color: 'red', variant: 'subtle', onClick: cancel },
                  () => h(table.options.icons.IconCircleX),
                ),
              ),
              h(Tooltip, { label: l.save, withinPortal: true }, () =>
                h(
                  ActionIcon,
                  {
                    'aria-label': l.save,
                    color: 'blue',
                    loading: state.isSaving,
                    variant: 'subtle',
                    onClick: save,
                  },
                  () => h(table.options.icons.IconDeviceFloppy),
                ),
              ),
            ]
          : [
              h(Button, { variant: 'subtle', onClick: cancel }, () => l.cancel),
              h(
                Button,
                { loading: state.isSaving, variant: 'filled', onClick: save },
                () => l.save,
              ),
            ]
      return h(
        Box,
        {
          ...attrs,
          class: clsx('mvt-edit-action-buttons', classes.root, attrs.class),
          onClick: (e: MouseEvent) => e.stopPropagation(),
        },
        () => buttons,
      )
    }
  },
})
