/* oxlint-disable prefer-const */

import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/vue-table'

import { useDirection } from '@mantine-vue/core'

import { MVT_AggregationFns } from '../fns/aggregationFns'
import { MVT_FilterFns } from '../fns/filterFns'
import { MVT_SortingFns } from '../fns/sortingFns'
import { MVT_Default_Icons } from '../icons'
import { MVT_Localization_EN } from '../locales/en'
import { type MVT_DefinedTableOptions, type MVT_RowData, type MVT_TableOptions } from '../types'

export const MVT_DefaultColumn = {
  filterVariant: 'text',
  maxSize: 1000,
  minSize: 40,
  size: 180,
} as const

export const MVT_DefaultDisplayColumn = {
  columnDefType: 'display',
  enableClickToCopy: false,
  enableColumnActions: false,
  enableColumnDragging: false,
  enableColumnFilter: false,
  enableColumnOrdering: false,
  enableEditing: false,
  enableGlobalFilter: false,
  enableGrouping: false,
  enableHiding: false,
  enableResizing: false,
  enableSorting: false,
} as const

/**
 * Applies MVT's option defaults
 */
export const useMVT_TableOptions: <TData extends MVT_RowData>(
  tableOptions: MVT_TableOptions<TData>,
) => MVT_DefinedTableOptions<TData> = <TData extends MVT_RowData>(
  rawOptions: MVT_TableOptions<TData>,
) => {
  let {
    aggregationFns,
    autoResetExpanded = false,
    columnFilterDisplayMode = 'subheader',
    columnResizeDirection,
    columnResizeMode = 'onChange',
    createDisplayMode = 'modal',
    defaultColumn,
    defaultDisplayColumn,
    editDisplayMode = 'modal',
    enableBatchRowSelection = true,
    enableBottomToolbar = true,
    enableColumnActions = true,
    enableColumnFilters = true,
    enableColumnOrdering = false,
    enableColumnPinning = false,
    enableColumnResizing = false,
    enableColumnVirtualization,
    enableDensityToggle = true,
    enableExpandAll = true,
    enableExpanding,
    enableFacetedValues = false,
    enableFilterMatchHighlighting = true,
    enableFilters = true,
    enableFullScreenToggle = true,
    enableGlobalFilter = true,
    enableGlobalFilterRankedResults = true,
    enableGrouping = false,
    enableHeaderActionsHoverReveal = false,
    enableHiding = true,
    enableMultiRowSelection = true,
    enableMultiSort = true,
    enablePagination = true,
    enableRowPinning = false,
    enableRowSelection = false,
    enableRowVirtualization,
    enableSelectAll = true,
    enableSorting = true,
    enableStickyHeader = false,
    enableTableFooter = true,
    enableTableHead = true,
    enableToolbarInternalActions = true,
    enableTopToolbar = true,
    filterFns,
    icons,
    layoutMode,
    localization,
    manualFiltering,
    manualGrouping,
    manualPagination,
    manualSorting,
    paginationDisplayMode = 'default',
    positionActionsColumn = 'first',
    positionCreatingRow = 'top',
    positionExpandColumn = 'first',
    positionGlobalFilter = 'right',
    positionPagination = 'bottom',
    positionToolbarAlertBanner = 'top',
    positionToolbarDropZone = 'top',
    rowNumberDisplayMode = 'static',
    rowPinningDisplayMode = 'sticky',
    selectAllMode = 'page',
    sortingFns,
    ...rest
  } = rawOptions

  const direction = useDirection()

  icons = { ...MVT_Default_Icons, ...icons }
  localization = {
    ...MVT_Localization_EN,
    ...localization,
  }
  aggregationFns = { ...MVT_AggregationFns, ...aggregationFns }
  filterFns = { ...MVT_FilterFns, ...filterFns }
  sortingFns = { ...MVT_SortingFns, ...sortingFns }
  defaultColumn = { ...MVT_DefaultColumn, ...defaultColumn }
  defaultDisplayColumn = {
    ...MVT_DefaultDisplayColumn,
    ...defaultDisplayColumn,
  }

  if (!columnResizeDirection) {
    columnResizeDirection = direction.dir.value || 'ltr'
  }

  layoutMode = layoutMode || (enableColumnResizing ? 'grid-no-grow' : 'semantic')
  if (layoutMode === 'semantic' && (enableRowVirtualization || enableColumnVirtualization)) {
    layoutMode = 'grid'
  }

  if (enableRowVirtualization) {
    enableStickyHeader = true
  }

  if (enablePagination === false && manualPagination === undefined) {
    manualPagination = true
  }

  if (!rest.data?.length) {
    manualFiltering = true
    manualGrouping = true
    manualPagination = true
    manualSorting = true
  }

  const definedOptions = {
    aggregationFns,
    autoResetExpanded,
    columnFilterDisplayMode,
    columnResizeDirection,
    columnResizeMode,
    createDisplayMode,
    defaultColumn,
    defaultDisplayColumn,
    editDisplayMode,
    enableBatchRowSelection,
    enableBottomToolbar,
    enableColumnActions,
    enableColumnFilters,
    enableColumnOrdering,
    enableColumnPinning,
    enableColumnResizing,
    enableColumnVirtualization,
    enableDensityToggle,
    enableExpandAll,
    enableExpanding,
    enableFacetedValues,
    enableFilterMatchHighlighting,
    enableFilters,
    enableFullScreenToggle,
    enableGlobalFilter,
    enableGlobalFilterRankedResults,
    enableGrouping,
    enableHeaderActionsHoverReveal,
    enableHiding,
    enableMultiRowSelection,
    enableMultiSort,
    enablePagination,
    enableRowPinning,
    enableRowSelection,
    enableRowVirtualization,
    enableSelectAll,
    enableSorting,
    enableStickyHeader,
    enableTableFooter,
    enableTableHead,
    enableToolbarInternalActions,
    enableTopToolbar,
    filterFns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: enableExpanding || enableGrouping ? getExpandedRowModel() : undefined,
    getFacetedMinMaxValues: enableFacetedValues ? getFacetedMinMaxValues() : undefined,
    getFacetedRowModel: enableFacetedValues ? getFacetedRowModel() : undefined,
    getFacetedUniqueValues: enableFacetedValues ? getFacetedUniqueValues() : undefined,
    getFilteredRowModel:
      enableColumnFilters || enableGlobalFilter || enableFilters
        ? getFilteredRowModel()
        : undefined,
    getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getSubRows: (row) => row?.subRows,
    icons,
    layoutMode,
    localization,
    manualFiltering,
    manualGrouping,
    manualPagination,
    manualSorting,
    paginationDisplayMode,
    positionActionsColumn,
    positionCreatingRow,
    positionExpandColumn,
    positionGlobalFilter,
    positionPagination,
    positionToolbarAlertBanner,
    positionToolbarDropZone,
    rowNumberDisplayMode,
    rowPinningDisplayMode,
    selectAllMode,
    sortingFns,
    ...rest,
  } as MVT_DefinedTableOptions<TData>

  Object.defineProperty(definedOptions, 'data', {
    configurable: true,
    enumerable: true,
    get: () => rawOptions.data,
  })
  Object.defineProperty(definedOptions, 'columns', {
    configurable: true,
    enumerable: true,
    get: () => rawOptions.columns,
  })
  Object.defineProperty(definedOptions, 'state', {
    configurable: true,
    enumerable: true,
    get: () => rawOptions.state,
  })
  Object.defineProperty(definedOptions, 'rowCount', {
    configurable: true,
    enumerable: true,
    get: () => rawOptions.rowCount,
  })

  return definedOptions
}
