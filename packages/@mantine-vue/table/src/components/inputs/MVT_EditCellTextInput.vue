<script setup lang="ts">
import { MultiSelect, Select, TextInput } from '@mantine-vue/core'
import { computed, ref, useAttrs, useSlots, type VNodeChild } from 'vue'
import type { MVT_Cell, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTEditCellTextInput', inheritAttrs: false })

const props = defineProps<{
  cell: MVT_Cell<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

defineSlots<{
  default?: (arg: {
    cell: MVT_Cell<MVT_RowData>
    column: MVT_Cell<MVT_RowData>['column']
    row: MVT_Cell<MVT_RowData>['row']
    table: MVT_TableInstance<MVT_RowData>
  }) => any
}>()

const attrs = useAttrs()
const slots = useSlots()

const value = ref<any>(props.cell.getValue())

const columnDef = computed(() => props.cell.column.columnDef)
const isCreating = computed(() => props.table.getState().creatingRow?.id === props.cell.row.id)
const isEditing = computed(() => props.table.getState().editingRow?.id === props.cell.row.id)

const editContext = () => {
  const { cell, table } = props
  return { cell, column: cell.column, row: cell.row, table }
}

const textProps = computed(() => {
  const context = editContext()
  return {
    ...parseFromValuesOrFunc(props.table.options.mantineEditTextInputProps, context),
    ...parseFromValuesOrFunc(columnDef.value.mantineEditTextInputProps, context),
    ...attrs,
  } as Record<string, any>
})

const selectProps = computed(() => {
  const context = editContext()
  return {
    ...parseFromValuesOrFunc(props.table.options.mantineEditSelectProps, context),
    ...parseFromValuesOrFunc(columnDef.value.mantineEditSelectProps, context),
    ...attrs,
  } as Record<string, any>
})

/**
 * A `default` slot or column-def `Edit` replaces the built-in input, but only
 * when it actually returns a node — returning nothing opts back into the
 * default. Resolve it while the template branches so the user callback is
 * invoked exactly once per render, same as the previous render function.
 */
let customEdit: VNodeChild
const hasCustomEdit = () => {
  const context = editContext()
  customEdit = slots.default?.(context) ?? columnDef.value.Edit?.(context)
  return !!customEdit
}
const renderCustomEdit = () => customEdit

const save = (newValue: any) => {
  const { cell, table } = props
  cell.row._valuesCache[cell.column.id] = newValue
  if (isCreating.value) table.setCreatingRow(cell.row)
  else if (isEditing.value) table.setEditingRow(cell.row)
}

const handleBlur = (event: FocusEvent) => {
  textProps.value.onBlur?.(event)
  save(value.value)
  props.table.setEditingCell(null)
}

const setInputRef = (el: any) => {
  const node = (el?.$el?.querySelector?.('input') ?? el?.$el ?? el) as HTMLInputElement
  const { editInputRefs } = props.table.refs
  if (node) editInputRefs.value[props.cell.id] = node
}

const commonProps = computed(() => {
  const { cell, table } = props
  const { createDisplayMode, editDisplayMode } = table.options
  const isModal = ['custom', 'modal'].includes(
    (isCreating.value ? createDisplayMode : editDisplayMode) as string,
  )

  return {
    disabled: parseFromValuesOrFunc(columnDef.value.enableEditing, cell.row) === false,
    label: isModal ? columnDef.value.header : undefined,
    name: cell.id,
    placeholder: !isModal ? columnDef.value.header : undefined,
    modelValue: value.value,
    variant: editDisplayMode === 'table' ? 'unstyled' : 'default',
    onClick: (event: MouseEvent) => event.stopPropagation(),
    ref: setInputRef,
  }
})

const selectFieldProps = computed(() => ({
  ...commonProps.value,
  searchable: true,
  ...selectProps.value,
  'onUpdate:modelValue': (newValue: any) => {
    value.value = newValue
  },
  onChange: selectProps.value.onChange,
  onBlur: handleBlur,
}))

const textFieldProps = computed(() => ({
  ...commonProps.value,
  modelValue: value.value ?? '',
  ...textProps.value,
  'onUpdate:modelValue': (newValue: string) => {
    value.value = newValue
  },
  onChange: textProps.value.onChange,
  onBlur: handleBlur,
  onKeydown: (event: KeyboardEvent) => {
    textProps.value.onKeyDown?.(event)
    if (event.key === 'Enter') props.table.refs.editInputRefs.value[props.cell.id]?.blur()
  },
}))
</script>

<template>
  <MVT_RenderNode v-if="hasCustomEdit()" :node="renderCustomEdit()" />
  <Select v-else-if="columnDef.editVariant === 'select'" v-bind="selectFieldProps" />
  <MultiSelect v-else-if="columnDef.editVariant === 'multi-select'" v-bind="selectFieldProps" />
  <TextInput v-else v-bind="textFieldProps" />
</template>
