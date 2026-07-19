import { computed, type ComputedRef } from 'vue'

import { type MVT_Row, type MVT_RowData, type MVT_TableInstance } from '../types'
import { getMVT_Rows } from '../utils/row.utils'

/**
 * Returns the MVT-adjusted rows (ranking, pinning, and creating-row insertion)
 */
export const useMVT_Rows = <TData extends MVT_RowData>(
  table: MVT_TableInstance<TData>,
): ComputedRef<MVT_Row<TData>[]> => {
  return computed(() => {
    const { creatingRow, expanded, globalFilter, pagination, rowPinning, sorting } =
      table.getState()
    void creatingRow
    void expanded
    void globalFilter
    void pagination.pageIndex
    void pagination.pageSize
    void rowPinning
    void sorting
    void table.getRowModel().rows
    return getMVT_Rows(table)
  })
}
