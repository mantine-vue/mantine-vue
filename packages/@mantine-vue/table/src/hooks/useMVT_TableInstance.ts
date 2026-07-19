import { computed, ref, shallowRef } from 'vue'

import { useVueTable } from '@tanstack/vue-table'

import {
  type MVT_Cell,
  type MVT_Column,
  type MVT_ColumnDef,
  type MVT_ColumnFilterFnsState,
  type MVT_ColumnOrderState,
  type MVT_ColumnSizingInfoState,
  type MVT_DefinedTableOptions,
  type MVT_DensityState,
  type MVT_FilterOption,
  type MVT_GroupingState,
  type MVT_PaginationState,
  type MVT_Row,
  type MVT_RowData,
  type MVT_StatefulTableOptions,
  type MVT_TableInstance,
  type MVT_TableState,
  type MVT_Updater,
} from '../types'
import {
  getAllLeafColumnDefs,
  getColumnId,
  getDefaultColumnFilterFn,
  prepareColumns,
} from '../utils/column.utils'
import {
  getDefaultColumnOrderIds,
  showRowActionsColumn,
  showRowDragColumn,
  showRowExpandColumn,
  showRowNumbersColumn,
  showRowPinningColumn,
  showRowSelectionColumn,
  showRowSpacerColumn,
} from '../utils/displayColumn.utils'
import { createRow } from '../utils/tanstack.helpers'
import { getMVT_RowActionsColumnDef } from './display-columns/getMVT_RowActionsColumnDef'
import { getMVT_RowDragColumnDef } from './display-columns/getMVT_RowDragColumnDef'
import { getMVT_RowExpandColumnDef } from './display-columns/getMVT_RowExpandColumnDef'
import { getMVT_RowNumbersColumnDef } from './display-columns/getMVT_RowNumbersColumnDef'
import { getMVT_RowPinningColumnDef } from './display-columns/getMVT_RowPinningColumnDef'
import { getMVT_RowSelectColumnDef } from './display-columns/getMVT_RowSelectColumnDef'
import { getMVT_RowSpacerColumnDef } from './display-columns/getMVT_RowSpacerColumnDef'
import { useMVT_Effects } from './useMVT_Effects'

const applyUpdater = <T>(target: { value: T }, updater: MVT_Updater<T>) => {
  target.value = updater instanceof Function ? (updater as (prev: T) => T)(target.value) : updater
}

/**
 * The MVT composable that wraps TanStack's `useVueTable` and adds MVT
 * functionality. MVT-managed state slices are held in Vue refs and injected
 * into the table via reactive getters
 *
 * @param definedTableOptions - table options with proper defaults set
 * @returns the MVT table instance
 */
export const useMVT_TableInstance = <TData extends MVT_RowData>(
  definedTableOptions: MVT_DefinedTableOptions<TData>,
): MVT_TableInstance<TData> => {
  //DOM refs
  const lastSelectedRowId = ref<null | string>(null)
  const bottomToolbarRef = ref<HTMLDivElement | null>(null)
  const editInputRefs = ref<Record<string, HTMLInputElement>>({})
  const filterInputRefs = ref<Record<string, HTMLInputElement>>({})
  const searchInputRef = ref<HTMLInputElement | null>(null)
  const tableContainerRef = ref<HTMLDivElement | null>(null)
  const tableHeadCellRefs = ref<Record<string, HTMLTableCellElement>>({})
  const tablePaperRef = ref<HTMLDivElement | null>(null)
  const topToolbarRef = ref<HTMLDivElement | null>(null)
  const tableHeadRef = ref<HTMLTableSectionElement | null>(null)
  const tableFooterRef = ref<HTMLTableSectionElement | null>(null)

  //transform initial state with proper column order
  const initialState: Partial<MVT_TableState<TData>> = definedTableOptions.initialState ?? {}
  initialState.columnOrder =
    initialState.columnOrder ??
    getDefaultColumnOrderIds({
      ...definedTableOptions,
      state: {
        ...definedTableOptions.initialState,
        ...definedTableOptions.state,
      },
    } as MVT_StatefulTableOptions<TData>)
  initialState.globalFilterFn = definedTableOptions.globalFilterFn ?? 'fuzzy'

  definedTableOptions.initialState = initialState

  const mvtSlots = shallowRef<Record<string, unknown>>({})
  ;(definedTableOptions as any)._mvtSlots = mvtSlots

  const creatingRow = shallowRef<MVT_Row<TData> | null>(initialState.creatingRow ?? null)
  const columnFilterFns = ref<MVT_ColumnFilterFnsState>(
    Object.assign(
      {},
      ...getAllLeafColumnDefs(definedTableOptions.columns as MVT_ColumnDef<TData>[]).map((col) => ({
        [getColumnId(col)]:
          col.filterFn instanceof Function
            ? (col.filterFn.name ?? 'custom')
            : (col.filterFn ??
              initialState?.columnFilterFns?.[getColumnId(col)] ??
              getDefaultColumnFilterFn(col)),
      })),
    ),
  )
  const columnOrder = ref<MVT_ColumnOrderState>(initialState.columnOrder ?? [])
  const columnSizingInfo = shallowRef<MVT_ColumnSizingInfoState>(
    initialState.columnSizingInfo ?? ({} as MVT_ColumnSizingInfoState),
  )
  const density = ref<MVT_DensityState>(initialState?.density ?? 'md')
  const draggingColumn = shallowRef<MVT_Column<TData> | null>(initialState.draggingColumn ?? null)
  const draggingRow = shallowRef<MVT_Row<TData> | null>(initialState.draggingRow ?? null)
  const editingCell = shallowRef<MVT_Cell<TData> | null>(initialState.editingCell ?? null)
  const editingRow = shallowRef<MVT_Row<TData> | null>(initialState.editingRow ?? null)
  const globalFilterFn = ref<MVT_FilterOption>(initialState.globalFilterFn ?? 'fuzzy')
  const grouping = ref<MVT_GroupingState>(initialState.grouping ?? [])
  const hoveredColumn = shallowRef<null | Partial<MVT_Column<TData>>>(
    initialState.hoveredColumn ?? null,
  )
  const hoveredRow = shallowRef<null | Partial<MVT_Row<TData>>>(initialState.hoveredRow ?? null)
  const isFullScreen = ref<boolean>(initialState?.isFullScreen ?? false)
  const pagination = ref<MVT_PaginationState>(
    initialState?.pagination ?? { pageIndex: 0, pageSize: 10 },
  )
  const showAlertBanner = ref<boolean>(initialState?.showAlertBanner ?? false)
  const showColumnFilters = ref<boolean>(initialState?.showColumnFilters ?? false)
  const showGlobalFilter = ref<boolean>(initialState?.showGlobalFilter ?? false)
  const showToolbarDropZone = ref<boolean>(initialState?.showToolbarDropZone ?? false)

  //build the injected state object: user-provided state keys stay static
  //while all other MVT-managed slices are reactive getters over the refs above.
  const userState = definedTableOptions.state ?? {}
  const state = { ...userState } as MVT_TableState<TData>
  const defineState = <K extends keyof MVT_TableState<TData>>(
    key: K,
    getter: () => MVT_TableState<TData>[K],
  ) => {
    if (!(key in userState)) {
      Object.defineProperty(state, key, { enumerable: true, get: getter })
    }
  }
  defineState('columnFilterFns', () => columnFilterFns.value)
  defineState('columnOrder', () => columnOrder.value)
  defineState('columnSizingInfo', () => columnSizingInfo.value)
  defineState('creatingRow', () => creatingRow.value)
  defineState('density', () => density.value)
  defineState('draggingColumn', () => draggingColumn.value)
  defineState('draggingRow', () => draggingRow.value)
  defineState('editingCell', () => editingCell.value)
  defineState('editingRow', () => editingRow.value)
  defineState('globalFilterFn', () => globalFilterFn.value)
  defineState('grouping', () => grouping.value)
  defineState('hoveredColumn', () => hoveredColumn.value)
  defineState('hoveredRow', () => hoveredRow.value)
  defineState('isFullScreen', () => isFullScreen.value)
  defineState('pagination', () => pagination.value)
  defineState('showAlertBanner', () => showAlertBanner.value)
  defineState('showColumnFilters', () => showColumnFilters.value)
  defineState('showGlobalFilter', () => showGlobalFilter.value)
  defineState('showToolbarDropZone', () => showToolbarDropZone.value)

  definedTableOptions.state = state

  //The table options now include all state needed to help determine column
  //visibility and order logic
  const statefulTableOptions = definedTableOptions as MVT_StatefulTableOptions<TData>

  //don't recompute columnDefs while resizing column or dragging column/row
  let columnDefsCache: MVT_ColumnDef<TData>[] = []
  const columns = computed<MVT_ColumnDef<TData>[]>(() => {
    if (
      statefulTableOptions.state.columnSizingInfo.isResizingColumn ||
      statefulTableOptions.state.draggingColumn ||
      statefulTableOptions.state.draggingRow
    ) {
      return columnDefsCache
    }
    const prepared = prepareColumns({
      columnDefs: [
        ...([
          showRowPinningColumn(statefulTableOptions) &&
            getMVT_RowPinningColumnDef(statefulTableOptions),
          showRowDragColumn(statefulTableOptions) && getMVT_RowDragColumnDef(statefulTableOptions),
          showRowActionsColumn(statefulTableOptions) &&
            getMVT_RowActionsColumnDef(statefulTableOptions),
          showRowExpandColumn(statefulTableOptions) &&
            getMVT_RowExpandColumnDef(statefulTableOptions),
          showRowSelectionColumn(statefulTableOptions) &&
            getMVT_RowSelectColumnDef(statefulTableOptions),
          showRowNumbersColumn(statefulTableOptions) &&
            getMVT_RowNumbersColumnDef(statefulTableOptions),
        ].filter(Boolean) as MVT_ColumnDef<TData>[]),
        ...statefulTableOptions.columns,
        ...([
          showRowSpacerColumn(statefulTableOptions) &&
            getMVT_RowSpacerColumnDef(statefulTableOptions),
        ].filter(Boolean) as MVT_ColumnDef<TData>[]),
      ],
      tableOptions: statefulTableOptions,
    }) as unknown as MVT_ColumnDef<TData>[]
    columnDefsCache = prepared
    return prepared
  })

  //if loading, generate blank rows to show skeleton loaders
  const data = computed<TData[]>(() => {
    const s = statefulTableOptions.state
    return (s.isLoading || s.showSkeletons) && !definedTableOptions.data.length
      ? [...Array(Math.min(s.pagination.pageSize, 20)).fill(null)].map(() =>
          Object.assign(
            {},
            ...getAllLeafColumnDefs(columns.value).map((col) => ({
              [getColumnId(col)]: null,
            })),
          ),
        )
      : definedTableOptions.data
  })

  const { columns: _columns, data: _data, ...restOptions } = statefulTableOptions

  const table = useVueTable<TData>({
    onColumnOrderChange: (updater: MVT_Updater<MVT_ColumnOrderState>) =>
      applyUpdater(columnOrder, updater),
    onColumnSizingInfoChange: (updater: MVT_Updater<MVT_ColumnSizingInfoState>) =>
      applyUpdater(columnSizingInfo, updater),
    onGroupingChange: (updater: MVT_Updater<MVT_GroupingState>) => applyUpdater(grouping, updater),
    onPaginationChange: (updater: MVT_Updater<MVT_PaginationState>) =>
      applyUpdater(pagination, updater),
    ...(restOptions as any),
    get columns() {
      return columns.value as any
    },
    get data() {
      return data.value
    },
    globalFilterFn: statefulTableOptions.filterFns?.[globalFilterFn.value ?? 'fuzzy'],
  } as any) as unknown as MVT_TableInstance<TData>

  table.refs = {
    bottomToolbarRef,
    editInputRefs,
    filterInputRefs,
    lastSelectedRowId,
    searchInputRef,
    tableContainerRef,
    tableFooterRef,
    tableHeadCellRefs,
    tableHeadRef,
    tablePaperRef,
    topToolbarRef,
  }

  table.setCreatingRow = (row) => {
    let _row = row
    if (row === true) {
      _row = createRow(table)
    }
    if (statefulTableOptions?.onCreatingRowChange) {
      statefulTableOptions.onCreatingRowChange(_row as MVT_Row<TData> | null)
    } else {
      applyUpdater(creatingRow, _row as MVT_Row<TData> | null)
    }
  }
  table.setColumnFilterFns =
    statefulTableOptions.onColumnFilterFnsChange ??
    ((updater) => applyUpdater(columnFilterFns, updater))
  table.setDensity =
    statefulTableOptions.onDensityChange ?? ((updater) => applyUpdater(density, updater))
  table.setDraggingColumn =
    statefulTableOptions.onDraggingColumnChange ??
    ((updater) => applyUpdater(draggingColumn, updater))
  table.setDraggingRow =
    statefulTableOptions.onDraggingRowChange ?? ((updater) => applyUpdater(draggingRow, updater))
  table.setEditingCell =
    statefulTableOptions.onEditingCellChange ?? ((updater) => applyUpdater(editingCell, updater))
  table.setEditingRow =
    statefulTableOptions.onEditingRowChange ?? ((updater) => applyUpdater(editingRow, updater))
  table.setGlobalFilterFn =
    statefulTableOptions.onGlobalFilterFnChange ??
    ((updater) => applyUpdater(globalFilterFn, updater))
  table.setHoveredColumn =
    statefulTableOptions.onHoveredColumnChange ??
    ((updater) => applyUpdater(hoveredColumn, updater))
  table.setHoveredRow =
    statefulTableOptions.onHoveredRowChange ?? ((updater) => applyUpdater(hoveredRow, updater))
  table.setIsFullScreen =
    statefulTableOptions.onIsFullScreenChange ?? ((updater) => applyUpdater(isFullScreen, updater))
  table.setShowAlertBanner =
    statefulTableOptions.onShowAlertBannerChange ??
    ((updater) => applyUpdater(showAlertBanner, updater))
  table.setShowColumnFilters =
    statefulTableOptions.onShowColumnFiltersChange ??
    ((updater) => applyUpdater(showColumnFilters, updater))
  table.setShowGlobalFilter =
    statefulTableOptions.onShowGlobalFilterChange ??
    ((updater) => applyUpdater(showGlobalFilter, updater))
  table.setShowToolbarDropZone =
    statefulTableOptions.onShowToolbarDropZoneChange ??
    ((updater) => applyUpdater(showToolbarDropZone, updater))

  // Expose the reactive slot registry + setter so `<MantineVueTable>` can
  // publish its named slots into the instance
  ;(table as any)._mvtSlots = mvtSlots
  ;(table as any).setMVTSlots = (slots: Record<string, unknown>) => {
    mvtSlots.value = slots
  }

  useMVT_Effects(table)

  return table
}
