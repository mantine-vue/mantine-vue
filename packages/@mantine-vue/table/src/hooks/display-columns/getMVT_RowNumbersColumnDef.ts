import { type MVT_ColumnDef, type MVT_RowData, type MVT_StatefulTableOptions } from '../../types'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'

export const getMVT_RowNumbersColumnDef = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): MVT_ColumnDef<TData> | null => {
  const { localization, rowNumberDisplayMode } = tableOptions
  const {
    pagination: { pageIndex, pageSize },
  } = tableOptions.state

  return {
    Cell: ({ renderedRowIndex = 0, row }) =>
      ((rowNumberDisplayMode === 'static' ? renderedRowIndex + pageSize * pageIndex : row.index) ??
        0) + 1,
    grow: false,
    Header: () => localization.rowNumber,
    ...defaultDisplayColumnProps({
      header: 'rowNumbers',
      id: 'mvt-row-numbers',
      size: 50,
      tableOptions,
    }),
  }
}
