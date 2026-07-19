import { defineComponent, h, type PropType } from 'vue'

import { createRow } from '@tanstack/vue-table'

import { TableTd, Text } from '@mantine-vue/core'

import clsx from 'clsx'

import {
  type MVT_ColumnVirtualizer,
  type MVT_Row,
  type MVT_RowData,
  type MVT_TableInstance,
} from '../../types'
import { MVT_ExpandButton } from '../buttons/MVT_ExpandButton'
import { MVT_TableBodyRow } from './MVT_TableBodyRow'
import classes from './MVT_TableBody.module.css'

export const MVT_TableBodyEmptyRow = defineComponent({
  name: 'MVTTableBodyEmptyRow',
  inheritAttrs: false,
  props: {
    columnVirtualizer: {
      type: Object as PropType<MVT_ColumnVirtualizer>,
      default: undefined,
    },
    numRows: { type: Number, default: undefined },
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
    tableProps: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },
  setup(props) {
    const emptyRow = createRow(
      props.table as any,
      'mvt-row-empty',
      {} as MVT_RowData,
      0,
      0,
    ) as MVT_Row<MVT_RowData>

    return () => {
      const { columnVirtualizer, numRows, table, tableProps } = props
      const {
        getState,
        options: { layoutMode, localization, renderDetailPanel, renderEmptyRowsFallback },
        refs: { tablePaperRef },
      } = table
      const { columnFilters, globalFilter } = getState()

      return h(
        MVT_TableBodyRow,
        {
          columnVirtualizer,
          numRows,
          class: clsx(
            'mvt-table-body-row',
            layoutMode?.startsWith('grid') && classes['empty-row-tr-grid'],
          ),
          renderedRowIndex: 0,
          row: emptyRow,
          table,
          tableProps,
          virtualRow: undefined,
        } as any,
        () => [
          renderDetailPanel &&
            h(
              TableTd,
              {
                class: clsx(
                  'mvt-table-body-cell',
                  layoutMode?.startsWith('grid') && classes['empty-row-td-grid'],
                ),
                colspan: 1,
              } as any,
              () => h(MVT_ExpandButton, { row: emptyRow, table } as any),
            ),
          h(
            'td',
            {
              class: clsx(
                'mvt-table-body-cell',
                layoutMode?.startsWith('grid') && classes['empty-row-td-grid'],
              ),
              colspan: table.getVisibleLeafColumns().length,
            },
            [
              renderEmptyRowsFallback?.({ table }) ??
                h(
                  Text,
                  {
                    style: {
                      '--mvt-paper-width': `${tablePaperRef.value?.clientWidth}`,
                    },
                    class: clsx(classes['empty-row-td-content']),
                  } as any,
                  () =>
                    globalFilter || columnFilters.length
                      ? localization.noResultsFound
                      : localization.noRecordsToDisplay,
                ),
            ],
          ),
        ],
      )
    }
  },
})
