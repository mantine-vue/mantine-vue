import { type CSSProperties, defineComponent, h, type PropType, ref, type Ref } from 'vue'

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
import { MVT_CopyButton } from '../buttons/MVT_CopyButton'
import { MVT_EditCellTextInput } from '../inputs/MVT_EditCellTextInput'
import { MVT_TableBodyCellValue } from './MVT_TableBodyCellValue'
import classes from './MVT_TableBodyCell.module.css'

export const MVT_TableBodyCell = defineComponent({
  name: 'MVTTableBodyCell',
  inheritAttrs: false,
  props: {
    cell: {
      type: Object as PropType<MVT_Cell<MVT_RowData>>,
      required: true,
    },
    numRows: { type: Number, default: 1 },
    renderedColumnIndex: { type: Number, default: 0 },
    renderedRowIndex: { type: Number, default: 0 },
    rowRef: {
      type: Object as PropType<Ref<HTMLTableRowElement | null>>,
      default: undefined,
    },
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
    virtualCell: {
      type: Object as PropType<MVT_VirtualItem>,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    const direction = useDirection()
    const theme = useMantineTheme()
    const skeletonWidth = ref(100)
    const isCellContentOverflowing = ref(false)
    const cellHoverRevealDivRef = ref<HTMLDivElement | null>(null)

    // compute a stable skeleton width once
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

    return () => {
      const { cell, numRows, renderedColumnIndex, renderedRowIndex, rowRef, table, virtualCell } =
        props
      const {
        getState,
        options: {
          columnResizeDirection,
          columnResizeMode,
          createDisplayMode,
          editDisplayMode,
          enableClickToCopy,
          enableColumnOrdering,
          enableColumnPinning,
          enableEditing,
          enableGrouping,
          layoutMode,
          mantineSkeletonProps,
          mantineTableBodyCellProps,
        },
        refs: { editInputRefs },
        setEditingCell,
        setHoveredColumn,
      } = table
      const {
        columnSizingInfo,
        creatingRow,
        density,
        draggingColumn,
        editingCell,
        editingRow,
        hoveredColumn,
        isLoading,
        showSkeletons,
      } = getState()
      const { column, row } = cell
      const { columnDef } = column
      const { columnDefType } = columnDef

      const args = {
        cell,
        column,
        renderedColumnIndex,
        renderedRowIndex,
        row,
        table,
      }
      const tableCellProps = {
        ...parseFromValuesOrFunc(mantineTableBodyCellProps, args),
        ...parseFromValuesOrFunc(columnDef.mantineTableBodyCellProps, args),
        ...attrs,
      }

      const skeletonProps = parseFromValuesOrFunc(mantineSkeletonProps, args)

      const widthStyles: CSSProperties = {
        minWidth: `max(calc(var(--col-${parseCSSVarId(
          column?.id,
        )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
        width: `calc(var(--col-${parseCSSVarId(column.id)}-size) * 1px)`,
      }
      if (layoutMode === 'grid') {
        widthStyles.flex = `${
          [0, false].includes(columnDef.grow!) ? 0 : `var(--col-${parseCSSVarId(column.id)}-size)`
        } 0 auto`
      } else if (layoutMode === 'grid-no-grow') {
        widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`
      }
      const isDraggingColumn = draggingColumn?.id === column.id
      const isHoveredColumn = hoveredColumn?.id === column.id
      const isColumnPinned =
        enableColumnPinning && columnDef.columnDefType !== 'group' && column.getIsPinned()

      const isEditable =
        !cell.getIsPlaceholder() &&
        parseFromValuesOrFunc(enableEditing, row) &&
        parseFromValuesOrFunc(columnDef.enableEditing, row) !== false

      const isEditing =
        isEditable &&
        !['custom', 'modal'].includes(editDisplayMode as string) &&
        (editDisplayMode === 'table' || editingRow?.id === row.id || editingCell?.id === cell.id) &&
        !row.getIsGrouped()

      const isCreating = isEditable && createDisplayMode === 'row' && creatingRow?.id === row.id

      const showClickToCopyButton =
        parseFromValuesOrFunc(enableClickToCopy, cell) ||
        (parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) &&
          parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) !== false)

      const handleDoubleClick = (event: MouseEvent) => {
        ;(tableCellProps as any)?.onDoubleClick?.(event)
        if (isEditable && editDisplayMode === 'cell') {
          setEditingCell(cell)
          setTimeout(() => {
            const textField = editInputRefs.value[cell.id]
            if (textField) {
              textField.focus()
              textField.select?.()
            }
          }, 100)
        }
      }

      const handleDragEnter = (e: DragEvent) => {
        ;(tableCellProps as any)?.onDragEnter?.(e)
        const { draggingColumn: dragging, hoveredColumn: hovered } = getState()
        if (enableGrouping && hovered?.id === 'drop-zone') {
          setHoveredColumn(null)
        }
        if (enableColumnOrdering && dragging) {
          setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null)
        }
      }

      const cellValueProps = {
        cell,
        renderedColumnIndex,
        renderedRowIndex,
        table,
      }

      const onMouseEnter = () => {
        if (!columnDef.enableCellHoverReveal) return
        const div = cellHoverRevealDivRef.value
        if (div) {
          isCellContentOverflowing.value = div.scrollWidth > div.clientWidth
        }
      }
      const onMouseLeave = () => {
        if (!columnDef.enableCellHoverReveal) return
        isCellContentOverflowing.value = false
      }

      const renderCellContent = () => {
        if (cell.getIsPlaceholder()) {
          return columnDef.PlaceholderCell?.({ cell, column, row, table }) ?? null
        }

        if (showSkeletons !== false && (isLoading || showSkeletons)) {
          return h(Skeleton, {
            height: 20,
            width: skeletonWidth.value,
            ...skeletonProps,
          } as any)
        }

        if (
          columnDefType === 'display' &&
          (['mvt-row-expand', 'mvt-row-numbers', 'mvt-row-select'].includes(column.id) ||
            !row.getIsGrouped())
        ) {
          return columnDef.Cell?.({
            column,
            renderedCellValue: cell.renderValue() as any,
            row,
            rowRef,
            ...cellValueProps,
          })
        }

        if (isCreating || isEditing) {
          return h(MVT_EditCellTextInput, { cell, table } as any)
        }

        if (showClickToCopyButton && columnDef.enableClickToCopy !== false) {
          return h(MVT_CopyButton, { cell, table } as any, () =>
            h(MVT_TableBodyCellValue, cellValueProps as any),
          )
        }

        return h(MVT_TableBodyCellValue, cellValueProps as any)
      }

      const groupedSuffix =
        cell.getIsGrouped() && !columnDef.GroupedCell ? ` (${row.subRows?.length})` : null

      const inner = columnDef.enableCellHoverReveal
        ? h(
            'div',
            {
              class: clsx(
                columnDef.enableCellHoverReveal &&
                  !(isCreating || isEditing) &&
                  classes['cell-hover-reveal'],
                isCellContentOverflowing.value && classes['overflowing'],
              ),
              ref: (el: any) => {
                cellHoverRevealDivRef.value = (el?.$el ?? el) as HTMLDivElement
              },
            },
            [renderCellContent(), groupedSuffix],
          )
        : [renderCellContent(), groupedSuffix]

      const style = {
        ...widthStyles,
        '--mvt-cell-align':
          (tableCellProps as any).align ?? (direction.dir.value === 'rtl' ? 'right' : 'left'),
        '--mvt-table-cell-left':
          isColumnPinned === 'left' ? `${column.getStart(isColumnPinned)}` : undefined,
        '--mvt-table-cell-right':
          isColumnPinned === 'right' ? `${column.getAfter(isColumnPinned)}` : undefined,
        ...parseFromValuesOrFunc((tableCellProps as any).style, theme),
      }

      const { children: cellChildren, ...tableCellRest } = tableCellProps as any

      return h(
        TableTd,
        {
          'data-column-pinned': isColumnPinned || undefined,
          'data-dragging-column': isDraggingColumn || undefined,
          'data-first-right-pinned':
            (isColumnPinned === 'right' && column.getIsFirstColumn(isColumnPinned)) || undefined,
          'data-hovered-column-target': isHoveredColumn || undefined,
          'data-index': renderedColumnIndex,
          'data-last-left-pinned':
            (isColumnPinned === 'left' && column.getIsLastColumn(isColumnPinned)) || undefined,
          'data-last-row': renderedRowIndex === numRows - 1 || undefined,
          'data-resizing':
            (columnResizeMode === 'onChange' &&
              columnSizingInfo?.isResizingColumn === column.id &&
              columnResizeDirection) ||
            undefined,
          ...tableCellRest,
          class: clsx(
            classes.root,
            layoutMode?.startsWith('grid') && classes['root-grid'],
            virtualCell && classes['root-virtualized'],
            isEditable && editDisplayMode === 'cell' && classes['root-cursor-pointer'],
            isEditable &&
              ['cell', 'table'].includes(editDisplayMode ?? '') &&
              columnDefType !== 'display' &&
              classes['root-editable-hover'],
            columnDefType === 'data' && classes['root-data-col'],
            density === 'xs' && classes['root-nowrap'],
            columnDef.enableCellHoverReveal && classes['root-cell-hover-reveal'],
            (tableCellProps as any)?.class,
          ),
          onDblclick: handleDoubleClick,
          onDragenter: handleDragEnter,
          onMouseenter: onMouseEnter,
          onMouseleave: onMouseLeave,
          style,
        } as any,
        () => cellChildren ?? inner,
      )
    }
  },
})

export const Memo_MVT_TableBodyCell = MVT_TableBodyCell
