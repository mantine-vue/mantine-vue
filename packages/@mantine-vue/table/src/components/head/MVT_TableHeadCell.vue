<script setup lang="ts">
import { computed, ref, useAttrs, type CSSProperties, type Ref } from 'vue'

import { Flex, TableTh, useDirection, useMantineTheme } from '@mantine-vue/core'

import clsx from 'clsx'

import {
  type MVT_ColumnVirtualizer,
  type MVT_Header,
  type MVT_RowData,
  type MVT_TableInstance,
} from '../../types'
import { parseCSSVarId } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_ColumnActionMenu from '../menus/MVT_ColumnActionMenu.vue'
import MVT_TableHeadCellFilterContainer from './MVT_TableHeadCellFilterContainer.vue'
import MVT_TableHeadCellFilterLabel from './MVT_TableHeadCellFilterLabel.vue'
import MVT_TableHeadCellGrabHandle from './MVT_TableHeadCellGrabHandle.vue'
import MVT_TableHeadCellResizeHandle from './MVT_TableHeadCellResizeHandle.vue'
import MVT_TableHeadCellSortLabel from './MVT_TableHeadCellSortLabel.vue'
import classes from './MVT_TableHeadCell.module.css'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTTableHeadCell', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    columnVirtualizer?: MVT_ColumnVirtualizer
    header: MVT_Header<MVT_RowData>
    renderedHeaderIndex?: number
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { columnVirtualizer: undefined, renderedHeaderIndex: 0 },
)

const attrs = useAttrs()
const direction = useDirection()
const theme = useMantineTheme()

const isHoveredHeadCell = ref(false)
const isOpenedColumnActions = ref(false)

const column = computed(() => props.header.column)
const columnDef = computed(() => column.value.columnDef)
const columnDefType = computed(() => columnDef.value.columnDefType)
const isGridLayout = computed(() => !!props.table.options.layoutMode?.startsWith('grid'))

const tableCellProps = computed(() => {
  const context = { column: column.value, table: props.table }
  return {
    ...parseFromValuesOrFunc(props.table.options.mantineTableHeadCellProps, context),
    ...parseFromValuesOrFunc(columnDef.value.mantineTableHeadCellProps, context),
    ...attrs,
  } as Record<string, any>
})

const widthStyles = computed(() => {
  const { header, table } = props
  const { layoutMode } = table.options
  const def = columnDef.value

  const styles: CSSProperties = {
    minWidth: `max(calc(var(--header-${parseCSSVarId(header?.id)}-size) * 1px), ${def.minSize ?? 30}px)`,
    width: `calc(var(--header-${parseCSSVarId(header.id)}-size) * 1px)`,
  }
  if (layoutMode === 'grid') {
    styles.flex = `${
      [0, false].includes(def.grow!) ? 0 : `var(--header-${parseCSSVarId(header.id)}-size)`
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

const columnActionsEnabled = computed(() => {
  const { enableColumnActions } = props.table.options
  const def = columnDef.value
  return (enableColumnActions || def.enableColumnActions) && def.enableColumnActions !== false
})

const showColumnButtons = computed(
  () =>
    !props.table.options.enableHeaderActionsHoverReveal ||
    isOpenedColumnActions.value ||
    (isHoveredHeadCell.value &&
      !props.table.getVisibleFlatColumns().find((col) => col.getIsResizing())),
)

const showDragHandle = computed(() => {
  const { enableColumnDragging, enableColumnOrdering, enableGrouping } = props.table.options
  const def = columnDef.value
  const { grouping } = props.table.getState()

  return (
    enableColumnDragging !== false &&
    def.enableColumnDragging !== false &&
    (enableColumnDragging ||
      (enableColumnOrdering && def.enableColumnOrdering !== false) ||
      (enableGrouping && def.enableGrouping !== false && !grouping.includes(column.value.id))) &&
    showColumnButtons.value
  )
})

const headerPaddingLeft = computed(() => {
  let padding = 0
  if (column.value.getCanSort()) padding++
  if (showColumnButtons.value && (columnActionsEnabled.value || showDragHandle.value))
    padding += 1.75
  if (showDragHandle.value) padding += 1.25
  return padding
})

const cellStyle = computed(() => {
  const pinned = isColumnPinned.value
  return {
    ...widthStyles.value,
    '--mvt-table-cell-left': pinned === 'left' ? `${column.value.getStart(pinned)}` : undefined,
    '--mvt-table-cell-right': pinned === 'right' ? `${column.value.getAfter(pinned)}` : undefined,
    ...parseFromValuesOrFunc(tableCellProps.value.style, theme),
  }
})

const handleDragEnter = () => {
  const { table } = props
  const { enableColumnOrdering, enableGrouping } = table.options
  const { draggingColumn, hoveredColumn } = table.getState()

  if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
    table.setHoveredColumn(null)
  }
  if (enableColumnOrdering && draggingColumn && columnDefType.value !== 'group') {
    table.setHoveredColumn(columnDef.value.enableColumnOrdering !== false ? column.value : null)
  }
}

const setHeadCellRef = (el: any) => {
  const node = (el?.$el ?? el) as HTMLTableCellElement
  if (node) {
    const { tableHeadCellRefs } = props.table.refs
    tableHeadCellRefs.value[column.value.id] = node
    if (columnDefType.value !== 'group') props.columnVirtualizer?.measureElement?.(node)
  }
}

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const cellProps = () => {
  const { columnVirtualizer, header, renderedHeaderIndex, table } = props
  const { columnResizeDirection, columnResizeMode, enableMultiSort } = table.options
  const { columnSizingInfo, draggingColumn, hoveredColumn } = table.getState()
  const pinned = isColumnPinned.value
  const tableCellRest = { ...tableCellProps.value }
  delete tableCellRest.children

  return {
    colspan: header.colSpan,
    'data-column-pinned': pinned || undefined,
    'data-dragging-column': draggingColumn?.id === column.value.id || undefined,
    'data-first-right-pinned':
      (pinned === 'right' && column.value.getIsFirstColumn(pinned)) || undefined,
    'data-hovered-column-target': hoveredColumn?.id === column.value.id || undefined,
    'data-index': renderedHeaderIndex,
    'data-last-left-pinned':
      (pinned === 'left' && column.value.getIsLastColumn(pinned)) || undefined,
    'data-resizing':
      (columnResizeMode === 'onChange' &&
        columnSizingInfo?.isResizingColumn === column.value.id &&
        columnResizeDirection) ||
      undefined,
    ...tableCellRest,
    align:
      columnDefType.value === 'group' ? 'center' : direction.dir.value === 'rtl' ? 'right' : 'left',
    class: clsx(
      classes.root,
      isGridLayout.value && classes['root-grid'],
      enableMultiSort && column.value.getCanSort() && classes['root-no-select'],
      columnVirtualizer && classes['root-virtualized'],
      tableCellProps.value.class,
    ),
    onDragenter: handleDragEnter,
    onMouseenter: () => {
      isHoveredHeadCell.value = true
    },
    onMouseleave: () => {
      isHoveredHeadCell.value = false
    },
    ref: setHeadCellRef,
    style: cellStyle.value,
  }
}

const contentClass = computed(() =>
  clsx(
    'mvt-table-head-cell-content',
    classes.content,
    (columnDefType.value === 'group' || tableCellProps.value.align === 'center') &&
      classes['content-center'],
    tableCellProps.value.align === 'right' && classes['content-right'],
    column.value.getCanResize() && classes['content-spaced'],
  ),
)

const labelsClass = computed(() =>
  clsx(
    'mvt-table-head-cell-labels',
    classes.labels,
    column.value.getCanSort() && columnDefType.value !== 'group' && classes['labels-sortable'],
    tableCellProps.value.align === 'right'
      ? classes['labels-right']
      : tableCellProps.value.align === 'center' && classes['labels-center'],
    columnDefType.value === 'data' && classes['labels-data'],
  ),
)

const contentWrapperClass = computed(() =>
  clsx(
    'mvt-table-head-cell-content-wrapper',
    classes['content-wrapper'],
    columnDefType.value === 'data' && classes['content-wrapper-hidden-overflow'],
    (columnDef.value.header?.length ?? 0) < 20 && classes['content-wrapper-nowrap'],
  ),
)

const labelsStyle = computed(() => ({
  '--mvt-table-head-cell-labels-padding-left': `${headerPaddingLeft.value}`,
}))

const toggleSortingHandler = computed(() => column.value.getToggleSortingHandler())

const renderHeaderElement = () => {
  const { header, table } = props
  const def = columnDef.value
  return def?.Header instanceof Function
    ? def.Header({ column: column.value, header, table })
    : (def?.Header ?? def.header)
}

const renderCellChildren = () => tableCellProps.value.children

const showFilterLabel = computed(
  () => column.value.getCanFilter() && (column.value.getIsFiltered() || showColumnButtons.value),
)
const showSortLabel = computed(
  () => column.value.getCanSort() && (column.value.getIsSorted() || showColumnButtons.value),
)
const showSubheaderFilter = computed(
  () => props.table.options.columnFilterDisplayMode === 'subheader' && column.value.getCanFilter(),
)

/** `MVT_TableHeadCellGrabHandle` reads the cell element through a ref-like box. */
const headCellRefBox = () =>
  ({
    value: props.table.refs.tableHeadCellRefs.value[column.value.id],
  }) as Ref<HTMLTableCellElement | null>

const setColumnActionsOpened = (opened: boolean) => {
  isOpenedColumnActions.value = opened
}
</script>

<template>
  <TableTh v-bind="cellProps()">
    <template v-if="!header.isPlaceholder">
      <MVT_RenderNode v-if="tableCellProps.children" :node="renderCellChildren()" />
      <Flex v-else :class="contentClass">
        <Flex :class="labelsClass" :style="labelsStyle" :onClick="toggleSortingHandler">
          <Flex :class="contentWrapperClass">
            <MVT_RenderNode :node="renderHeaderElement()" />
          </Flex>
          <MVT_TableHeadCellFilterLabel v-if="showFilterLabel" :header="header" :table="table" />
          <MVT_TableHeadCellSortLabel v-if="showSortLabel" :header="header" :table="table" />
        </Flex>
        <Flex
          v-if="columnDefType !== 'group'"
          :class="clsx('mvt-table-head-cell-content-actions', classes['content-actions'])"
        >
          <MVT_TableHeadCellGrabHandle
            v-if="showDragHandle"
            :column="column"
            :table="table"
            :tableHeadCellRef="headCellRefBox()"
          />
          <MVT_ColumnActionMenu
            v-if="columnActionsEnabled && showColumnButtons"
            :header="header"
            :onChange="setColumnActionsOpened"
            :opened="isOpenedColumnActions"
            :table="table"
          />
        </Flex>
        <MVT_TableHeadCellResizeHandle
          v-if="column.getCanResize()"
          :header="header"
          :table="table"
        />
      </Flex>
    </template>
    <MVT_TableHeadCellFilterContainer v-if="showSubheaderFilter" :header="header" :table="table" />
  </TableTh>
</template>
