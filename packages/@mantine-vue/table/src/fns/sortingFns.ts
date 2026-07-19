import { compareItems, type RankingInfo } from '@tanstack/match-sorter-utils'
import { type Row, sortingFns } from '@tanstack/vue-table'

import { type MVT_Row, type MVT_RowData } from '../types'

const fuzzy = <TData extends MVT_RowData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId] as RankingInfo,
      rowB.columnFiltersMeta[columnId] as RankingInfo,
    )
  }
  // Provide a fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA as Row<any>, rowB as Row<any>, columnId) : dir
}

export const MVT_SortingFns = {
  ...sortingFns,
  fuzzy,
}

export const rankGlobalFuzzy = <TData extends MVT_RowData>(
  rowA: MVT_Row<TData>,
  rowB: MVT_Row<TData>,
) =>
  Math.max(...Object.values(rowB.columnFiltersMeta).map((v: any) => v.rank)) -
  Math.max(...Object.values(rowA.columnFiltersMeta).map((v: any) => v.rank))
