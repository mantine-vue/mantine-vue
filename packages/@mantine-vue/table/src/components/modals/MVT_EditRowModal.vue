<script setup lang="ts">
import { Flex, Modal, Stack } from '@mantine-vue/core'
import { computed, h, useAttrs, useSlots, type VNodeChild } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { useMVT_Slots } from '../MVT_TableSlots'
import MVT_EditActionButtons from '../buttons/MVT_EditActionButtons.vue'
import MVT_EditCellTextInput from '../inputs/MVT_EditCellTextInput.vue'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTEditRowModal', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    open?: boolean
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { open: false },
)

const emit = defineEmits<{ close: [] }>()

defineSlots<{
  create?: (arg: {
    internalEditComponents: VNodeChild[]
    row: MVT_Row<MVT_RowData>
    table: MVT_TableInstance<MVT_RowData>
  }) => any
  default?: (arg: {
    internalEditComponents: VNodeChild[]
    row: MVT_Row<MVT_RowData>
    table: MVT_TableInstance<MVT_RowData>
  }) => any
  edit?: (arg: {
    internalEditComponents: VNodeChild[]
    row: MVT_Row<MVT_RowData>
    table: MVT_TableInstance<MVT_RowData>
  }) => any
}>()

const attrs = useAttrs()
const slots = useSlots()
const mvtSlots = useMVT_Slots()

const isCreating = computed(() => !!props.table.getState().creatingRow)

const row = computed(() => {
  const state = props.table.getState()
  return state.creatingRow ?? state.editingRow
})

const editableCells = computed(
  () =>
    row.value?.getAllCells().filter((cell) => cell.column.columnDef.columnDefType === 'data') ?? [],
)

const modalProps = computed(() => {
  const { table } = props
  const context = { row: row.value!, table }
  return {
    ...parseFromValuesOrFunc(table.options.mantineEditRowModalProps, context),
    ...(isCreating.value
      ? parseFromValuesOrFunc(table.options.mantineCreateRowModalProps, context)
      : {}),
    ...attrs,
  } as Record<string, any>
})

const cancel = () => {
  const { table } = props
  const activeRow = row.value
  if (!activeRow) return
  if (isCreating.value) {
    table.options.onCreatingRowCancel?.({ row: activeRow, table })
    table.setCreatingRow(null)
  } else {
    table.options.onEditingRowCancel?.({ row: activeRow, table })
    table.setEditingRow(null)
  }
  activeRow._valuesCache = {}
  modalProps.value.onClose?.()
  emit('close')
}

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const modalBindings = () => ({
  opened: props.open,
  withCloseButton: false,
  ...modalProps.value,
  key: row.value?.id,
  onClose: cancel,
})

/**
 * The active row's edit inputs, as vnodes, so a custom modal body can place them
 * itself. Built fresh per render — the same vnodes must not be reused.
 */
const internalEditComponents = () =>
  editableCells.value.map((cell) =>
    h(MVT_EditCellTextInput, { key: cell.id, cell, table: props.table }),
  )

/**
 * Slot or `renderX` option replacing the whole modal body. Resolved as the
 * template branches so the callback runs once per render, and only counts when
 * it returns a node.
 */
let customContent: VNodeChild
const hasCustomContent = () => {
  const { table } = props
  const activeRow = row.value
  if (!activeRow) return false

  const context = { internalEditComponents: internalEditComponents(), row: activeRow, table }
  const slot = isCreating.value
    ? (slots.create ?? mvtSlots.createRowModalContent ?? slots.default)
    : (slots.edit ?? mvtSlots.editRowModalContent ?? slots.default)

  customContent =
    slot?.(context) ??
    (isCreating.value
      ? table.options.renderCreateRowModalContent?.(context)
      : table.options.renderEditRowModalContent?.(context))

  return !!customContent
}
const renderCustomContent = () => customContent
</script>

<template>
  <Modal v-if="row" v-bind="modalBindings()">
    <MVT_RenderNode v-if="hasCustomContent()" :node="renderCustomContent()" />
    <template v-else>
      <form @submit.prevent>
        <Stack gap="lg" :pb="24" :pt="16">
          <MVT_EditCellTextInput
            v-for="cell in editableCells"
            :key="cell.id"
            :cell="cell"
            :table="table"
          />
        </Stack>
      </form>
      <Flex justify="flex-end">
        <MVT_EditActionButtons :row="row" :table="table" variant="text" />
      </Flex>
    </template>
  </Modal>
</template>
