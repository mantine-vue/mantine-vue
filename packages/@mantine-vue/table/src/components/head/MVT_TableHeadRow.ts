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
import { MVT_TableHeadCell } from './MVT_TableHeadCell'
import classes from './MVT_TableHeadRow.module.css'

export const MVT_TableHeadRow = defineComponent({
  name: 'MVTTableHeadRow',
  inheritAttrs: false,
  props: {
    columnVirtualizer: {
      type: Object as PropType<MVT_ColumnVirtualizer>,
      default: undefined,
    },
    headerGroup: {
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
      const { columnVirtualizer, headerGroup, table } = props
      const {
        getState,
        options: { enableStickyHeader, layoutMode, mantineTableHeadRowProps },
      } = table
      const { isFullScreen } = getState()

      const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } = columnVirtualizer ?? {}

      const tableRowProps = {
        ...parseFromValuesOrFunc(mantineTableHeadRowProps, {
          headerGroup,
          table,
        }),
        ...attrs,
      }

      return h(
        TableTr,
        {
          ...tableRowProps,
          class: clsx(
            classes.root,
            (enableStickyHeader || isFullScreen) && classes.sticky,
            layoutMode?.startsWith('grid') && classes['layout-mode-grid'],
            (tableRowProps as any)?.class,
          ),
        } as any,
        () => [
          virtualPaddingLeft
            ? h(Box, {
                component: 'th',
                display: 'flex',
                w: virtualPaddingLeft,
              } as any)
            : null,
          (virtualColumns ?? headerGroup.headers).map(
            (headerOrVirtualHeader, renderedHeaderIndex) => {
              let header = headerOrVirtualHeader as MVT_Header<MVT_RowData>
              let index = renderedHeaderIndex
              if (columnVirtualizer) {
                index = (headerOrVirtualHeader as MVT_VirtualItem).index
                header = headerGroup.headers[index]
              }
              return h(MVT_TableHeadCell, {
                columnVirtualizer,
                header,
                key: header.id,
                renderedHeaderIndex: index,
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
