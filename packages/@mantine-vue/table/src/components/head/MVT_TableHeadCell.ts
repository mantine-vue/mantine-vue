import { type CSSProperties, defineComponent, h, type PropType, ref } from 'vue'

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
import { MVT_ColumnActionMenu } from '../menus/MVT_ColumnActionMenu'
import { MVT_TableHeadCellFilterContainer } from './MVT_TableHeadCellFilterContainer'
import { MVT_TableHeadCellFilterLabel } from './MVT_TableHeadCellFilterLabel'
import { MVT_TableHeadCellGrabHandle } from './MVT_TableHeadCellGrabHandle'
import { MVT_TableHeadCellResizeHandle } from './MVT_TableHeadCellResizeHandle'
import { MVT_TableHeadCellSortLabel } from './MVT_TableHeadCellSortLabel'
import classes from './MVT_TableHeadCell.module.css'

export const MVT_TableHeadCell = defineComponent({
  name: 'MVTTableHeadCell',
  inheritAttrs: false,
  props: {
    columnVirtualizer: {
      type: Object as PropType<MVT_ColumnVirtualizer>,
      default: undefined,
    },
    header: {
      type: Object as PropType<MVT_Header<MVT_RowData>>,
      required: true,
    },
    renderedHeaderIndex: { type: Number, default: 0 },
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const direction = useDirection()
    const theme = useMantineTheme()
    const isHoveredHeadCell = ref(false)
    const isOpenedColumnActions = ref(false)

    return () => {
      const { columnVirtualizer, header, renderedHeaderIndex, table } = props
      const {
        getState,
        options: {
          columnFilterDisplayMode,
          columnResizeDirection,
          columnResizeMode,
          enableColumnActions,
          enableColumnDragging,
          enableColumnOrdering,
          enableColumnPinning,
          enableGrouping,
          enableHeaderActionsHoverReveal,
          enableMultiSort,
          layoutMode,
          mantineTableHeadCellProps,
        },
        refs: { tableHeadCellRefs },
        setHoveredColumn,
      } = table
      const { columnSizingInfo, draggingColumn, grouping, hoveredColumn } = getState()
      const { column } = header
      const { columnDef } = column
      const { columnDefType } = columnDef

      const arg = { column, table }
      const tableCellProps = {
        ...parseFromValuesOrFunc(mantineTableHeadCellProps, arg),
        ...parseFromValuesOrFunc(columnDef.mantineTableHeadCellProps, arg),
        ...attrs,
      }

      const widthStyles: CSSProperties = {
        minWidth: `max(calc(var(--header-${parseCSSVarId(
          header?.id,
        )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
        width: `calc(var(--header-${parseCSSVarId(header.id)}-size) * 1px)`,
      }
      if (layoutMode === 'grid') {
        widthStyles.flex = `${
          [0, false].includes(columnDef.grow!)
            ? 0
            : `var(--header-${parseCSSVarId(header.id)}-size)`
        } 0 auto`
      } else if (layoutMode === 'grid-no-grow') {
        widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`
      }

      const isColumnPinned =
        enableColumnPinning && columnDef.columnDefType !== 'group' && column.getIsPinned()

      const isDraggingColumn = draggingColumn?.id === column.id
      const isHoveredColumn = hoveredColumn?.id === column.id

      const columnActionsEnabled =
        (enableColumnActions || columnDef.enableColumnActions) &&
        columnDef.enableColumnActions !== false

      const showColumnButtons =
        !enableHeaderActionsHoverReveal ||
        isOpenedColumnActions.value ||
        (isHoveredHeadCell.value &&
          !table.getVisibleFlatColumns().find((col) => col.getIsResizing()))

      const showDragHandle =
        enableColumnDragging !== false &&
        columnDef.enableColumnDragging !== false &&
        (enableColumnDragging ||
          (enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
          (enableGrouping &&
            columnDef.enableGrouping !== false &&
            !grouping.includes(column.id))) &&
        showColumnButtons

      let headerPL = 0
      if (column.getCanSort()) headerPL++
      if (showColumnButtons && (columnActionsEnabled || showDragHandle)) headerPL += 1.75
      if (showDragHandle) headerPL += 1.25

      const handleDragEnter = (_e: DragEvent) => {
        const { draggingColumn: dragging, hoveredColumn: hovered } = getState()
        if (enableGrouping && hovered?.id === 'drop-zone') {
          setHoveredColumn(null)
        }
        if (enableColumnOrdering && dragging && columnDefType !== 'group') {
          setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null)
        }
      }

      const headerElement =
        columnDef?.Header instanceof Function
          ? columnDef?.Header?.({ column, header, table })
          : (columnDef?.Header ?? columnDef.header)

      const align =
        columnDefType === 'group' ? 'center' : direction.dir.value === 'rtl' ? 'right' : 'left'

      const style = {
        ...widthStyles,
        '--mvt-table-cell-left':
          isColumnPinned === 'left' ? `${column.getStart(isColumnPinned)}` : undefined,
        '--mvt-table-cell-right':
          isColumnPinned === 'right' ? `${column.getAfter(isColumnPinned)}` : undefined,
        ...parseFromValuesOrFunc((tableCellProps as any)?.style, theme),
      }

      const { children: cellChildren, ...tableCellRest } = tableCellProps as any

      const content = header.isPlaceholder
        ? null
        : (cellChildren ??
          h(
            Flex,
            {
              class: clsx(
                'mvt-table-head-cell-content',
                classes.content,
                (columnDefType === 'group' || (tableCellProps as any)?.align === 'center') &&
                  classes['content-center'],
                (tableCellProps as any)?.align === 'right' && classes['content-right'],
                column.getCanResize() && classes['content-spaced'],
              ),
            } as any,
            () => [
              h(
                Flex,
                {
                  style: {
                    '--mvt-table-head-cell-labels-padding-left': `${headerPL}`,
                  },
                  class: clsx(
                    'mvt-table-head-cell-labels',
                    classes.labels,
                    column.getCanSort() && columnDefType !== 'group' && classes['labels-sortable'],
                    (tableCellProps as any)?.align === 'right'
                      ? classes['labels-right']
                      : (tableCellProps as any)?.align === 'center' && classes['labels-center'],
                    columnDefType === 'data' && classes['labels-data'],
                  ),
                  onClick: column.getToggleSortingHandler(),
                } as any,
                () => [
                  h(
                    Flex,
                    {
                      class: clsx(
                        'mvt-table-head-cell-content-wrapper',
                        classes['content-wrapper'],
                        columnDefType === 'data' && classes['content-wrapper-hidden-overflow'],
                        (columnDef.header?.length ?? 0) < 20 && classes['content-wrapper-nowrap'],
                      ),
                    } as any,
                    () => headerElement,
                  ),
                  column.getCanFilter() &&
                    (column.getIsFiltered() || showColumnButtons) &&
                    h(MVT_TableHeadCellFilterLabel, { header, table } as any),
                  column.getCanSort() &&
                    (column.getIsSorted() || showColumnButtons) &&
                    h(MVT_TableHeadCellSortLabel, { header, table } as any),
                ],
              ),
              columnDefType !== 'group' &&
                h(
                  Flex,
                  {
                    class: clsx('mvt-table-head-cell-content-actions', classes['content-actions']),
                  } as any,
                  () => [
                    showDragHandle &&
                      h(MVT_TableHeadCellGrabHandle, {
                        column,
                        table,
                        tableHeadCellRef: {
                          value: tableHeadCellRefs.value[column.id],
                        },
                      } as any),
                    columnActionsEnabled &&
                      showColumnButtons &&
                      h(MVT_ColumnActionMenu, {
                        header,
                        onChange: (v: boolean) => {
                          isOpenedColumnActions.value = v
                        },
                        opened: isOpenedColumnActions.value,
                        table,
                      } as any),
                  ],
                ),
              column.getCanResize() && h(MVT_TableHeadCellResizeHandle, { header, table } as any),
            ],
          ))

      return h(
        TableTh,
        {
          colspan: header.colSpan,
          'data-column-pinned': isColumnPinned || undefined,
          'data-dragging-column': isDraggingColumn || undefined,
          'data-first-right-pinned':
            (isColumnPinned === 'right' && column.getIsFirstColumn(isColumnPinned)) || undefined,
          'data-hovered-column-target': isHoveredColumn || undefined,
          'data-index': renderedHeaderIndex,
          'data-last-left-pinned':
            (isColumnPinned === 'left' && column.getIsLastColumn(isColumnPinned)) || undefined,
          'data-resizing':
            (columnResizeMode === 'onChange' &&
              columnSizingInfo?.isResizingColumn === column.id &&
              columnResizeDirection) ||
            undefined,
          ...tableCellRest,
          align,
          class: clsx(
            classes.root,
            layoutMode?.startsWith('grid') && classes['root-grid'],
            enableMultiSort && column.getCanSort() && classes['root-no-select'],
            columnVirtualizer && classes['root-virtualized'],
            (tableCellProps as any)?.class,
          ),
          onDragenter: handleDragEnter,
          onMouseenter: () => {
            isHoveredHeadCell.value = true
          },
          onMouseleave: () => {
            isHoveredHeadCell.value = false
          },
          ref: (el: any) => {
            const node = (el?.$el ?? el) as HTMLTableCellElement
            if (node) {
              tableHeadCellRefs.value[column.id] = node
              if (columnDefType !== 'group') {
                columnVirtualizer?.measureElement?.(node)
              }
            }
          },
          style,
        } as any,
        () => [
          content,
          columnFilterDisplayMode === 'subheader' &&
            column.getCanFilter() &&
            h(MVT_TableHeadCellFilterContainer, { header, table } as any),
        ],
      )
    }
  },
})
