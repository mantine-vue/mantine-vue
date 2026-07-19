import {
  type MVT_ColumnDef,
  type MVT_DefinedTableOptions,
  type MVT_DisplayColumnIds,
  type MVT_Localization,
  type MVT_RowData,
  type MVT_StatefulTableOptions,
} from '../types'
import { getAllLeafColumnDefs, getColumnId } from './column.utils'

export function defaultDisplayColumnProps<TData extends MVT_RowData>({
  header,
  id,
  size,
  tableOptions,
}: {
  header?: keyof MVT_Localization
  id: MVT_DisplayColumnIds
  size: number
  tableOptions: MVT_DefinedTableOptions<TData>
}): MVT_ColumnDef<TData> {
  const { defaultDisplayColumn, displayColumnDefOptions, localization } = tableOptions
  return {
    ...defaultDisplayColumn,
    header: header ? localization[header]! : '',
    size,
    ...displayColumnDefOptions?.[id],
    id,
  }
}

export const showRowPinningColumn = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): boolean => {
  const { enableRowPinning, rowPinningDisplayMode } = tableOptions
  return !!(enableRowPinning && !rowPinningDisplayMode?.startsWith('select'))
}

export const showRowDragColumn = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): boolean => {
  const { enableRowDragging, enableRowOrdering } = tableOptions
  return !!(enableRowDragging || enableRowOrdering)
}

export const showRowExpandColumn = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): boolean => {
  const {
    enableExpanding,
    enableGrouping,
    renderDetailPanel,
    state: { grouping },
  } = tableOptions

  const hasDetailPanelSlot = !!(tableOptions as any)._mvtSlots?.value?.detailPanel
  return !!(
    enableExpanding ||
    (enableGrouping && grouping?.length) ||
    renderDetailPanel ||
    hasDetailPanelSlot
  )
}

export const showRowActionsColumn = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): boolean => {
  const {
    createDisplayMode,
    editDisplayMode,
    enableEditing,
    enableRowActions,
    state: { creatingRow },
  } = tableOptions
  return !!(
    enableRowActions ||
    (creatingRow && createDisplayMode === 'row') ||
    (enableEditing && ['modal', 'row'].includes(editDisplayMode ?? ''))
  )
}

export const showRowSelectionColumn = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): boolean => !!tableOptions.enableRowSelection

export const showRowNumbersColumn = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): boolean => !!tableOptions.enableRowNumbers

export const showRowSpacerColumn = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): boolean => tableOptions.layoutMode === 'grid-no-grow'

export const getLeadingDisplayColumnIds = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
) =>
  [
    showRowPinningColumn(tableOptions) && 'mvt-row-pin',
    showRowDragColumn(tableOptions) && 'mvt-row-drag',
    tableOptions.positionActionsColumn === 'first' &&
      showRowActionsColumn(tableOptions) &&
      'mvt-row-actions',
    tableOptions.positionExpandColumn === 'first' &&
      showRowExpandColumn(tableOptions) &&
      'mvt-row-expand',
    showRowSelectionColumn(tableOptions) && 'mvt-row-select',
    showRowNumbersColumn(tableOptions) && 'mvt-row-numbers',
  ].filter(Boolean) as MVT_DisplayColumnIds[]

export const getTrailingDisplayColumnIds = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
) =>
  [
    tableOptions.positionActionsColumn === 'last' &&
      showRowActionsColumn(tableOptions) &&
      'mvt-row-actions',
    tableOptions.positionExpandColumn === 'last' &&
      showRowExpandColumn(tableOptions) &&
      'mvt-row-expand',
    showRowSpacerColumn(tableOptions) && 'mvt-row-spacer',
  ].filter(Boolean) as MVT_DisplayColumnIds[]

export const getDefaultColumnOrderIds = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
  reset = false,
) => {
  const {
    state: { columnOrder: currentColumnOrderIds = [] },
  } = tableOptions

  const leadingDisplayColIds: string[] = getLeadingDisplayColumnIds(tableOptions)
  const trailingDisplayColIds: string[] = getTrailingDisplayColumnIds(tableOptions)

  const defaultColumnDefIds = getAllLeafColumnDefs(tableOptions.columns).map((columnDef) =>
    getColumnId(columnDef),
  )

  let allLeafColumnDefIds = reset
    ? defaultColumnDefIds
    : Array.from(new Set([...currentColumnOrderIds, ...defaultColumnDefIds]))

  allLeafColumnDefIds = allLeafColumnDefIds.filter(
    (colId) => !leadingDisplayColIds.includes(colId) && !trailingDisplayColIds.includes(colId),
  )

  return [...leadingDisplayColIds, ...allLeafColumnDefIds, ...trailingDisplayColIds]
}
