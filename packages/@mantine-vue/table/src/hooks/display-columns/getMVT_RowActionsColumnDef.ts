import { h } from 'vue'

import { MVT_ToggleRowActionMenuButton } from '../../components/buttons/MVT_ToggleRowActionMenuButton'
import { type MVT_ColumnDef, type MVT_RowData, type MVT_StatefulTableOptions } from '../../types'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'

export const getMVT_RowActionsColumnDef = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): MVT_ColumnDef<TData> | null => {
  return {
    Cell: ({ cell, row, table }) => h(MVT_ToggleRowActionMenuButton, { cell, row, table } as any),
    ...defaultDisplayColumnProps({
      header: 'actions',
      id: 'mvt-row-actions',
      size: 70,
      tableOptions,
    }),
  }
}
