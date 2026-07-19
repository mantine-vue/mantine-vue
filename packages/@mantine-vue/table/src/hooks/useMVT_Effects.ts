import { onMounted, ref, watch } from 'vue'

import { type MVT_RowData, type MVT_SortingState, type MVT_TableInstance } from '../types'
import { getDefaultColumnOrderIds } from '../utils/displayColumn.utils'
import { getCanRankRows } from '../utils/row.utils'

/**
 * Side effects for the table instance.
 */
export const useMVT_Effects = <TData extends MVT_RowData>(table: MVT_TableInstance<TData>) => {
  const {
    getIsSomeRowsPinned,
    getPrePaginationRowModel,
    getState,
    options: { enablePagination, enableRowPinning, rowCount },
  } = table

  const initialBodyHeight = ref<string>()
  const previousTop = ref<number>()
  const appliedSort = ref<MVT_SortingState>(getState().sorting)

  onMounted(() => {
    if (typeof window !== 'undefined') {
      initialBodyHeight.value = document.body.style.height
    }
  })

  //hide scrollbars when table is in full screen mode, preserve body scroll position after full screen exit
  watch(
    () => getState().isFullScreen,
    (isFullScreen) => {
      if (typeof window !== 'undefined') {
        if (isFullScreen) {
          previousTop.value = document.body.getBoundingClientRect().top //save scroll position
          document.body.style.height = '100dvh' //hide page scrollbars when table is in full screen mode
        } else {
          document.body.style.height = initialBodyHeight.value as string
          if (!previousTop.value) return
          //restore scroll position
          window.scrollTo({
            behavior: 'instant',
            top: -1 * (previousTop.value as number),
          })
        }
      }
    },
    { flush: 'post' },
  )

  //recalculate column order when columns change or features are toggled on/off
  watch(
    () => table.options.columns.length,
    (totalColumnCount) => {
      if (totalColumnCount !== getState().columnOrder.length) {
        table.setColumnOrder(getDefaultColumnOrderIds(table.options as any))
      }
    },
    { flush: 'post' },
  )

  //if page index is out of bounds, set it to the last page
  watch(
    () => rowCount ?? getPrePaginationRowModel().rows.length,
    (totalRowCount) => {
      const { isLoading, pagination, showSkeletons } = getState()
      if (!enablePagination || isLoading || showSkeletons) return
      const { pageIndex, pageSize } = pagination
      const firstVisibleRowIndex = pageIndex * pageSize
      if (firstVisibleRowIndex >= totalRowCount && firstVisibleRowIndex > 0) {
        table.setPageIndex(Math.ceil(totalRowCount / pageSize) - 1)
      }
    },
    { flush: 'post' },
  )

  //track the last applied sort
  watch(
    () => getState().sorting,
    (sorting) => {
      if (sorting.length) {
        appliedSort.value = sorting
      }
    },
    { flush: 'post' },
  )

  //turn off sort when global filter is looking for ranked results
  watch(
    () => getState().globalFilter,
    () => {
      if (!getCanRankRows(table)) return
      if (getState().globalFilter) {
        table.setSorting([])
      } else {
        table.setSorting(() => appliedSort.value || [])
      }
    },
    { flush: 'post' },
  )

  //fix pinned row top style when density changes
  watch(
    () => getState().density,
    () => {
      if (enableRowPinning && getIsSomeRowsPinned()) {
        setTimeout(() => {
          //touch a reactive dependency to force a re-render, used here to recompute pinned-row offsets
          table.setDensity((d) => d)
        }, 150)
      }
    },
    { flush: 'post' },
  )
}
