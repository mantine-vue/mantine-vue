import { h, type Ref } from 'vue'

import { MVT_TableBodyRowGrabHandle } from '../../components/body/MVT_TableBodyRowGrabHandle'
import { type MVT_ColumnDef, type MVT_RowData, type MVT_StatefulTableOptions } from '../../types'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'

export const getMVT_RowDragColumnDef = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): MVT_ColumnDef<TData> | null => {
  return {
    Cell: ({ row, rowRef, table }) =>
      h(MVT_TableBodyRowGrabHandle, {
        row,
        rowRef: rowRef as Ref<HTMLTableRowElement | null>,
        table,
      } as any),
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'move',
      id: 'mvt-row-drag',
      size: 60,
      tableOptions,
    }),
  }
}
