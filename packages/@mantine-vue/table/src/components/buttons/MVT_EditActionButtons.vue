<script setup lang="ts">
import clsx from 'clsx'
import { ActionIcon, Box, Button, Tooltip } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'
import classes from './MVT_EditActionButtons.module.css'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'

defineOptions({ name: 'MVTEditActionButtons', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    row: MVT_Row<MVT_RowData>
    table: MVT_TableInstance<MVT_RowData>
    variant?: 'icon' | 'text'
  }>(),
  { variant: 'icon' },
)

const attrs = useAttrs()

const localization = computed(() => props.table.options.localization)
const icons = computed(() => props.table.options.icons)
const state = computed(() => props.table.getState())
const isCreating = computed(() => state.value.creatingRow?.id === props.row.id)
const isEditing = computed(() => state.value.editingRow?.id === props.row.id)

const cancel = () => {
  const { row, table } = props
  if (isCreating.value) {
    table.options.onCreatingRowCancel?.({ row, table })
    table.setCreatingRow(null)
  } else if (isEditing.value) {
    table.options.onEditingRowCancel?.({ row, table })
    table.setEditingRow(null)
  }
  row._valuesCache = {}
}

const save = () => {
  const { row, table } = props
  Object.values(table.refs.editInputRefs.value)
    .filter((input) => row.id === input?.name?.split('_')?.[0])
    .forEach((input) => {
      if (input.value !== undefined && Object.hasOwn(row._valuesCache as object, input.name))
        row._valuesCache[input.name] = input.value
    })
  if (isCreating.value)
    table.options.onCreatingRowSave?.({
      exitCreatingMode: () => table.setCreatingRow(null),
      row,
      table,
      values: row._valuesCache,
    })
  else if (isEditing.value)
    table.options.onEditingRowSave?.({
      exitEditingMode: () => table.setEditingRow(null),
      row,
      table,
      values: row._valuesCache,
    })
}

const rootProps = computed(() => ({
  ...attrs,
  class: clsx('mvt-edit-action-buttons', classes.root, attrs.class),
  onClick: (event: MouseEvent) => event.stopPropagation(),
}))
</script>

<template>
  <Box v-bind="rootProps">
    <template v-if="variant === 'icon'">
      <Tooltip :label="localization.cancel" :withinPortal="true">
        <ActionIcon :aria-label="localization.cancel" color="red" variant="subtle" @click="cancel">
          <component :is="icons.IconCircleX" />
        </ActionIcon>
      </Tooltip>
      <Tooltip :label="localization.save" :withinPortal="true">
        <ActionIcon
          :aria-label="localization.save"
          color="blue"
          :loading="state.isSaving"
          variant="subtle"
          @click="save"
        >
          <component :is="icons.IconDeviceFloppy" />
        </ActionIcon>
      </Tooltip>
    </template>
    <template v-else>
      <Button variant="subtle" @click="cancel">{{ localization.cancel }}</Button>
      <Button :loading="state.isSaving" variant="filled" @click="save">{{
        localization.save
      }}</Button>
    </template>
  </Box>
</template>
