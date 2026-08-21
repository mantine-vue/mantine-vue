<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import { Box } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_Header, type MVT_RowData, type MVT_TableInstance } from '../../types'
import classes from './MVT_TableHeadCellResizeHandle.module.css'

defineOptions({ name: 'MVTTableHeadCellResizeHandle', inheritAttrs: false })

const props = defineProps<{
  header: MVT_Header<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

const attrs = useAttrs()

const handleProps = computed(() => {
  const { header, table } = props
  const { columnResizeDirection, columnResizeMode } = table.options
  const { column } = header
  const resizeHandler = header.getResizeHandler()

  // `onEnd` mode only nudges the handle while dragging; the column resizes on release.
  const offset =
    column.getIsResizing() && columnResizeMode === 'onEnd'
      ? `translateX(${
          (columnResizeDirection === 'rtl' ? -1 : 1) *
          (table.getState().columnSizingInfo.deltaOffset ?? 0)
        }px)`
      : undefined

  return {
    onDblclick: () => {
      table.setColumnSizingInfo((old) => ({ ...old, isResizingColumn: false }))
      column.resetSize()
    },
    onMousedown: resizeHandler,
    onTouchstart: resizeHandler,
    role: 'separator',
    ...attrs,
    style: { '--mvt-transform': offset, ...(attrs.style as object) },
    class: clsx(
      'mvt-table-head-cell-resize-handle',
      classes.root,
      classes[`root-${columnResizeDirection}`],
      !header.subHeaders.length && columnResizeMode === 'onChange' && classes['root-hide'],
      table.getState().density,
      attrs.class,
    ),
  }
})
</script>

<template>
  <Box v-bind="handleProps" />
</template>
