import { type CSSProperties, defineComponent, h, type PropType } from 'vue'

import { TableTh, useDirection, useMantineTheme } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_Header, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseCSSVarId } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_TableFooterCell.module.css'

export const MVT_TableFooterCell = defineComponent({
  name: 'MVTTableFooterCell',
  inheritAttrs: false,
  props: {
    footer: {
      type: Object as PropType<MVT_Header<MVT_RowData>>,
      required: true,
    },
    renderedColumnIndex: { type: Number, default: undefined },
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const direction = useDirection()
    const theme = useMantineTheme()
    return () => {
      const { footer, renderedColumnIndex, table } = props
      const {
        options: { enableColumnPinning, layoutMode, mantineTableFooterCellProps },
      } = table
      const { column } = footer
      const { columnDef } = column
      const { columnDefType } = columnDef

      const isColumnPinned =
        enableColumnPinning && columnDef.columnDefType !== 'group' && column.getIsPinned()

      const args = { column, table }
      const tableCellProps = {
        ...parseFromValuesOrFunc(mantineTableFooterCellProps, args),
        ...parseFromValuesOrFunc(columnDef.mantineTableFooterCellProps, args),
        ...attrs,
      }

      const widthStyles: CSSProperties = {
        minWidth: `max(calc(var(--header-${parseCSSVarId(
          footer?.id,
        )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
        width: `calc(var(--header-${parseCSSVarId(footer.id)}-size) * 1px)`,
      }
      if (layoutMode === 'grid') {
        widthStyles.flex = `${
          [0, false].includes(columnDef.grow!)
            ? 0
            : `var(--header-${parseCSSVarId(footer.id)}-size)`
        } 0 auto`
      } else if (layoutMode === 'grid-no-grow') {
        widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`
      }

      const style = {
        ...widthStyles,
        '--mvt-cell-align':
          (tableCellProps as any).align ??
          (columnDefType === 'group' ? 'center' : direction.dir.value === 'rtl' ? 'right' : 'left'),
        '--mvt-table-cell-left':
          isColumnPinned === 'left' ? `${column.getStart(isColumnPinned)}` : undefined,
        '--mvt-table-cell-right':
          isColumnPinned === 'right' ? `${column.getAfter(isColumnPinned)}` : undefined,
        ...parseFromValuesOrFunc((tableCellProps as any).style, theme),
      }

      const { children: cellChildren, ...tableCellRest } = tableCellProps as any

      return h(
        TableTh,
        {
          colspan: footer.colSpan,
          'data-column-pinned': isColumnPinned || undefined,
          'data-first-right-pinned':
            (isColumnPinned === 'right' && column.getIsFirstColumn(isColumnPinned)) || undefined,
          'data-index': renderedColumnIndex,
          'data-last-left-pinned':
            (isColumnPinned === 'left' && column.getIsLastColumn(isColumnPinned)) || undefined,
          ...tableCellRest,
          class: clsx(
            classes.root,
            layoutMode?.startsWith('grid') && classes.grid,
            columnDefType === 'group' && classes.group,
            (tableCellProps as any)?.class,
          ),
          style,
        } as any,
        () =>
          cellChildren ??
          (footer.isPlaceholder
            ? null
            : (parseFromValuesOrFunc(columnDef.Footer, {
                column,
                footer,
                table,
              }) ??
              columnDef.footer ??
              null)),
      )
    }
  },
})
