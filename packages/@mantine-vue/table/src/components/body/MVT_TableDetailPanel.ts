import { defineComponent, h, type PropType, type Ref } from 'vue'

import { Collapse, TableTd, TableTr } from '@mantine-vue/core'

import clsx from 'clsx'

import {
  type MVT_Row,
  type MVT_RowData,
  type MVT_RowVirtualizer,
  type MVT_TableInstance,
  type MVT_VirtualItem,
} from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_EditCellTextInput } from '../inputs/MVT_EditCellTextInput'
import { renderMVT_Renderable, useMVT_Slots } from '../MVT_TableSlots'
import classes from './MVT_TableDetailPanel.module.css'

export const MVT_TableDetailPanel = defineComponent({
  name: 'MVTTableDetailPanel',
  inheritAttrs: false,
  props: {
    parentRowRef: {
      type: Object as PropType<Ref<HTMLTableRowElement | null>>,
      required: true,
    },
    renderedRowIndex: { type: Number, default: 0 },
    row: {
      type: Object as PropType<MVT_Row<MVT_RowData>>,
      required: true,
    },
    rowVirtualizer: {
      type: Object as PropType<MVT_RowVirtualizer>,
      default: undefined,
    },
    striped: {
      type: [Boolean, String] as PropType<false | string>,
      default: undefined,
    },
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
    virtualRow: {
      type: Object as PropType<MVT_VirtualItem>,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    const mvtSlots = useMVT_Slots()
    return () => {
      const { parentRowRef, renderedRowIndex, row, rowVirtualizer, striped, table, virtualRow } =
        props
      const {
        getState,
        getVisibleLeafColumns,
        options: {
          layoutMode,
          mantineDetailPanelProps,
          mantineTableBodyRowProps,
          renderDetailPanel,
        },
      } = table
      const { isLoading } = getState()

      const tableRowProps = parseFromValuesOrFunc(mantineTableBodyRowProps, {
        isDetailPanel: true,
        row,
        table,
      })

      const tableCellProps = {
        ...parseFromValuesOrFunc(mantineDetailPanelProps, { row, table }),
        ...attrs,
      }

      const internalEditComponents = row
        .getAllCells()
        .filter((cell) => cell.column.columnDef.columnDefType === 'data')
        .map((cell) => h(MVT_EditCellTextInput, { cell, key: cell.id, table } as any))

      const DetailPanel =
        !isLoading &&
        row.getIsExpanded() &&
        renderMVT_Renderable(mvtSlots.detailPanel, renderDetailPanel, {
          internalEditComponents,
          row,
          table,
        })

      return h(
        TableTr,
        {
          'data-index': renderDetailPanel ? renderedRowIndex * 2 + 1 : renderedRowIndex,
          'data-striped': striped,
          ref: (el: any) => {
            const node = (el?.$el ?? el) as HTMLTableRowElement
            if (node) rowVirtualizer?.measureElement?.(node)
          },
          ...tableRowProps,
          style: {
            '--mvt-parent-row-height': virtualRow
              ? `${parentRowRef.value?.getBoundingClientRect()?.height}px`
              : undefined,
            '--mvt-virtual-row-start': virtualRow ? `${virtualRow.start}px` : undefined,
            ...(tableRowProps as any)?.style,
          },
          class: clsx(
            'mantine-Table-tr-detail-panel',
            classes.root,
            layoutMode?.startsWith('grid') && classes['root-grid'],
            virtualRow && classes['root-virtual-row'],
            (tableRowProps as any)?.class,
          ),
        } as any,
        () =>
          h(
            TableTd,
            {
              colspan: getVisibleLeafColumns().length,
              component: 'td',
              ...tableCellProps,
              style: {
                '--mvt-inner-width': `${table.getTotalSize()}px`,
              },
              class: clsx(
                'mantine-Table-td-detail-panel',
                classes.inner,
                layoutMode?.startsWith('grid') && classes['inner-grid'],
                row.getIsExpanded() && classes['inner-expanded'],
                virtualRow && classes['inner-virtual'],
              ),
              p: row.getIsExpanded() && DetailPanel ? 'md' : 0,
            } as any,
            () =>
              rowVirtualizer
                ? row.getIsExpanded() && DetailPanel
                : h(Collapse, { expanded: row.getIsExpanded() } as any, () => DetailPanel),
          ),
      )
    }
  },
})
