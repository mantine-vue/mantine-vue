<script setup lang="ts">
import { computed, useAttrs, type Ref } from 'vue'

import { type MVT_Column, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { reorderColumn } from '../../utils/column.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_GrabHandleButton from '../buttons/MVT_GrabHandleButton.vue'

defineOptions({ name: 'MVTTableHeadCellGrabHandle', inheritAttrs: false })

const props = defineProps<{
  column: MVT_Column<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
  tableHeadCellRef: Ref<HTMLTableCellElement | null>
}>()

const attrs = useAttrs()

const actionIconProps = computed(() => {
  const context = { column: props.column, table: props.table }
  return {
    ...parseFromValuesOrFunc(props.table.options.mantineColumnDragHandleProps, context),
    ...parseFromValuesOrFunc(props.column.columnDef.mantineColumnDragHandleProps, context),
    ...attrs,
  } as Record<string, any>
})

const handleDragStart = (event: DragEvent) => {
  actionIconProps.value.onDragStart?.(event)
  props.table.setDraggingColumn(props.column)
  event.dataTransfer?.setDragImage(props.tableHeadCellRef.value as HTMLElement, 0, 0)
}

const handleDragEnd = (event: DragEvent) => {
  actionIconProps.value.onDragEnd?.(event)

  const { column, table } = props
  const { columnOrder, draggingColumn, hoveredColumn } = table.getState()
  if (hoveredColumn?.id === 'drop-zone') {
    column.toggleGrouping()
  } else if (
    table.options.enableColumnOrdering &&
    hoveredColumn &&
    hoveredColumn?.id !== draggingColumn?.id
  ) {
    table.setColumnOrder(
      reorderColumn(column, hoveredColumn as MVT_Column<MVT_RowData>, columnOrder),
    )
  }
  table.setDraggingColumn(null)
  table.setHoveredColumn(null)
}
</script>

<template>
  <MVT_GrabHandleButton
    :actionIconProps="actionIconProps"
    :onDragEnd="handleDragEnd"
    :onDragStart="handleDragStart"
    :table="table"
  />
</template>
