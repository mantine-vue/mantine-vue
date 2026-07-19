import { defineComponent, h, type PropType } from 'vue'

import { Highlight } from '@mantine-vue/core'

import { type MVT_Cell, type MVT_Node, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'

const allowedTypes = ['string', 'number']
const allowedFilterVariants = ['text', 'autocomplete']

export const MVT_TableBodyCellValue = defineComponent({
  name: 'MVTTableBodyCellValue',
  props: {
    cell: {
      type: Object as PropType<MVT_Cell<MVT_RowData>>,
      required: true,
    },
    renderedColumnIndex: { type: Number, default: 0 },
    renderedRowIndex: { type: Number, default: 0 },
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const { cell, renderedColumnIndex, renderedRowIndex, table } = props
      const {
        getState,
        options: { enableFilterMatchHighlighting, mantineHighlightProps = { size: 'sm' } },
      } = table
      const { column, row } = cell
      const { columnDef } = column
      const { globalFilter, globalFilterFn } = getState()
      const filterValue = column.getFilterValue()

      const highlightProps = parseFromValuesOrFunc(mantineHighlightProps, {
        cell,
        column,
        row,
        table,
      }) as Record<string, any>

      let renderedCellValue: MVT_Node | number | string | undefined =
        cell.getIsAggregated() && columnDef.AggregatedCell
          ? columnDef.AggregatedCell({ cell, column, row, table })
          : row.getIsGrouped() && !cell.getIsGrouped()
            ? null
            : cell.getIsGrouped() && columnDef.GroupedCell
              ? columnDef.GroupedCell({ cell, column, row, table })
              : undefined

      const isGroupedValue = renderedCellValue !== undefined

      if (!isGroupedValue) {
        renderedCellValue = cell.renderValue() as number | string
      }

      if (
        enableFilterMatchHighlighting &&
        columnDef.enableFilterMatchHighlighting !== false &&
        renderedCellValue &&
        allowedTypes.includes(typeof renderedCellValue) &&
        ((filterValue &&
          allowedTypes.includes(typeof filterValue) &&
          allowedFilterVariants.includes(columnDef.filterVariant as string)) ||
          (globalFilter &&
            allowedTypes.includes(typeof globalFilter) &&
            column.getCanGlobalFilter()))
      ) {
        let highlight: string | string[] = (
          column.getFilterValue() ??
          globalFilter ??
          ''
        ).toString() as string
        if ((filterValue ? columnDef._filterFn : globalFilterFn) === 'fuzzy') {
          highlight = highlight.split(' ')
        }
        const text = renderedCellValue.toString()

        renderedCellValue = h(
          Highlight,
          { color: 'yellow.3', highlight, ...highlightProps } as any,
          () => text,
        )
      }

      if (columnDef.Cell && !isGroupedValue) {
        renderedCellValue = columnDef.Cell({
          cell,
          column,
          renderedCellValue,
          renderedColumnIndex,
          renderedRowIndex,
          row,
          table,
        })
      }

      return renderedCellValue
    }
  },
})
