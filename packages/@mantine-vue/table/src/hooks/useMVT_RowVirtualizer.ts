import { computed, type Ref } from 'vue'

import { type Range, useVirtualizer } from '@tanstack/vue-virtual'

import {
  type MVT_DensityState,
  type MVT_Row,
  type MVT_RowData,
  type MVT_RowVirtualizer,
  type MVT_TableInstance,
} from '../types'
import { parseFromValuesOrFunc } from '../utils/utils'
import { extraIndexRangeExtractor } from '../utils/virtualization.utils'

export const useMVT_RowVirtualizer = <
  TData extends MVT_RowData,
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableRowElement,
>(
  table: MVT_TableInstance<TData>,
  rows?: Ref<MVT_Row<TData>[]>,
): Ref<MVT_RowVirtualizer<TScrollElement, TItemElement>> | undefined => {
  const {
    getRowModel,
    getState,
    options: {
      enableRowVirtualization,
      renderDetailPanel,
      rowVirtualizerInstanceRef,
      rowVirtualizerOptions,
    },
    refs: { tableContainerRef },
  } = table

  if (!enableRowVirtualization) return undefined

  const rowVirtualizerProps = parseFromValuesOrFunc(rowVirtualizerOptions, {
    table,
  })

  const defaultRowHeightByDensity: Record<MVT_DensityState, number> = {
    lg: 62.7,
    md: 54.7,
    sm: 48.7,
    xl: 70.7,
    xs: 42.7,
  }

  const { density, draggingRow, expanded } = getState()

  const normalRowHeight = defaultRowHeightByDensity[density] ?? defaultRowHeightByDensity['md']

  const rowVirtualizerRef = useVirtualizer<HTMLDivElement, HTMLTableRowElement>(
    computed(() => {
      const rowCount = rows?.value.length ?? getRowModel().rows.length
      return {
        count: renderDetailPanel ? rowCount * 2 : rowCount,
        estimateSize: (index: number) =>
          renderDetailPanel && index % 2 === 1 ? (expanded === true ? 100 : 0) : normalRowHeight,
        getScrollElement: () => tableContainerRef.value as any,
        measureElement:
          typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
            ? (element: any) => element?.getBoundingClientRect().height
            : undefined,
        overscan: 4,
        rangeExtractor: (range: Range) => {
          const current_index = getRowModel().rows.findIndex((row) => row.id === draggingRow?.id)
          return extraIndexRangeExtractor(range, current_index >= 0 ? current_index : 0)
        },
        ...rowVirtualizerProps,
      }
    }) as any,
  )

  const rowVirtualizer = rowVirtualizerRef.value as unknown as MVT_RowVirtualizer<
    TScrollElement,
    TItemElement
  >

  if (!Object.getOwnPropertyDescriptor(rowVirtualizer, 'virtualRows')) {
    Object.defineProperty(rowVirtualizer, 'virtualRows', {
      configurable: true,
      get() {
        return this.getVirtualItems()
      },
    })
  }

  if (rowVirtualizerInstanceRef) {
    rowVirtualizerInstanceRef.value = rowVirtualizer as any
  }

  return rowVirtualizerRef as unknown as Ref<MVT_RowVirtualizer<TScrollElement, TItemElement>>
}
