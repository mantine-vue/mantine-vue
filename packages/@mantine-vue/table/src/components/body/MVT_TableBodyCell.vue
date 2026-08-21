<script setup lang="ts">
import { computed, ref, useAttrs, type CSSProperties, type Ref } from 'vue'

import { Skeleton, TableTd, useDirection, useMantineTheme } from '@mantine-vue/core'

import clsx from 'clsx'

import {
  type MVT_Cell,
  type MVT_RowData,
  type MVT_TableInstance,
  type MVT_VirtualItem,
} from '../../types'
import { parseCSSVarId } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_CopyButton from '../buttons/MVT_CopyButton.vue'
import MVT_EditCellTextInput from '../inputs/MVT_EditCellTextInput.vue'
import MVT_TableBodyCellValue from './MVT_TableBodyCellValue.vue'
import classes from './MVT_TableBodyCell.module.css'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTTableBodyCell', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    cell: MVT_Cell<MVT_RowData>
    numRows?: number
    renderedColumnIndex?: number
    renderedRowIndex?: number
    rowRef?: Ref<HTMLTableRowElement | null>
    table: MVT_TableInstance<MVT_RowData>
    virtualCell?: MVT_VirtualItem
  }>(),
  {
    numRows: 1,
    renderedColumnIndex: 0,
    renderedRowIndex: 0,
    rowRef: undefined,
    virtualCell: undefined,
  },
)

const attrs = useAttrs()
const direction = useDirection()
const theme = useMantineTheme()

const isCellContentOverflowing = ref(false)
const cellHoverRevealDivRef = ref<HTMLDivElement | null>(null)

const skeletonWidth = ref(100)
{
  const { cell, table } = props
  const { isLoading, showSkeletons } = table.getState()
  if (isLoading || showSkeletons) {
    const size = cell.column.getSize()
    skeletonWidth.value =
      cell.column.columnDef.columnDefType === 'display'
        ? size / 2
        : Math.round(Math.random() * (size - size / 3) + size / 3)
  }
}

const column = computed(() => props.cell.column)
const row = computed(() => props.cell.row)
const columnDef = computed(() => column.value.columnDef)
const columnDefType = computed(() => columnDef.value.columnDefType)
const isGridLayout = computed(() => !!props.table.options.layoutMode?.startsWith('grid'))

// Server grouping fields are not TanStack client-grouped columns.
const isServerGrouping = computed(() => !!(props.table as any)._serverGrouping)

const cellContext = computed(() => ({
  cell: props.cell,
  column: column.value,
  renderedColumnIndex: props.renderedColumnIndex,
  renderedRowIndex: props.renderedRowIndex,
  row: row.value,
  table: props.table,
}))

const tableCellProps = computed(() => {
  const context = cellContext.value
  return {
    ...parseFromValuesOrFunc(props.table.options.mantineTableBodyCellProps, context),
    ...parseFromValuesOrFunc(columnDef.value.mantineTableBodyCellProps, context),
    ...attrs,
  } as Record<string, any>
})

const skeletonProps = computed(
  () => parseFromValuesOrFunc(props.table.options.mantineSkeletonProps, cellContext.value) ?? {},
)

const widthStyles = computed(() => {
  const { layoutMode } = props.table.options
  const def = columnDef.value
  const id = column.value?.id

  const styles: CSSProperties = {
    minWidth: `max(calc(var(--col-${parseCSSVarId(id)}-size) * 1px), ${def.minSize ?? 30}px)`,
    width: `calc(var(--col-${parseCSSVarId(column.value.id)}-size) * 1px)`,
  }
  if (layoutMode === 'grid') {
    styles.flex = `${
      [0, false].includes(def.grow!) ? 0 : `var(--col-${parseCSSVarId(column.value.id)}-size)`
    } 0 auto`
  } else if (layoutMode === 'grid-no-grow') {
    styles.flex = `${+(def.grow || 0)} 0 auto`
  }
  return styles
})

const isColumnPinned = computed(
  () =>
    props.table.options.enableColumnPinning &&
    columnDef.value.columnDefType !== 'group' &&
    column.value.getIsPinned(),
)

const isEditable = computed(
  () =>
    !props.cell.getIsPlaceholder() &&
    parseFromValuesOrFunc(props.table.options.enableEditing, row.value) &&
    parseFromValuesOrFunc(columnDef.value.enableEditing, row.value) !== false,
)

const isEditing = computed(() => {
  const { editDisplayMode } = props.table.options
  const { editingCell, editingRow } = props.table.getState()
  return (
    isEditable.value &&
    !['custom', 'modal'].includes(editDisplayMode as string) &&
    (editDisplayMode === 'table' ||
      editingRow?.id === row.value.id ||
      editingCell?.id === props.cell.id) &&
    !row.value.getIsGrouped()
  )
})

const isCreating = computed(
  () =>
    isEditable.value &&
    props.table.options.createDisplayMode === 'row' &&
    props.table.getState().creatingRow?.id === row.value.id,
)

const showClickToCopyButton = computed(() => {
  const { enableClickToCopy } = props.table.options
  const def = columnDef.value
  return (
    parseFromValuesOrFunc(enableClickToCopy, props.cell) ||
    (parseFromValuesOrFunc(def.enableClickToCopy, props.cell) &&
      parseFromValuesOrFunc(def.enableClickToCopy, props.cell) !== false)
  )
})

const handleDoubleClick = (event: MouseEvent) => {
  tableCellProps.value.onDoubleClick?.(event)
  if (isEditable.value && props.table.options.editDisplayMode === 'cell') {
    props.table.setEditingCell(props.cell)
    setTimeout(() => {
      const textField = props.table.refs.editInputRefs.value[props.cell.id]
      if (textField) {
        textField.focus()
        textField.select?.()
      }
    }, 100)
  }
}

const handleDragEnter = (event: DragEvent) => {
  tableCellProps.value.onDragEnter?.(event)
  const { table } = props
  const { enableColumnOrdering, enableGrouping } = table.options
  const { draggingColumn, hoveredColumn } = table.getState()
  if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
    table.setHoveredColumn(null)
  }
  if (enableColumnOrdering && draggingColumn) {
    table.setHoveredColumn(columnDef.value.enableColumnOrdering !== false ? column.value : null)
  }
}

const handleMouseEnter = () => {
  if (!columnDef.value.enableCellHoverReveal) return
  const div = cellHoverRevealDivRef.value
  if (div) isCellContentOverflowing.value = div.scrollWidth > div.clientWidth
}

const handleMouseLeave = () => {
  if (!columnDef.value.enableCellHoverReveal) return
  isCellContentOverflowing.value = false
}

const cellStyle = computed(() => {
  const pinned = isColumnPinned.value
  return {
    ...widthStyles.value,
    '--mvt-cell-align':
      tableCellProps.value.align ?? (direction.dir.value === 'rtl' ? 'right' : 'left'),
    '--mvt-table-cell-left': pinned === 'left' ? `${column.value.getStart(pinned)}` : undefined,
    '--mvt-table-cell-right': pinned === 'right' ? `${column.value.getAfter(pinned)}` : undefined,
    ...parseFromValuesOrFunc(tableCellProps.value.style, theme),
  }
})

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const cellProps = () => {
  const { numRows, renderedColumnIndex, renderedRowIndex, table, virtualCell } = props
  const { columnResizeDirection, columnResizeMode, editDisplayMode } = table.options
  const { columnSizingInfo, density, draggingColumn, hoveredColumn } = table.getState()
  const pinned = isColumnPinned.value
  const tableCellRest = { ...tableCellProps.value }
  delete tableCellRest.children

  return {
    'data-column-pinned': pinned || undefined,
    'data-dragging-column': draggingColumn?.id === column.value.id || undefined,
    'data-first-right-pinned':
      (pinned === 'right' && column.value.getIsFirstColumn(pinned)) || undefined,
    'data-hovered-column-target': hoveredColumn?.id === column.value.id || undefined,
    'data-index': renderedColumnIndex,
    'data-last-left-pinned':
      (pinned === 'left' && column.value.getIsLastColumn(pinned)) || undefined,
    'data-last-row': renderedRowIndex === numRows - 1 || undefined,
    'data-resizing':
      (columnResizeMode === 'onChange' &&
        columnSizingInfo?.isResizingColumn === column.value.id &&
        columnResizeDirection) ||
      undefined,
    ...tableCellRest,
    class: clsx(
      classes.root,
      isGridLayout.value && classes['root-grid'],
      virtualCell && classes['root-virtualized'],
      isEditable.value && editDisplayMode === 'cell' && classes['root-cursor-pointer'],
      isEditable.value &&
        ['cell', 'table'].includes(editDisplayMode ?? '') &&
        columnDefType.value !== 'display' &&
        classes['root-editable-hover'],
      columnDefType.value === 'data' && classes['root-data-col'],
      density === 'xs' && classes['root-nowrap'],
      columnDef.value.enableCellHoverReveal && classes['root-cell-hover-reveal'],
      tableCellProps.value.class,
    ),
    onDblclick: handleDoubleClick,
    onDragenter: handleDragEnter,
    onMouseenter: handleMouseEnter,
    onMouseleave: handleMouseLeave,
    style: cellStyle.value,
  }
}

const contentVariant = computed(() => {
  const { cell, table } = props
  const { isLoading, showSkeletons } = table.getState()

  if (!isServerGrouping.value && cell.getIsPlaceholder()) return 'placeholder'
  if (showSkeletons !== false && (isLoading || showSkeletons)) return 'skeleton'
  if (
    columnDefType.value === 'display' &&
    (['mvt-row-expand', 'mvt-row-numbers', 'mvt-row-select'].includes(column.value.id) ||
      !row.value.getIsGrouped())
  )
    return 'display'
  if (isCreating.value || isEditing.value) return 'edit'
  if (showClickToCopyButton.value && columnDef.value.enableClickToCopy !== false) return 'copy'
  return 'value'
})

const cellValueProps = computed(() => ({
  cell: props.cell,
  renderedColumnIndex: props.renderedColumnIndex,
  renderedRowIndex: props.renderedRowIndex,
  table: props.table,
}))

const skeletonBindings = computed<any>(() => ({
  height: 20,
  width: skeletonWidth.value,
  ...skeletonProps.value,
}))

const renderPlaceholderCell = () => {
  const { cell, table } = props
  return (
    columnDef.value.PlaceholderCell?.({ cell, column: column.value, row: row.value, table }) ?? null
  )
}

const renderDisplayCell = () =>
  columnDef.value.Cell?.({
    column: column.value,
    renderedCellValue: props.cell.renderValue() as any,
    row: row.value,
    rowRef: props.rowRef,
    ...cellValueProps.value,
  })

const renderCellChildren = () => tableCellProps.value.children

const groupedSuffix = computed(() =>
  props.cell.getIsGrouped() && !columnDef.value.GroupedCell
    ? ` (${row.value.subRows?.length})`
    : null,
)

const setHoverRevealRef = (el: any) => {
  cellHoverRevealDivRef.value = (el?.$el ?? el) as HTMLDivElement
}

const hoverRevealClass = computed(() =>
  clsx(
    columnDef.value.enableCellHoverReveal &&
      !(isCreating.value || isEditing.value) &&
      classes['cell-hover-reveal'],
    isCellContentOverflowing.value && classes['overflowing'],
  ),
)
</script>

<template>
  <TableTd v-bind="cellProps()">
    <MVT_RenderNode v-if="tableCellProps.children" :node="renderCellChildren()" />
    <div
      v-else-if="columnDef.enableCellHoverReveal"
      :ref="setHoverRevealRef"
      :class="hoverRevealClass"
    >
      <MVT_RenderNode v-if="contentVariant === 'placeholder'" :node="renderPlaceholderCell()" />
      <Skeleton v-else-if="contentVariant === 'skeleton'" v-bind="skeletonBindings" />
      <MVT_RenderNode v-else-if="contentVariant === 'display'" :node="renderDisplayCell()" />
      <MVT_EditCellTextInput v-else-if="contentVariant === 'edit'" :cell="cell" :table="table" />
      <MVT_CopyButton v-else-if="contentVariant === 'copy'" :cell="cell" :table="table">
        <MVT_TableBodyCellValue v-bind="cellValueProps" />
      </MVT_CopyButton>
      <MVT_TableBodyCellValue v-else v-bind="cellValueProps" />
      <template v-if="groupedSuffix">{{ groupedSuffix }}</template>
    </div>
    <template v-else>
      <MVT_RenderNode v-if="contentVariant === 'placeholder'" :node="renderPlaceholderCell()" />
      <Skeleton v-else-if="contentVariant === 'skeleton'" v-bind="skeletonBindings" />
      <MVT_RenderNode v-else-if="contentVariant === 'display'" :node="renderDisplayCell()" />
      <MVT_EditCellTextInput v-else-if="contentVariant === 'edit'" :cell="cell" :table="table" />
      <MVT_CopyButton v-else-if="contentVariant === 'copy'" :cell="cell" :table="table">
        <MVT_TableBodyCellValue v-bind="cellValueProps" />
      </MVT_CopyButton>
      <MVT_TableBodyCellValue v-else v-bind="cellValueProps" />
      <template v-if="groupedSuffix">{{ groupedSuffix }}</template>
    </template>
  </TableTd>
</template>
