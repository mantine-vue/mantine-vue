import { type Row } from '@tanstack/vue-table'

import {
  type MVT_Column,
  type MVT_ColumnDef,
  type MVT_ColumnOrderState,
  type MVT_DefinedColumnDef,
  type MVT_DefinedTableOptions,
  type MVT_FilterOption,
  type MVT_RowData,
} from '../types'

export const getColumnId = <TData extends MVT_RowData>(columnDef: MVT_ColumnDef<TData>): string =>
  columnDef.id ?? columnDef.accessorKey?.toString?.() ?? columnDef.header

export const getAllLeafColumnDefs = <TData extends MVT_RowData>(
  columns: MVT_ColumnDef<TData>[],
): MVT_ColumnDef<TData>[] => {
  const allLeafColumnDefs: MVT_ColumnDef<TData>[] = []
  const getLeafColumns = (cols: MVT_ColumnDef<TData>[]) => {
    cols.forEach((col) => {
      if (col.columns) {
        getLeafColumns(col.columns)
      } else {
        allLeafColumnDefs.push(col)
      }
    })
  }
  getLeafColumns(columns)
  return allLeafColumnDefs
}

export const prepareColumns = <TData extends MVT_RowData>({
  columnDefs,
  tableOptions,
}: {
  columnDefs: MVT_ColumnDef<TData>[]
  tableOptions: MVT_DefinedTableOptions<TData>
}): MVT_DefinedColumnDef<TData>[] => {
  const {
    aggregationFns = {},
    defaultDisplayColumn,
    filterFns = {},
    sortingFns = {},
    state: { columnFilterFns = {} } = {},
  } = tableOptions
  return columnDefs.map((col) => {
    // Local alias so the display-column branch can reassign without mutating the
    // map callback parameter (eslint no-param-reassign).
    let columnDef = col
    //assign columnId
    if (!columnDef.id) columnDef.id = getColumnId(columnDef)
    //assign columnDefType
    if (!columnDef.columnDefType) columnDef.columnDefType = 'data'
    if (columnDef.columns?.length) {
      columnDef.columnDefType = 'group'
      //recursively prepare columns if this is a group column
      columnDef.columns = prepareColumns({
        columnDefs: columnDef.columns,
        tableOptions,
      })
    } else if (columnDef.columnDefType === 'data') {
      //assign aggregationFns if multiple aggregationFns are provided
      if (Array.isArray(columnDef.aggregationFn)) {
        const aggFns = columnDef.aggregationFn as string[]
        columnDef.aggregationFn = (
          columnId: string,
          leafRows: Row<TData>[],
          childRows: Row<TData>[],
        ) => aggFns.map((fn) => aggregationFns[fn]?.(columnId, leafRows, childRows))
      }

      //assign filterFns
      if (Object.keys(filterFns).includes(columnFilterFns[columnDef.id])) {
        columnDef.filterFn = filterFns[columnFilterFns[columnDef.id]] ?? filterFns.fuzzy
        ;(columnDef as MVT_DefinedColumnDef<TData>)._filterFn = columnFilterFns[columnDef.id]
      }

      //assign sortingFns
      if (Object.keys(sortingFns).includes(columnDef.sortingFn as string)) {
        // @ts-expect-error bla bla bla
        columnDef.sortingFn = sortingFns[columnDef.sortingFn]
      }
    } else if (columnDef.columnDefType === 'display') {
      columnDef = {
        ...(defaultDisplayColumn as MVT_ColumnDef<TData>),
        ...columnDef,
      }
    }
    return columnDef
  }) as MVT_DefinedColumnDef<TData>[]
}

export const reorderColumn = <TData extends MVT_RowData>(
  draggedColumn: MVT_Column<TData>,
  targetColumn: MVT_Column<TData>,
  columnOrder: MVT_ColumnOrderState,
): MVT_ColumnOrderState => {
  if (draggedColumn.getCanPin()) {
    draggedColumn.pin(targetColumn.getIsPinned())
  }
  const newColumnOrder = [...columnOrder]
  newColumnOrder.splice(
    newColumnOrder.indexOf(targetColumn.id),
    0,
    newColumnOrder.splice(newColumnOrder.indexOf(draggedColumn.id), 1)[0],
  )
  return newColumnOrder
}

export const getDefaultColumnFilterFn = <TData extends MVT_RowData>(
  columnDef: MVT_ColumnDef<TData>,
): MVT_FilterOption => {
  const { filterVariant } = columnDef
  if (filterVariant === 'multi-select') return 'arrIncludesSome'
  if (filterVariant?.includes('range')) return 'betweenInclusive'
  if (['checkbox', 'date', 'select'].includes(filterVariant || '')) return 'equals'
  return 'fuzzy'
}
