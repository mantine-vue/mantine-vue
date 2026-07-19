import { defineComponent, h, type PropType, unref } from 'vue'

import { darken, lighten, Table, useMantineColorScheme } from '@mantine-vue/core'

import clsx from 'clsx'

import { useMVT_ColumnVirtualizer } from '../../hooks/useMVT_ColumnVirtualizer'
import { type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseCSSVarId } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_TableBody } from '../body/MVT_TableBody'
import { MVT_TableFooter } from '../footer/MVT_TableFooter'
import { MVT_TableHead } from '../head/MVT_TableHead'
import classes from './MVT_Table.module.css'

export const MVT_Table = defineComponent({
  name: 'MVTTable',
  inheritAttrs: false,
  props: {
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const columnVirtualizerRef = useMVT_ColumnVirtualizer(props.table)
    const { colorScheme } = useMantineColorScheme()

    return () => {
      const { table } = props

      const columnVirtualizer = columnVirtualizerRef?.value
      const {
        getFlatHeaders,
        options: { enableTableFooter, enableTableHead, layoutMode, mantineTableProps },
      } = table

      const tableProps = {
        highlightOnHover: true,
        horizontalSpacing: table.getState().density,
        verticalSpacing: table.getState().density,
        ...parseFromValuesOrFunc(mantineTableProps, { table }),
        ...attrs,
      }

      const columnSizeVars: Record<string, number> = (() => {
        const headers = getFlatHeaders()
        const colSizes: Record<string, number> = {}
        for (let i = 0; i < headers.length; i++) {
          const header = headers[i]
          const colSize = header.getSize()
          colSizes[`--header-${parseCSSVarId(header.id)}-size`] = colSize
          colSizes[`--col-${parseCSSVarId(header.column.id)}-size`] = colSize
        }
        return colSizes
      })()

      const stripedColor = (tableProps as any).stripedColor

      const commonTableGroupProps = { columnVirtualizer, table }

      return h(
        Table,
        {
          ...tableProps,
          class: clsx(
            'mvt-table',
            classes.root,
            layoutMode?.startsWith('grid') && classes['root-grid'],
            (tableProps as any).class,
          ),
          style: {
            ...columnSizeVars,
            '--mvt-striped-row-background-color': stripedColor,
            '--mvt-striped-row-hover-background-color': stripedColor
              ? unref(colorScheme) === 'dark'
                ? lighten(stripedColor, 0.08)
                : darken(stripedColor, 0.12)
              : undefined,
            ...(tableProps as any).style,
          },
        } as any,
        () => [
          enableTableHead && h(MVT_TableHead, commonTableGroupProps as any),
          h(MVT_TableBody, {
            ...commonTableGroupProps,
            tableProps,
          } as any),
          enableTableFooter && h(MVT_TableFooter, commonTableGroupProps as any),
        ],
      )
    }
  },
})
