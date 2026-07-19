import { defineComponent, h, type PropType } from 'vue'

import { Box, TableTr } from '@mantine-vue/core'

import clsx from 'clsx'

import {
  type MVT_ColumnVirtualizer,
  type MVT_Header,
  type MVT_HeaderGroup,
  type MVT_RowData,
  type MVT_TableInstance,
  type MVT_VirtualItem,
} from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_TableFooterCell } from './MVT_TableFooterCell'
import classes from './MVT_TableFooterRow.module.css'

export const MVT_TableFooterRow = defineComponent({
  name: 'MVTTableFooterRow',
  inheritAttrs: false,
  props: {
    columnVirtualizer: {
      type: Object as PropType<MVT_ColumnVirtualizer>,
      default: undefined,
    },
    footerGroup: {
      type: Object as PropType<MVT_HeaderGroup<MVT_RowData>>,
      required: true,
    },
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return () => {
      const { columnVirtualizer, footerGroup, table } = props
      const {
        options: { layoutMode, mantineTableFooterRowProps },
      } = table

      const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } = columnVirtualizer ?? {}

      // if no content in row, skip row
      if (
        !footerGroup.headers?.some(
          (header) =>
            (typeof header.column.columnDef.footer === 'string' &&
              !!header.column.columnDef.footer) ||
            header.column.columnDef.Footer,
        )
      ) {
        return null
      }

      const tableRowProps = {
        ...parseFromValuesOrFunc(mantineTableFooterRowProps, {
          footerGroup,
          table,
        }),
        ...attrs,
      }

      return h(
        TableTr,
        {
          class: clsx(classes.root, layoutMode?.startsWith('grid') && classes['layout-mode-grid']),
          ...tableRowProps,
        } as any,
        () => [
          virtualPaddingLeft
            ? h(Box, {
                component: 'th',
                display: 'flex',
                w: virtualPaddingLeft,
              } as any)
            : null,
          (virtualColumns ?? footerGroup.headers).map(
            (footerOrVirtualFooter, renderedColumnIndex) => {
              let footer = footerOrVirtualFooter as MVT_Header<MVT_RowData>
              let index = renderedColumnIndex
              if (columnVirtualizer) {
                index = (footerOrVirtualFooter as MVT_VirtualItem).index
                footer = footerGroup.headers[index]
              }
              return h(MVT_TableFooterCell, {
                footer,
                key: footer.id,
                renderedColumnIndex: index,
                table,
              } as any)
            },
          ),
          virtualPaddingRight
            ? h(Box, {
                component: 'th',
                display: 'flex',
                w: virtualPaddingRight,
              } as any)
            : null,
        ],
      )
    }
  },
})
