<script setup lang="ts">
import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { computed, useSlots } from 'vue'
import type { MVT_Cell, MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_RowActionMenu from '../menus/MVT_RowActionMenu.vue'
import { useMVT_Slots } from '../MVT_TableSlots'
import MVT_EditActionButtons from './MVT_EditActionButtons.vue'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTToggleRowActionMenuButton' })

const props = defineProps<{
  cell: MVT_Cell<MVT_RowData>
  row: MVT_Row<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

defineSlots<{
  default?: (arg: {
    cell: MVT_Cell<MVT_RowData>
    row: MVT_Row<MVT_RowData>
    table: MVT_TableInstance<MVT_RowData>
  }) => any
}>()

const slots = useSlots()
const mvtSlots = useMVT_Slots()

// Slot-derived predicates stay plain functions: neither the local nor the
// injected slots object is reactive, so caching them would go stale.
const hasRowActions = () =>
  !!(slots.default || mvtSlots.rowActions || props.table.options.renderRowActions)

const hasRowActionMenuItems = () =>
  !!(mvtSlots.rowActionMenuItems || props.table.options.renderRowActionMenuItems)

const showEditActionButtons = computed(() => {
  const { createDisplayMode, editDisplayMode } = props.table.options
  const state = props.table.getState()
  const creating = state.creatingRow?.id === props.row.id
  const editing = state.editingRow?.id === props.row.id
  return (creating && createDisplayMode === 'row') || (editing && editDisplayMode === 'row')
})

const startEdit = (event: MouseEvent) => {
  event.stopPropagation()
  props.table.setEditingRow({ ...props.row })
}

/** Stable functional component so `<component :is>` patches instead of remounting. */
const renderRowActions = () => {
  const { cell, row, table } = props
  const arg = { cell, row, table }
  return slots.default?.(arg) ?? (mvtSlots.rowActions ?? table.options.renderRowActions)?.(arg)
}

const showEditButton = () =>
  !hasRowActionMenuItems() && !!parseFromValuesOrFunc(props.table.options.enableEditing, props.row)

const editButtonDisabled = computed(() => {
  const { editingRow } = props.table.getState()
  return !!editingRow && editingRow.id !== props.row.id
})
</script>

<template>
  <MVT_EditActionButtons v-if="showEditActionButtons" :row="row" :table="table" />
  <MVT_RenderNode v-else-if="hasRowActions()" :node="renderRowActions()" />
  <Tooltip
    v-else-if="showEditButton()"
    :label="table.options.localization.edit"
    :openDelay="1000"
    position="right"
    :withinPortal="true"
  >
    <ActionIcon
      :aria-label="table.options.localization.edit"
      color="gray"
      :disabled="editButtonDisabled"
      size="md"
      variant="subtle"
      @click="startEdit"
    >
      <component :is="table.options.icons.IconEdit" />
    </ActionIcon>
  </Tooltip>
  <MVT_RowActionMenu
    v-else-if="hasRowActionMenuItems()"
    :handleEdit="startEdit"
    :row="row"
    :table="table"
  />
</template>
