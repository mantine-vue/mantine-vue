import { MVT_DefaultDisplayColumn } from '../useMVT_TableOptions'

import { type MVT_ColumnDef, type MVT_RowData, type MVT_StatefulTableOptions } from '../../types'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'

const blankColProps = {
  children: null,
  style: {
    minWidth: 0,
    padding: 0,
    width: 0,
  },
}

export const getMVT_RowSpacerColumnDef = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): MVT_ColumnDef<TData> | null => {
  return {
    ...defaultDisplayColumnProps({
      id: 'mvt-row-spacer',
      size: 0,
      tableOptions,
    }),
    grow: true,
    ...MVT_DefaultDisplayColumn,
    mantineTableBodyCellProps: blankColProps,
    mantineTableFooterCellProps: blankColProps,
    mantineTableHeadCellProps: blankColProps,
  }
}
