import { defineComponent, h, type PropType } from 'vue'

import { TableTh, TableThead, TableTr } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_ColumnVirtualizer, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_ToolbarAlertBanner } from '../toolbar/MVT_ToolbarAlertBanner'
import { MVT_TableHeadRow } from './MVT_TableHeadRow'
import classes from './MVT_TableHead.module.css'

export const MVT_TableHead = defineComponent({
  name: 'MVTTableHead',
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
  },
  setup(props, { attrs }) {
    return () => {
      const { columnVirtualizer, table } = props
      const {
        getHeaderGroups,
        getSelectedRowModel,
        getState,
        options: {
          enableStickyHeader,
          layoutMode,
          mantineTableHeadProps,
          positionToolbarAlertBanner,
        },
        refs: { tableHeadRef },
      } = table
      const { isFullScreen, showAlertBanner } = getState()

      const tableHeadProps = {
        ...parseFromValuesOrFunc(mantineTableHeadProps, { table }),
        ...attrs,
      }

      const stickyHeader = enableStickyHeader || isFullScreen

      return h(
        TableThead,
        {
          ...tableHeadProps,
          class: clsx(
            classes.root,
            layoutMode?.startsWith('grid') ? classes['root-grid'] : classes['root-table-row-group'],
            stickyHeader && classes['root-sticky'],
            (tableHeadProps as any)?.class,
          ),
          pos: stickyHeader && layoutMode?.startsWith('grid') ? 'sticky' : 'relative',
          ref: (el: any) => {
            const node = (el?.$el ?? el) as HTMLTableSectionElement
            tableHeadRef.value = node
            if ((tableHeadProps as any)?.ref) {
              ;(tableHeadProps as any).ref.value = node
            }
          },
        } as any,
        () =>
          positionToolbarAlertBanner === 'head-overlay' &&
          (showAlertBanner || getSelectedRowModel().rows.length > 0)
            ? h(
                TableTr,
                {
                  class: clsx(classes['banner-tr'], layoutMode?.startsWith('grid') && classes.grid),
                } as any,
                () =>
                  h(
                    TableTh,
                    {
                      class: clsx(
                        classes['banner-th'],
                        layoutMode?.startsWith('grid') && classes.grid,
                      ),
                      colspan: table.getVisibleLeafColumns().length,
                    } as any,
                    () => h(MVT_ToolbarAlertBanner, { table } as any),
                  ),
              )
            : getHeaderGroups().map((headerGroup) =>
                h(MVT_TableHeadRow, {
                  columnVirtualizer,
                  headerGroup,
                  key: headerGroup.id,
                  table,
                } as any),
              ),
      )
    }
  },
})
