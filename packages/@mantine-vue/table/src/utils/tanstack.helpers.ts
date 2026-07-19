import { type Component, h, type VNodeChild } from 'vue'

import { createRow as _createRow } from '@tanstack/vue-table'

import {
  type MVT_ColumnHelper,
  type MVT_DisplayColumnDef,
  type MVT_GroupColumnDef,
  type MVT_Node,
  type MVT_Row,
  type MVT_RowData,
  type MVT_TableInstance,
} from '../types'
import { getAllLeafColumnDefs, getColumnId } from './column.utils'

/**
 * A renderable passed to {@link flexRender}.
 */
export type Renderable<TProps> = ((props: TProps) => VNodeChild) | Component | VNodeChild

/**
 * Vue equivalent of `@tanstack/react-table`'s `flexRender`.
 *
 * `@tanstack/vue-table` only ships a `FlexRender` component
 */
export const flexRender = <TProps extends object>(
  Comp: Renderable<TProps>,
  props: TProps,
): MVT_Node => {
  if (Comp === null || Comp === undefined || Comp === false) {
    return null
  }
  if (typeof Comp === 'function') {
    return (Comp as (props: TProps) => VNodeChild)(props)
  }
  if (typeof Comp === 'object') {
    return h(Comp as Component, props as Record<string, any>)
  }
  return Comp
}

export function createMVTColumnHelper<TData extends MVT_RowData>(): MVT_ColumnHelper<TData> {
  return {
    accessor: (accessor, column) => {
      return typeof accessor === 'function'
        ? ({
            ...column,
            accessorFn: accessor,
          } as any)
        : {
            ...column,
            accessorKey: accessor,
          }
    },
    display: (column) => column as MVT_DisplayColumnDef<TData>,
    group: (column) => column as MVT_GroupColumnDef<TData>,
  }
}

export const createRow = <TData extends MVT_RowData>(
  table: MVT_TableInstance<TData>,
  originalRow?: TData,
  rowIndex = -1,
  depth = 0,
  subRows?: MVT_Row<TData>[],
  parentId?: string,
): MVT_Row<TData> =>
  _createRow(
    table as any,
    'mvt-row-create',
    originalRow ??
      Object.assign(
        {},
        ...getAllLeafColumnDefs(table.options.columns).map((col) => ({
          [getColumnId(col)]: '',
        })),
      ),
    rowIndex,
    depth,
    subRows as any,
    parentId,
  ) as MVT_Row<TData>
