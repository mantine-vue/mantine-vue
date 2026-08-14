import clsx from 'clsx'
import { ActionIcon, Alert, Badge, Button, Collapse, Flex, Stack } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { MVT_SERVER_GROUPING_ROOT_PATH_ID } from '../../server-grouping/serverGrouping.types'
import { getMVT_SelectAllHandler } from '../../utils/row.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_SelectCheckbox } from '../inputs/MVT_SelectCheckbox'
import classes from './MVT_ToolbarAlertBanner.module.css'

export const MVT_ToolbarAlertBanner = defineComponent({
  name: 'MVTToolbarAlertBanner',
  inheritAttrs: false,
  props: {
    stackAlertBanner: { type: Boolean, default: false },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const { table } = props
      const state = table.getState()
      const o = table.options
      const alertProps = {
        ...parseFromValuesOrFunc(o.mantineToolbarAlertBannerProps, { table }),
        ...attrs,
      } as Record<string, any>
      const badgeProps = parseFromValuesOrFunc(o.mantineToolbarAlertBannerBadgeProps, { table })
      const total = o.rowCount ?? table.getPrePaginationRowModel().flatRows.length
      const selectedCount = o.manualPagination
        ? Object.values(state.rowSelection).filter(Boolean).length
        : table.getFilteredSelectedRowModel().rows.length
      const serverGroupingSelection = o.serverGrouping?.selection
      const serverGroupingSummary = (table as any)._serverGrouping
        ? table.getServerGroupingSelectionSummary()
        : undefined
      const showSelectAllMatching =
        !!serverGroupingSelection?.enableSelectAllMatching &&
        ((serverGroupingSelection.selectAllMode ?? 'query') === 'query' ||
          !!serverGroupingSelection.loadAllMatchingRowIds) &&
        !!serverGroupingSummary?.isAll &&
        !serverGroupingSummary.isSelectAllMatching

      // In grouped mode, rowCount represents root groups rather than records.
      const serverGroupingListsRecords =
        !serverGroupingSummary ||
        table.getServerGroupingPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.kind === 'records'
      const selectedText = serverGroupingSummary?.isSelectAllMatching
        ? (o.localization.allMatchingRecordsSelected ??
            'All records matching the current filters are selected') +
          (serverGroupingSummary.excludedRowIds.length
            ? ` (${serverGroupingSummary.excludedRowIds.length} excluded)`
            : '')
        : serverGroupingListsRecords
          ? o.localization.selectedCountOfRowCountRowsSelected
              .replace('{selectedCount}', String(selectedCount))
              .replace('{rowCount}', String(total))
          : (o.localization.selectedCountRowsSelected ?? '{selectedCount} row(s) selected').replace(
              '{selectedCount}',
              String(selectedCount),
            )

      const selectedAlert =
        selectedCount || serverGroupingSummary?.isSelectAllMatching
          ? h(Flex, { align: 'center', gap: 'sm' }, () => [
              selectedText,
              showSelectAllMatching &&
                h(
                  Button,
                  {
                    size: 'compact-xs',
                    variant: 'subtle',
                    onClick: () => void table.selectAllMatchingServerGroupingRecords(),
                  },
                  () => o.localization.selectAllMatching ?? 'Select all matching records',
                ),
              h(
                Button,
                {
                  size: 'compact-xs',
                  variant: 'subtle',
                  onClick: (event: Event) => {
                    if (serverGroupingSummary) {
                      table.toggleAllServerGroupingRecordsSelected(false)
                      return
                    }
                    getMVT_SelectAllHandler({ table })(event, false, true)
                  },
                },
                () => o.localization.clearSelection,
              ),
            ])
          : null
      const groupedAlert = state.grouping.length
        ? h(Flex, null, () => [
            `${o.localization.groupedBy} `,
            ...state.grouping.flatMap((columnId, index) => {
              // Backend grouping descriptors may not have a matching table column.
              const column = table.getAllLeafColumns().find((col) => col.id === columnId)
              const header = column?.columnDef.header
              const label = typeof header === 'string' && header.length ? header : columnId
              return [
                index > 0 ? o.localization.thenBy : null,
                h(
                  Badge,
                  {
                    key: columnId,
                    class: classes['alert-badge'],
                    variant: 'filled',
                    ...badgeProps,
                    rightSection: h(
                      ActionIcon,
                      {
                        color: 'white',
                        size: 'xs',
                        variant: 'subtle',
                        onClick: () =>
                          column
                            ? column.toggleGrouping()
                            : table.setGrouping((prev) =>
                                prev.filter((field) => field !== columnId),
                              ),
                      },
                      () => h(o.icons.IconX, { style: { transform: 'scale(0.8)' } }),
                    ),
                  } as any,
                  () => `${label} `,
                ),
              ]
            }),
          ])
        : null
      const custom =
        slots.default?.({ groupedAlert, selectedAlert, table }) ??
        o.renderToolbarAlertBannerContent?.({ groupedAlert, selectedAlert, table })
      return h(
        Collapse,
        {
          expanded: state.showAlertBanner || !!selectedAlert || !!groupedAlert,
          transitionDuration: props.stackAlertBanner ? 200 : 0,
        } as any,
        () =>
          h(
            Alert,
            {
              color: 'blue',
              icon: false,
              ...alertProps,
              class: clsx(
                classes.alert,
                props.stackAlertBanner && !o.positionToolbarAlertBanner && classes['alert-stacked'],
                !props.stackAlertBanner &&
                  o.positionToolbarAlertBanner === 'bottom' &&
                  classes['alert-bottom'],
                alertProps.class,
              ),
            },
            () =>
              custom ??
              h(
                Flex,
                {
                  class: clsx(
                    classes['toolbar-alert'],
                    o.positionToolbarAlertBanner === 'head-overlay' && classes['head-overlay'],
                    state.density,
                  ),
                },
                () => [
                  o.enableRowSelection &&
                  o.enableSelectAll &&
                  o.positionToolbarAlertBanner === 'head-overlay'
                    ? h(MVT_SelectCheckbox, { table })
                    : null,
                  h(Stack, null, () => [alertProps.children, selectedAlert, groupedAlert]),
                ],
              ),
          ),
      )
    }
  },
})
