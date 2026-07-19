import { Fragment, h } from 'vue'

import { Flex, Tooltip } from '@mantine-vue/core'

import { MVT_ExpandAllButton } from '../../components/buttons/MVT_ExpandAllButton'
import { MVT_ExpandButton } from '../../components/buttons/MVT_ExpandButton'
import { type MVT_ColumnDef, type MVT_RowData, type MVT_StatefulTableOptions } from '../../types'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'

export const getMVT_RowExpandColumnDef = <TData extends MVT_RowData>(
  tableOptions: MVT_StatefulTableOptions<TData>,
): MVT_ColumnDef<TData> | null => {
  const {
    defaultColumn,
    enableExpandAll,
    groupedColumnMode,
    positionExpandColumn,
    renderDetailPanel,
    state: { grouping },
  } = tableOptions

  const alignProps =
    positionExpandColumn === 'last'
      ? ({
          align: 'right',
        } as const)
      : undefined

  return {
    Cell: ({ cell, column, row, table }) => {
      const expandButtonProps = { row, table }
      const subRowsLength = row.subRows?.length
      if (tableOptions.groupedColumnMode === 'remove' && row.groupingColumnId) {
        return h(Flex, { align: 'center', gap: '0.25rem' } as any, () => [
          h(MVT_ExpandButton, expandButtonProps as any),
          h(
            Tooltip,
            {
              label: table.getColumn(row.groupingColumnId!).columnDef.header,
              openDelay: 1000,
              position: 'right',
            } as any,
            () => h('span', row.groupingValue as any),
          ),
          subRowsLength ? h('span', `(${subRowsLength})`) : null,
        ])
      }
      return h(Fragment, null, [
        h(MVT_ExpandButton, expandButtonProps as any),
        column.columnDef.GroupedCell?.({ cell, column, row, table }),
      ])
    },
    Header: enableExpandAll
      ? ({ table }) => {
          return h(Flex, { align: 'center' } as any, () => [
            h(MVT_ExpandAllButton, { table } as any),
            groupedColumnMode === 'remove'
              ? grouping
                  ?.map((groupedColumnId) => table.getColumn(groupedColumnId).columnDef.header)
                  ?.join(', ')
              : null,
          ])
        }
      : undefined,
    mantineTableBodyCellProps: alignProps,
    mantineTableHeadCellProps: alignProps,
    ...defaultDisplayColumnProps({
      header: 'expand',
      id: 'mvt-row-expand',
      size:
        groupedColumnMode === 'remove'
          ? (defaultColumn?.size ?? 180)
          : renderDetailPanel
            ? enableExpandAll
              ? 60
              : 70
            : 100,
      tableOptions,
    }),
  }
}
