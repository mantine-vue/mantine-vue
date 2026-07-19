import { defineComponent, h, type PropType } from 'vue'

import { TableTfoot } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_ColumnVirtualizer, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_TableFooterRow } from './MVT_TableFooterRow'
import classes from './MVT_TableFooter.module.css'

export const MVT_TableFooter = defineComponent({
  name: 'MVTTableFooter',
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
        getFooterGroups,
        getState,
        options: { enableStickyFooter, layoutMode, mantineTableFooterProps },
        refs: { tableFooterRef },
      } = table
      const { isFullScreen } = getState()

      const tableFooterProps = {
        ...parseFromValuesOrFunc(mantineTableFooterProps, { table }),
        ...attrs,
      }

      const stickFooter = (isFullScreen || enableStickyFooter) && enableStickyFooter !== false

      return h(
        TableTfoot,
        {
          ...tableFooterProps,
          class: clsx(
            classes.root,
            (tableFooterProps as any)?.class,
            stickFooter && classes.sticky,
            layoutMode?.startsWith('grid') && classes.grid,
          ),
          ref: (el: any) => {
            const node = (el?.$el ?? el) as HTMLTableSectionElement
            tableFooterRef.value = node
            if ((tableFooterProps as any)?.ref) {
              ;(tableFooterProps as any).ref.value = node
            }
          },
        } as any,
        () =>
          getFooterGroups().map((footerGroup) =>
            h(MVT_TableFooterRow, {
              columnVirtualizer,
              footerGroup,
              key: footerGroup.id,
              table,
            } as any),
          ),
      )
    }
  },
})
