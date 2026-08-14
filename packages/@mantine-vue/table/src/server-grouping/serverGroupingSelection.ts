import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../types'
import { parseFromValuesOrFunc } from '../utils/utils'
import type {
  MVT_ServerGroupingSelectionPayload,
  MVT_ServerGroupingSelectionSummary,
} from './serverGrouping.types'
import type { MVT_ServerGroupingManager } from './useMVT_ServerGrouping'

/** Any MVT table instance — selection helpers never depend on the row type. */
type AnyTable = MVT_TableInstance<any>

/** The server-grouping engine of a table, when server grouping is active. */
export const getServerGroupingManager = (
  table: AnyTable,
): MVT_ServerGroupingManager<MVT_RowData> | undefined =>
  (table as any)._serverGrouping as MVT_ServerGroupingManager<MVT_RowData> | undefined

/**
 * Record rows that the user may currently select: loaded records inside
 * expanded groups only (never group rows, never collapsed or unloaded
 * groups), filtered by `enableRowSelection`.
 */
export const getServerGroupingSelectableRows = (table: AnyTable): MVT_Row<MVT_RowData>[] => {
  const manager = getServerGroupingManager(table)
  if (!manager) return []
  const { enableRowSelection } = table.options
  return manager
    .getVisibleRecordRows()
    .filter((row) => parseFromValuesOrFunc(enableRowSelection, row) !== false)
}

/** Whether one record row is selected, honoring exclude mode. */
export const isServerGroupingRecordSelected = (
  table: AnyTable,
  row: MVT_Row<MVT_RowData>,
): boolean => {
  const selectAll = getServerGroupingManager(table)?.getSelectAll()
  if (selectAll?.active) return !selectAll.excludedRowIds.includes(row.id)
  return !!table.getState().rowSelection?.[row.id]
}

/**
 * Header-checkbox state for a server-grouped table.
 *
 * In *include* mode `isAll` means "every selectable loaded record is
 * selected". In *exclude* mode ("all matching records") the selection is a
 * query, so the checkbox is checked, and turns indeterminate as soon as the
 * user unchecks individual rows.
 */
export const getServerGroupingSelectionSummary = (
  table: AnyTable,
): MVT_ServerGroupingSelectionSummary => {
  const rows = getServerGroupingSelectableRows(table)
  const selectAll = getServerGroupingManager(table)?.getSelectAll() ?? {
    active: false,
    excludedRowIds: [],
  }

  if (selectAll.active) {
    const excludedVisible = rows.filter((row) => selectAll.excludedRowIds.includes(row.id)).length
    return {
      excludedRowIds: selectAll.excludedRowIds,
      isAll: selectAll.excludedRowIds.length === 0,
      isSelectAllMatching: true,
      isSome: selectAll.excludedRowIds.length > 0,
      mode: 'exclude',
      selectableCount: rows.length,
      selectedCount: rows.length - excludedVisible,
      selectedRowIds: [],
    }
  }

  const rowSelection = table.getState().rowSelection ?? {}
  const selectedCount = rows.filter((row) => rowSelection[row.id]).length
  // Include selected ids whose groups have since collapsed.
  const selectedRowIds = Object.keys(rowSelection).filter((rowId) => rowSelection[rowId])
  const isAll = rows.length > 0 && selectedCount === rows.length
  return {
    excludedRowIds: [],
    isAll,
    isSelectAllMatching: false,
    // Keep off-screen selections visible through the indeterminate state.
    isSome: !isAll && selectedRowIds.length > 0,
    mode: 'include',
    selectableCount: rows.length,
    selectedCount,
    selectedRowIds,
  }
}

/**
 * Everything a bulk action needs to send to the server.
 *
 * In exclude mode this is the query plus the user's deselections — no row ids
 * are transferred, so it scales to millions of matching records.
 */
export const getServerGroupingSelectionPayload = (
  table: AnyTable,
): MVT_ServerGroupingSelectionPayload => {
  const manager = getServerGroupingManager(table)
  const summary = getServerGroupingSelectionSummary(table)
  const tableState = table.getState()
  return {
    columnFilters: tableState.columnFilters ?? [],
    excludedRowIds: summary.excludedRowIds,
    globalFilter: tableState.globalFilter,
    grouping: manager?.getGroupingFields() ?? [],
    mode: summary.mode,
    rowIds: summary.selectedRowIds,
    sorting: tableState.sorting ?? [],
  }
}

/**
 * Header-checkbox toggle.
 *
 * - **Checking** selects every loaded record inside expanded groups. Records in
 *   collapsed or unloaded groups are never implicitly selected.
 * - **Unchecking** clears the *entire* selection — including records whose
 *   group was collapsed since, and everything added by "select all matching
 *   records". Removing only the on-screen ids would leave invisible records
 *   selected while the header checkbox reads unchecked.
 */
export const toggleAllServerGroupingRecordsSelected = (table: AnyTable, value?: boolean): void => {
  const manager = getServerGroupingManager(table)
  const summary = getServerGroupingSelectionSummary(table)
  const next = value ?? !(summary.isAll || summary.isSelectAllMatching)
  if (!next) {
    // Unchecking leaves exclude mode, so an all-matching selection never survives.
    manager?.setSelectAll({ active: false, excludedRowIds: [] })
    table.setRowSelection({})
    return
  }
  // Rechecking in exclude mode removes the corresponding exclusions.
  if (summary.isSelectAllMatching) {
    manager?.setSelectAll({ active: true, excludedRowIds: [] })
    return
  }
  const rows = getServerGroupingSelectableRows(table)
  table.setRowSelection((prev: Record<string, boolean>) => {
    const selection = { ...prev }
    rows.forEach((row) => {
      selection[row.id] = true
    })
    return selection
  })
}

/** Deselect the given record ids (used by `selection.clearOnCollapse`). */
export const deselectServerGroupingRecords = (table: AnyTable, rowIds: string[]): void => {
  if (!rowIds.length) return
  table.setRowSelection((prev: Record<string, boolean>) => {
    const selection = { ...prev }
    rowIds.forEach((rowId) => delete selection[rowId])
    return selection
  })
}

/**
 * Toggle a single server-grouping record.
 *
 * Provider rows live outside the table's row model (`data` is empty), so
 * `row.toggleSelected()` — which resolves the row through `table.getRow()` —
 * would throw. Selection state is mutated directly instead.
 *
 * Supports shift-click range selection across the loaded records currently on
 * screen, matching the behavior of a regular MVT table.
 */
export const toggleServerGroupingRecordSelected = (
  table: AnyTable,
  row: MVT_Row<MVT_RowData>,
  value: boolean,
  options?: { batch?: boolean; lastSelectedRowId?: null | string },
): void => {
  const manager = getServerGroupingManager(table)
  const rows = getServerGroupingSelectableRows(table)
  const targetIds = new Set<string>([row.id])

  if (options?.batch && options.lastSelectedRowId) {
    const lastIndex = rows.findIndex((candidate) => candidate.id === options.lastSelectedRowId)
    const currentIndex = rows.findIndex((candidate) => candidate.id === row.id)
    if (lastIndex !== -1 && currentIndex !== -1) {
      const [start, end] =
        lastIndex < currentIndex ? [lastIndex, currentIndex] : [currentIndex, lastIndex]
      for (let index = start; index <= end; index++) targetIds.add(rows[index].id)
    }
  }

  // Exclude mode tracks deselections instead of selections.
  const selectAll = manager?.getSelectAll()
  if (selectAll?.active) {
    const excluded = new Set(selectAll.excludedRowIds)
    targetIds.forEach((rowId) => {
      if (value) excluded.delete(rowId)
      else excluded.add(rowId)
    })
    manager!.setSelectAll({ active: true, excludedRowIds: [...excluded] })
    return
  }

  table.setRowSelection((prev: Record<string, boolean>) => {
    const selection = { ...prev }
    targetIds.forEach((rowId) => {
      if (value) selection[rowId] = true
      else delete selection[rowId]
    })
    return selection
  })
}

/**
 * Opt-in "select all matching records" action: asks the consumer-provided
 * `serverGrouping.selection.loadAllMatchingRowIds` for every row id matching
 * the current filters (across all groups and pages) and selects them.
 */
export const selectAllMatchingServerGroupingRecords = async (table: AnyTable): Promise<void> => {
  const manager = getServerGroupingManager(table)
  if (!manager) return
  const selectionOptions = manager.options.selection

  // Query mode transfers no ids and scales independently of the result count.
  if ((selectionOptions?.selectAllMode ?? 'query') === 'query') {
    table.setRowSelection({})
    manager.setSelectAll({ active: true, excludedRowIds: [] })
    return
  }

  // Explicit-id mode is intended only for small, bounded datasets.
  const loadAllMatchingRowIds = selectionOptions?.loadAllMatchingRowIds
  if (!loadAllMatchingRowIds) return
  const tableState = table.getState()
  const rowIds = await loadAllMatchingRowIds({
    columnFilters: tableState.columnFilters ?? [],
    globalFilter: tableState.globalFilter,
    grouping: manager.getGroupingFields(),
    sorting: tableState.sorting ?? [],
    table,
  })
  table.setRowSelection((prev: Record<string, boolean>) => {
    const selection = { ...prev }
    rowIds.forEach((rowId) => {
      selection[rowId] = true
    })
    return selection
  })
}
