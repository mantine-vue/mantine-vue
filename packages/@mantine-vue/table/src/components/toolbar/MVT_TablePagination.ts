import clsx from 'clsx'
import { ActionIcon, Box, Group, Pagination, Select, Text } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_TablePagination.module.css'

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100].map(String)
export const MVT_TablePagination = defineComponent({
  name: 'MVTTablePagination',
  inheritAttrs: false,
  props: {
    position: { type: String as PropType<'bottom' | 'top'>, default: 'bottom' },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs }) {
    return () => {
      const { table } = props
      const o = table.options
      const state = table.getState()
      const { pageIndex = 0, pageSize = 10 } = state.pagination
      const paginationProps = {
        ...parseFromValuesOrFunc(o.mantinePaginationProps, { table }),
        ...attrs,
      } as Record<string, any>
      const totalRowCount = o.rowCount ?? table.getPrePaginationRowModel().rows.length
      const numberOfPages = Math.ceil(totalRowCount / pageSize)
      const firstRowIndex = pageIndex * pageSize
      const lastRowIndex = Math.min(firstRowIndex + pageSize, totalRowCount)
      const showEdges = numberOfPages > 2
      const {
        rowsPerPageOptions = defaultRowsPerPage,
        showRowsPerPage = true,
        withEdges = showEdges,
        ...rest
      } = paginationProps
      const controls =
        o.paginationDisplayMode === 'pages'
          ? h(Pagination, {
              total: numberOfPages,
              value: pageIndex + 1,
              withEdges,
              ...rest,
              onChange: (page: number) => table.setPageIndex(page - 1),
            } as any)
          : o.paginationDisplayMode === 'default'
            ? [
                h(
                  Text,
                  null,
                  () =>
                    `${lastRowIndex === 0 ? 0 : (firstRowIndex + 1).toLocaleString()}-${lastRowIndex.toLocaleString()} ${o.localization.of} ${totalRowCount.toLocaleString()}`,
                ),
                h(Group, { gap: 6 }, () => [
                  withEdges &&
                    h(
                      ActionIcon,
                      {
                        'aria-label': o.localization.goToFirstPage,
                        color: 'gray',
                        disabled: pageIndex <= 0,
                        variant: 'subtle',
                        onClick: () => table.setPageIndex(0),
                      },
                      () => h(o.icons.IconChevronLeftPipe),
                    ),
                  h(
                    ActionIcon,
                    {
                      'aria-label': o.localization.goToPreviousPage,
                      color: 'gray',
                      disabled: pageIndex <= 0,
                      variant: 'subtle',
                      onClick: () => table.setPageIndex(pageIndex - 1),
                    },
                    () => h(o.icons.IconChevronLeft),
                  ),
                  h(
                    ActionIcon,
                    {
                      'aria-label': o.localization.goToNextPage,
                      color: 'gray',
                      disabled: lastRowIndex >= totalRowCount,
                      variant: 'subtle',
                      onClick: () => table.setPageIndex(pageIndex + 1),
                    },
                    () => h(o.icons.IconChevronRight),
                  ),
                  withEdges &&
                    h(
                      ActionIcon,
                      {
                        'aria-label': o.localization.goToLastPage,
                        color: 'gray',
                        disabled: lastRowIndex >= totalRowCount,
                        variant: 'subtle',
                        onClick: () => table.setPageIndex(Math.max(0, numberOfPages - 1)),
                      },
                      () => h(o.icons.IconChevronRightPipe),
                    ),
                ]),
              ]
            : null
      return h(
        Box,
        {
          class: clsx(
            'mvt-table-pagination',
            classes.root,
            props.position === 'top' &&
              o.enableToolbarInternalActions &&
              !state.showGlobalFilter &&
              classes['with-top-margin'],
          ),
        },
        () => [
          showRowsPerPage &&
            h(Group, { gap: 'xs' }, () => [
              h(Text, { id: 'rpp-label' }, () => o.localization.rowsPerPage),
              h(Select, {
                allowDeselect: false,
                'aria-labelledby': 'rpp-label',
                class: classes.pagesize,
                data: rowsPerPageOptions,
                value: pageSize.toString(),
                onChange: (value: null | string) => value && table.setPageSize(+value),
              } as any),
            ]),
          controls,
        ],
      )
    }
  },
})
