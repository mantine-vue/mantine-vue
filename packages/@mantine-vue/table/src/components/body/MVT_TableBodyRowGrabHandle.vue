<script setup lang="ts">
import { computed, useAttrs, type Ref } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_GrabHandleButton from '../buttons/MVT_GrabHandleButton.vue'

defineOptions({ name: 'MVTTableBodyRowGrabHandle', inheritAttrs: false })

const props = defineProps<{
  row: MVT_Row<MVT_RowData>
  rowRef: Ref<HTMLTableRowElement | null>
  table: MVT_TableInstance<MVT_RowData>
}>()

const attrs = useAttrs()

const actionIconProps = computed(
  () =>
    ({
      ...parseFromValuesOrFunc(props.table.options.mantineRowDragHandleProps, {
        row: props.row,
        table: props.table,
      }),
      ...attrs,
    }) as Record<string, any>,
)

const handleDragStart = (event: DragEvent) => {
  actionIconProps.value.onDragStart?.(event)
  if (props.rowRef.value) event.dataTransfer?.setDragImage(props.rowRef.value, 0, 0)
  props.table.setDraggingRow(props.row)
}

const handleDragEnd = (event: DragEvent) => {
  actionIconProps.value.onDragEnd?.(event)
  props.table.setDraggingRow(null)
  props.table.setHoveredRow(null)
}
</script>

<template>
  <MVT_GrabHandleButton
    :actionIconProps="actionIconProps"
    :table="table"
    :onDragStart="handleDragStart"
    :onDragEnd="handleDragEnd"
  />
</template>
