import { MultiSelect, Select, TextInput } from '@mantine-vue/core'
import { defineComponent, h, ref, type PropType } from 'vue'
import type { MVT_Cell, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'

export const MVT_EditCellTextInput = defineComponent({
  name: 'MVTEditCellTextInput',
  inheritAttrs: false,
  props: {
    cell: { type: Object as PropType<MVT_Cell<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs, slots }) {
    const value = ref<any>(props.cell.getValue())
    return () => {
      const { cell, table } = props
      const { column, row } = cell
      const def = column.columnDef
      const state = table.getState()
      const creating = state.creatingRow?.id === row.id
      const editing = state.editingRow?.id === row.id
      const arg = { cell, column, row, table }
      const textProps = {
        ...parseFromValuesOrFunc(table.options.mantineEditTextInputProps, arg),
        ...parseFromValuesOrFunc(def.mantineEditTextInputProps, arg),
        ...attrs,
      } as Record<string, any>
      const selectProps = {
        ...parseFromValuesOrFunc(table.options.mantineEditSelectProps, arg),
        ...parseFromValuesOrFunc(def.mantineEditSelectProps, arg),
        ...attrs,
      } as Record<string, any>
      const custom = slots.default?.(arg) ?? def.Edit?.(arg)
      if (custom) return custom
      const save = (newValue: any) => {
        row._valuesCache[column.id] = newValue
        if (creating) table.setCreatingRow(row)
        else if (editing) table.setEditingRow(row)
      }
      const blur = (event: FocusEvent) => {
        textProps.onBlur?.(event)
        save(value.value)
        table.setEditingCell(null)
      }
      const setRef = (el: any) => {
        const node = (el?.$el?.querySelector?.('input') ?? el?.$el ?? el) as HTMLInputElement
        if (node) table.refs.editInputRefs.value[cell.id] = node
      }
      const modal = ['custom', 'modal'].includes(
        (creating ? table.options.createDisplayMode : table.options.editDisplayMode) as string,
      )
      const common = {
        disabled: parseFromValuesOrFunc(def.enableEditing, row) === false,
        label: modal ? def.header : undefined,
        name: cell.id,
        placeholder: !modal ? def.header : undefined,
        value: value.value,
        variant: table.options.editDisplayMode === 'table' ? 'unstyled' : 'default',
        onClick: (e: MouseEvent) => e.stopPropagation(),
        ref: setRef,
      }
      if (def.editVariant === 'select')
        return h(Select, {
          ...common,
          searchable: true,
          ...selectProps,
          onChange: (newValue: any, option: any) => {
            value.value = newValue
            selectProps.onChange?.(newValue, option)
          },
          onBlur: blur,
        } as any)
      if (def.editVariant === 'multi-select')
        return h(MultiSelect, {
          ...common,
          searchable: true,
          ...selectProps,
          onChange: (newValue: any[]) => {
            value.value = newValue
            selectProps.onChange?.(newValue)
          },
          onBlur: blur,
        } as any)
      return h(TextInput, {
        ...common,
        value: value.value ?? '',
        ...textProps,
        onChange: (event: Event | string) => {
          value.value = typeof event === 'string' ? event : (event.target as HTMLInputElement).value
          textProps.onChange?.(event)
        },
        onBlur: blur,
        onKeydown: (event: KeyboardEvent) => {
          textProps.onKeyDown?.(event)
          if (event.key === 'Enter') table.refs.editInputRefs.value[cell.id]?.blur()
        },
      } as any)
    }
  },
})
