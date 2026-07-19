import { h } from 'vue'

import { MVT_SelectCheckbox } from '../../components/inputs/MVT_SelectCheckbox'
import { type MVT_ColumnDef, type MVT_RowData, type MVT_StatefulTableOptions } from '../../types'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'

export const getMVT_RowSelectColumnDef = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): MVT_ColumnDef<TData> | null => {
  const { enableMultiRowSelection, enableSelectAll } = tableOptions

  return {
    Cell: ({ renderedRowIndex, row, table }) =>
      h(MVT_SelectCheckbox, { renderedRowIndex, row, table } as any),
    grow: false,
    Header:
      enableSelectAll && enableMultiRowSelection
        ? ({ table }) => h(MVT_SelectCheckbox, { table } as any)
        : undefined,
    ...defaultDisplayColumnProps({
      header: 'select',
      id: 'mvt-row-select',
      size: enableSelectAll ? 60 : 70,
      tableOptions,
    }),
  }
}
