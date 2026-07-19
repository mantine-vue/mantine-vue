import { defineComponent, h, type PropType, ref } from 'vue'

import { Box, TableTr } from '@mantine-vue/core'

import clsx from 'clsx'

import {
  type MVT_Cell,
  type MVT_ColumnVirtualizer,
  type MVT_DensityState,
  type MVT_Row,
  type MVT_RowData,
  type MVT_RowVirtualizer,
  type MVT_TableInstance,
  type MVT_VirtualItem,
} from '../../types'
import { getIsRowSelected } from '../../utils/row.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { useMVT_Slots } from '../MVT_TableSlots'
import { MVT_TableBodyCell } from './MVT_TableBodyCell'
import { MVT_TableDetailPanel } from './MVT_TableDetailPanel'
import classes from './MVT_TableBodyRow.module.css'

export const MVT_TableBodyRow = defineComponent({
  name: 'MVTTableBodyRow',
  inheritAttrs: false,
  props: {
    columnVirtualizer: {
      type: Object as PropType<MVT_ColumnVirtualizer>,
      default: undefined,
    },
    numRows: { type: Number, default: undefined },
    pinnedRowIds: {
      type: Array as PropType<string[]>,
      default: undefined,
    },
    renderedRowIndex: { type: Number, default: 0 },
    row: {
      type: Object as PropType<MVT_Row<MVT_RowData>>,
      required: true,
    },
    rowVirtualizer: {
      type: Object as PropType<MVT_RowVirtualizer>,
      default: undefined,
    },
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
    tableProps: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    virtualRow: {
      type: Object as PropType<MVT_VirtualItem>,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    const rowRef = ref<HTMLTableRowElement | null>(null)
    const mvtSlots = useMVT_Slots()

    return () => {
      const {
        columnVirtualizer,
        numRows,
        pinnedRowIds,
        renderedRowIndex,
        row,
        rowVirtualizer,
        table,
        tableProps,
        virtualRow,
      } = props
      const {
        getState,
        options: {
          enableRowOrdering,
          enableRowPinning,
          enableStickyFooter,
          enableStickyHeader,
          layoutMode,
          mantineTableBodyRowProps,
          renderDetailPanel,
          rowPinningDisplayMode,
        },
        refs: { tableFooterRef, tableHeadRef },
        setHoveredRow,
      } = table
      const {
        density,
        // draggingColumn,
        draggingRow,
        // editingCell,
        // editingRow,
        hoveredRow,
        isFullScreen,
      } = getState()

      const showDetailPanel = renderDetailPanel || mvtSlots.detailPanel

      const visibleCells = row.getVisibleCells()

      const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } = columnVirtualizer ?? {}

      const isRowSelected = getIsRowSelected({ row, table })
      const isRowPinned = enableRowPinning && row.getIsPinned()
      const isRowStickyPinned = isRowPinned && rowPinningDisplayMode?.includes('sticky') && 'sticky'
      const isDraggingRow = draggingRow?.id === row.id
      const isHoveredRow = hoveredRow?.id === row.id

      const tableRowProps = {
        ...parseFromValuesOrFunc(mantineTableBodyRowProps, {
          renderedRowIndex,
          row,
          table,
        }),
        ...attrs,
      }

      const [bottomPinnedIndex, topPinnedIndex] =
        !enableRowPinning || !isRowStickyPinned || !pinnedRowIds || !row.getIsPinned()
          ? [undefined, undefined]
          : [[...pinnedRowIds].reverse().indexOf(row.id), pinnedRowIds.indexOf(row.id)]

      const tableHeadHeight =
        ((enableStickyHeader || isFullScreen) && tableHeadRef.value?.clientHeight) || 0
      const tableFooterHeight = (enableStickyFooter && tableFooterRef.value?.clientHeight) || 0

      const defaultRowHeightByDensity: Record<MVT_DensityState, number> = {
        lg: 61,
        md: 53,
        sm: 45,
        xl: 69,
        xs: 37,
      }

      const rowHeight =
        parseInt((tableRowProps as any)?.style?.height, 10) ||
        (defaultRowHeightByDensity[density] ?? defaultRowHeightByDensity['md'])

      const handleDragEnter = (_e: DragEvent) => {
        if (enableRowOrdering && getState().draggingRow) {
          setHoveredRow(row)
        }
      }

      let striped = tableProps.striped as boolean | string
      if (striped) {
        if (striped === true) striped = 'odd'
        if (striped === 'odd' && renderedRowIndex % 2 !== 0) striped = false
        if (striped === 'even' && renderedRowIndex % 2 === 0) striped = false
      }

      const style = {
        ...(tableRowProps as any)?.style,
        '--mvt-pinned-row-bottom':
          !virtualRow && bottomPinnedIndex !== undefined && isRowPinned
            ? `${bottomPinnedIndex * rowHeight + (enableStickyFooter ? tableFooterHeight - 1 : 0)}`
            : undefined,
        '--mvt-pinned-row-top': virtualRow
          ? undefined
          : topPinnedIndex !== undefined && isRowPinned
            ? `${
                topPinnedIndex * rowHeight +
                (enableStickyHeader || isFullScreen ? tableHeadHeight - 1 : 0)
              }`
            : undefined,
        '--mvt-virtual-row-start': virtualRow ? `${virtualRow.start}` : undefined,
      }

      const cells = slots.default
        ? slots.default()
        : (virtualColumns ?? row.getVisibleCells()).map(
            (cellOrVirtualCell, renderedColumnIndex) => {
              let cell = cellOrVirtualCell as MVT_Cell<MVT_RowData>
              let index = renderedColumnIndex
              if (columnVirtualizer) {
                index = (cellOrVirtualCell as MVT_VirtualItem).index
                cell = visibleCells[index]
              }
              return h(MVT_TableBodyCell, {
                cell,
                key: cell.id,
                numRows,
                renderedColumnIndex: index,
                renderedRowIndex,
                rowRef,
                table,
                virtualCell: columnVirtualizer ? (cellOrVirtualCell as MVT_VirtualItem) : undefined,
              } as any)
            },
          )

      return [
        h(
          TableTr,
          {
            'data-dragging-row': isDraggingRow || undefined,
            'data-hovered-row-target': isHoveredRow || undefined,
            'data-index': showDetailPanel ? renderedRowIndex * 2 : renderedRowIndex,
            'data-row-pinned': isRowStickyPinned || isRowPinned || undefined,
            'data-selected': isRowSelected || undefined,
            'data-striped': striped,
            onDragenter: handleDragEnter,
            ref: (el: any) => {
              const node = (el?.$el ?? el) as HTMLTableRowElement
              if (node) {
                rowRef.value = node
                rowVirtualizer?.measureElement?.(node)
              }
            },
            ...tableRowProps,
            style,
            class: clsx(
              classes.root,
              layoutMode?.startsWith('grid') && classes['root-grid'],
              virtualRow && classes['root-virtualized'],
              (tableRowProps as any)?.class,
            ),
          } as any,
          () => [
            virtualPaddingLeft
              ? h(Box, {
                  component: 'td',
                  display: 'flex',
                  w: virtualPaddingLeft,
                } as any)
              : null,
            cells,
            virtualPaddingRight
              ? h(Box, {
                  component: 'td',
                  display: 'flex',
                  w: virtualPaddingRight,
                } as any)
              : null,
          ],
        ),
        showDetailPanel &&
          !row.getIsGrouped() &&
          h(MVT_TableDetailPanel, {
            parentRowRef: rowRef,
            renderedRowIndex,
            row,
            rowVirtualizer,
            striped,
            table,
            virtualRow,
          } as any),
      ]
    }
  },
})

export const Memo_MVT_TableBodyRow = MVT_TableBodyRow
