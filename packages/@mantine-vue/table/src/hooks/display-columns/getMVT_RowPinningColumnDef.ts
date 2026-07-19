import { h } from 'vue'

import { MVT_TableBodyRowPinButton } from '../../components/body/MVT_TableBodyRowPinButton'
import { type MVT_ColumnDef, type MVT_RowData, type MVT_StatefulTableOptions } from '../../types'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'

export const getMVT_RowPinningColumnDef = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): MVT_ColumnDef<TData> | null => {
  return {
    Cell: ({ row, table }) => h(MVT_TableBodyRowPinButton, { row, table } as any),
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'pin',
      id: 'mvt-row-pin',
      size: 60,
      tableOptions,
    }),
  }
}
