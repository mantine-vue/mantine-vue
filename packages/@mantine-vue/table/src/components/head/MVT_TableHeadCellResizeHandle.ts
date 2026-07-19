import { defineComponent, h, type PropType } from 'vue'

import { Box } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_Header, type MVT_RowData, type MVT_TableInstance } from '../../types'
import classes from './MVT_TableHeadCellResizeHandle.module.css'

export const MVT_TableHeadCellResizeHandle = defineComponent({
  name: 'MVTTableHeadCellResizeHandle',
  inheritAttrs: false,
  props: {
    header: {
      type: Object as PropType<MVT_Header<MVT_RowData>>,
      required: true,
    },
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return () => {
      const { header, table } = props
      const {
        getState,
        options: { columnResizeDirection, columnResizeMode },
        setColumnSizingInfo,
      } = table
      const { density } = getState()
      const { column } = header
      const handler = header.getResizeHandler()

      const offset =
        column.getIsResizing() && columnResizeMode === 'onEnd'
          ? `translateX(${
              (columnResizeDirection === 'rtl' ? -1 : 1) *
              (getState().columnSizingInfo.deltaOffset ?? 0)
            }px)`
          : undefined

      return h(Box, {
        onDblclick: () => {
          setColumnSizingInfo((old) => ({
            ...old,
            isResizingColumn: false,
          }))
          column.resetSize()
        },
        onMousedown: handler,
        onTouchstart: handler,
        role: 'separator',
        ...attrs,
        style: { '--mvt-transform': offset, ...(attrs as any).style },
        class: clsx(
          'mvt-table-head-cell-resize-handle',
          classes.root,
          classes[`root-${columnResizeDirection}`],
          !header.subHeaders.length && columnResizeMode === 'onChange' && classes['root-hide'],
          density,
          (attrs as any).class,
        ),
      } as any)
    }
  },
})
