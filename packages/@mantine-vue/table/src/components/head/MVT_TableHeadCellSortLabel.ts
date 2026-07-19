import { defineComponent, h, type PropType } from 'vue'

import { ActionIcon, Indicator, Tooltip } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_Header, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { dataVariable } from '../../utils/style.utils'
import classes from './MVT_TableHeadCellSortLabel.module.css'

export const MVT_TableHeadCellSortLabel = defineComponent({
  name: 'MVTTableHeadCellSortLabel',
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
        options: {
          icons: { IconArrowsSort, IconSortAscending, IconSortDescending },
          localization,
        },
      } = table
      const column = header.column
      const { columnDef } = column
      const { sorting } = getState()
      const sorted = column.getIsSorted()
      const sortIndex = column.getSortIndex()

      const sortTooltip = sorted
        ? sorted === 'desc'
          ? localization.sortedByColumnDesc.replace('{column}', columnDef.header)
          : localization.sortedByColumnAsc.replace('{column}', columnDef.header)
        : column.getNextSortingOrder() === 'desc'
          ? localization.sortByColumnDesc.replace('{column}', columnDef.header)
          : localization.sortByColumnAsc.replace('{column}', columnDef.header)

      const SortActionButton = h(
        ActionIcon,
        {
          'aria-label': sortTooltip,
          ...dataVariable('sorted', sorted),
          ...attrs,
          class: clsx('mvt-table-head-sort-button', classes['sort-icon'], (attrs as any).class),
        } as any,
        () =>
          sorted === 'desc'
            ? h(IconSortDescending, { size: '100%' })
            : sorted === 'asc'
              ? h(IconSortAscending, { size: '100%' })
              : h(IconArrowsSort, { size: '100%' }),
      )

      return h(Tooltip, { label: sortTooltip, openDelay: 1000, withinPortal: true } as any, () =>
        sorting.length < 2 || sortIndex === -1
          ? SortActionButton
          : h(
              Indicator,
              {
                classNames: {
                  root: clsx(
                    'mvt-table-head-multi-sort-indicator',
                    classes['multi-sort-indicator'],
                  ),
                },
                inline: true,
                label: sortIndex + 1,
                offset: 4,
              } as any,
              () => SortActionButton,
            ),
      )
    }
  },
})
