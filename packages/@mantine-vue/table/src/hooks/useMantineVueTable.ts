import { type MVT_RowData, type MVT_TableInstance, type MVT_TableOptions } from '../types'
import { useMVT_TableInstance } from './useMVT_TableInstance'
import { useMVT_TableOptions } from './useMVT_TableOptions'

export const useMantineVueTable = <TData extends MVT_RowData>(
  tableOptions: MVT_TableOptions<TData>,
): MVT_TableInstance<TData> => useMVT_TableInstance(useMVT_TableOptions(tableOptions))
