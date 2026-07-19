import { computed, type Ref } from 'vue'

import { type Range, useVirtualizer } from '@tanstack/vue-virtual'

import { type MVT_ColumnVirtualizer, type MVT_RowData, type MVT_TableInstance } from '../types'
import { parseFromValuesOrFunc } from '../utils/utils'
import { extraIndexRangeExtractor } from '../utils/virtualization.utils'

export const useMVT_ColumnVirtualizer = <
  TData extends MVT_RowData,
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableCellElement,
>(
  table: MVT_TableInstance<TData>,
): Ref<MVT_ColumnVirtualizer> | undefined => {
  const {
    getLeftLeafColumns,
    getRightLeafColumns,
    getState,
    getVisibleLeafColumns,
    options: {
      columnVirtualizerInstanceRef,
      columnVirtualizerOptions,
      enableColumnPinning,
      enableColumnVirtualization,
    },
    refs: { tableContainerRef },
  } = table

  if (!enableColumnVirtualization) return undefined

  const columnVirtualizerProps = parseFromValuesOrFunc(columnVirtualizerOptions, { table })

  const visibleColumns = getVisibleLeafColumns()

  const { draggingColumn } = getState()

  const [leftPinnedIndexes, rightPinnedIndexes] = enableColumnPinning
    ? [
        getLeftLeafColumns().map((c) => c.getPinnedIndex()),
        getRightLeafColumns()
          .map((column) => visibleColumns.length - column.getPinnedIndex() - 1)
          .sort((a, b) => a - b),
      ]
    : [[] as number[], [] as number[]]

  const numPinnedLeft = leftPinnedIndexes.length
  const numPinnedRight = rightPinnedIndexes.length

  const draggingColumnIndex = draggingColumn?.id
    ? visibleColumns.findIndex((c) => c.id === draggingColumn?.id)
    : undefined

  const columnVirtualizerRef = useVirtualizer<HTMLDivElement, HTMLTableCellElement>(
    computed(() => ({
      count: visibleColumns.length,
      estimateSize: (index: number) => visibleColumns[index].getSize(),
      getScrollElement: () => tableContainerRef.value as any,
      horizontal: true,
      overscan: 3,
      rangeExtractor: (range: Range) => {
        const newIndexes = extraIndexRangeExtractor(range, draggingColumnIndex)
        if (!numPinnedLeft && !numPinnedRight) {
          return newIndexes
        }
        return [...new Set([...leftPinnedIndexes, ...newIndexes, ...rightPinnedIndexes])]
      },
      ...columnVirtualizerProps,
    })) as any,
  )

  const columnVirtualizer = columnVirtualizerRef.value as unknown as MVT_ColumnVirtualizer<
    TScrollElement,
    TItemElement
  >

  //expose the MVT-augmented properties as live getters
  Object.defineProperties(columnVirtualizer, {
    virtualColumns: {
      configurable: true,
      get() {
        return this.getVirtualItems()
      },
    },
    virtualPaddingLeft: {
      configurable: true,
      get() {
        const virtualColumns = this.getVirtualItems()
        const numColumns = virtualColumns.length
        if (!numColumns) return undefined
        const leftNonPinnedStart = virtualColumns[numPinnedLeft]?.start || 0
        const leftNonPinnedEnd = virtualColumns[leftPinnedIndexes.length - 1]?.end || 0
        return leftNonPinnedStart - leftNonPinnedEnd
      },
    },
    virtualPaddingRight: {
      configurable: true,
      get() {
        const virtualColumns = this.getVirtualItems()
        const numColumns = virtualColumns.length
        if (!numColumns) return undefined
        const totalSize = this.getTotalSize()
        const rightNonPinnedStart = virtualColumns[numColumns - numPinnedRight]?.start || 0
        const rightNonPinnedEnd = virtualColumns[numColumns - numPinnedRight - 1]?.end || 0
        return (
          totalSize - rightNonPinnedEnd - (numPinnedRight ? totalSize - rightNonPinnedStart : 0)
        )
      },
    },
  })

  if (columnVirtualizerInstanceRef) {
    columnVirtualizerInstanceRef.value = columnVirtualizer as any
  }

  return columnVirtualizerRef as unknown as Ref<MVT_ColumnVirtualizer>
}
