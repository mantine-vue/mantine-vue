import { defineComponent, Fragment, h, type PropType } from 'vue'

import { TableTbody } from '@mantine-vue/core'

import clsx from 'clsx'

import { useMVT_Rows } from '../../hooks/useMVT_Rows'
import { useMVT_RowVirtualizer } from '../../hooks/useMVT_RowVirtualizer'
import {
  type MVT_ColumnVirtualizer,
  type MVT_Row,
  type MVT_RowData,
  type MVT_TableInstance,
  type MVT_VirtualItem,
} from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_TableBodyEmptyRow } from './MVT_TableBodyEmptyRow'
import { MVT_TableBodyRow } from './MVT_TableBodyRow'
import classes from './MVT_TableBody.module.css'

export const MVT_TableBody = defineComponent({
  name: 'MVTTableBody',
  inheritAttrs: false,
  props: {
    columnVirtualizer: {
      type: Object as PropType<MVT_ColumnVirtualizer>,
      default: undefined,
    },
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
    tableProps: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const rows = useMVT_Rows(props.table)
    const rowVirtualizerRef = useMVT_RowVirtualizer(props.table, rows)

    return () => {
      const { columnVirtualizer, table, tableProps } = props

      const rowVirtualizer = rowVirtualizerRef?.value
      const {
        getIsSomeRowsPinned,
        getRowModel,
        getState,
        getTopRows,
        getBottomRows,
        options: {
          enableStickyFooter,
          enableStickyHeader,
          layoutMode,
          mantineTableBodyProps,
          renderDetailPanel,
          rowPinningDisplayMode,
        },
        refs: { tableFooterRef, tableHeadRef },
      } = table
      const { isFullScreen, rowPinning } = getState()

      const tableBodyProps = {
        ...parseFromValuesOrFunc(mantineTableBodyProps, { table }),
        ...attrs,
      }

      const tableHeadHeight =
        ((enableStickyHeader || isFullScreen) && tableHeadRef.value?.clientHeight) || 0
      const tableFooterHeight = (enableStickyFooter && tableFooterRef.value?.clientHeight) || 0

      const pinnedRowIds =
        !rowPinning.bottom?.length && !rowPinning.top?.length
          ? []
          : getRowModel()
              .rows.filter((row) => row.getIsPinned())
              .map((r) => r.id)

      const currentRows = rows.value
      const { virtualRows } = rowVirtualizer ?? {}

      const commonRowProps = {
        columnVirtualizer,
        numRows: currentRows.length,
        table,
        tableProps,
      }

      const renderRow = (
        row: MVT_Row<MVT_RowData>,
        renderedRowIndex: number,
        extra?: Record<string, any>,
      ) =>
        h(MVT_TableBodyRow, {
          ...commonRowProps,
          key: `${row.id}-${row.index}`,
          renderedRowIndex,
          row,
          ...extra,
        } as any)

      return h(Fragment, null, [
        !rowPinningDisplayMode?.includes('sticky') &&
          getIsSomeRowsPinned('top') &&
          h(
            TableTbody,
            {
              ...tableBodyProps,
              style: {
                '--mvt-table-head-height': `${tableHeadHeight}`,
                ...(tableBodyProps as any)?.style,
              },
              class: clsx(
                classes.pinned,
                layoutMode?.startsWith('grid') && classes['root-grid'],
                (tableBodyProps as any)?.class,
              ),
            } as any,
            () => getTopRows().map((row, renderedRowIndex) => renderRow(row, renderedRowIndex)),
          ),
        h(
          TableTbody,
          {
            ...tableBodyProps,
            style: {
              '--mvt-table-body-height': rowVirtualizer
                ? `${rowVirtualizer.getTotalSize()}px`
                : undefined,
              ...(tableBodyProps as any)?.style,
            },
            class: clsx(
              classes.root,
              layoutMode?.startsWith('grid') && classes['root-grid'],
              !currentRows.length && classes['root-no-rows'],
              rowVirtualizer && classes['root-virtualized'],
              (tableBodyProps as any)?.class,
            ),
          } as any,
          () =>
            (tableBodyProps as any)?.children ??
            (!currentRows.length
              ? h(MVT_TableBodyEmptyRow, commonRowProps as any)
              : (virtualRows ?? currentRows).map((rowOrVirtualRow, renderedRowIndex) => {
                  let index = renderedRowIndex
                  if (rowVirtualizer) {
                    if (renderDetailPanel) {
                      if ((rowOrVirtualRow as MVT_VirtualItem).index % 2 === 1) return null
                      index = (rowOrVirtualRow as MVT_VirtualItem).index / 2
                    } else {
                      index = (rowOrVirtualRow as MVT_VirtualItem).index
                    }
                  }
                  const row = rowVirtualizer
                    ? currentRows[index]
                    : (rowOrVirtualRow as MVT_Row<MVT_RowData>)

                  if (!row) return null
                  return renderRow(row, index, {
                    pinnedRowIds,
                    rowVirtualizer,
                    virtualRow: rowVirtualizer ? (rowOrVirtualRow as MVT_VirtualItem) : undefined,
                  })
                })),
        ),
        !rowPinningDisplayMode?.includes('sticky') &&
          getIsSomeRowsPinned('bottom') &&
          h(
            TableTbody,
            {
              ...tableBodyProps,
              style: {
                '--mvt-table-footer-height': `${tableFooterHeight}`,
                ...(tableBodyProps as any)?.style,
              },
              class: clsx(
                classes.pinned,
                layoutMode?.startsWith('grid') && classes['root-grid'],
                (tableBodyProps as any)?.class,
              ),
            } as any,
            () => getBottomRows().map((row, renderedRowIndex) => renderRow(row, renderedRowIndex)),
          ),
      ])
    }
  },
})

export const Memo_MVT_TableBody = MVT_TableBody
