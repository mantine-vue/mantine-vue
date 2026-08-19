<script setup lang="ts">
import clsx from 'clsx'
import { ActionIcon, Alert, Badge, Button, Collapse, Flex, Stack } from '@mantine-vue/core'
import { computed, h, useAttrs, useSlots, type VNodeChild } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { MVT_SERVER_GROUPING_ROOT_PATH_ID } from '../../server-grouping/serverGrouping.types'
import { getMVT_SelectAllHandler } from '../../utils/row.utils'
import { createRenderable, MVT_RenderNode } from '../../utils/renderable'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_SelectCheckbox from '../inputs/MVT_SelectCheckbox.vue'
import classes from './MVT_ToolbarAlertBanner.module.css'

defineOptions({ name: 'MVTToolbarAlertBanner', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    stackAlertBanner?: boolean
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { stackAlertBanner: false },
)

defineSlots<{
  default?: (arg: {
    groupedAlert: VNodeChild
    selectedAlert: VNodeChild
    table: MVT_TableInstance<MVT_RowData>
  }) => any
}>()

const attrs = useAttrs()
const slots = useSlots()

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const alertProps = (): any => {
  const { table } = props
  const banner = {
    ...parseFromValuesOrFunc(table.options.mantineToolbarAlertBannerProps, { table }),
    ...attrs,
  } as Record<string, any>

  return {
    color: 'blue',
    icon: false,
    ...banner,
    class: clsx(
      classes.alert,
      props.stackAlertBanner &&
        !table.options.positionToolbarAlertBanner &&
        classes['alert-stacked'],
      !props.stackAlertBanner &&
        table.options.positionToolbarAlertBanner === 'bottom' &&
        classes['alert-bottom'],
      banner.class,
    ),
  }
}

const buildSelectedAlert = (): VNodeChild => {
  const { table } = props
  const o = table.options
  const state = table.getState()

  const total = o.rowCount ?? table.getPrePaginationRowModel().flatRows.length
  const selectedCount = o.manualPagination
    ? Object.values(state.rowSelection).filter(Boolean).length
    : table.getFilteredSelectedRowModel().rows.length

  const serverGroupingSelection = o.serverGrouping?.selection
  const summary = (table as any)._serverGrouping
    ? table.getServerGroupingSelectionSummary()
    : undefined

  if (!selectedCount && !summary?.isSelectAllMatching) return null

  const showSelectAllMatching =
    !!serverGroupingSelection?.enableSelectAllMatching &&
    ((serverGroupingSelection.selectAllMode ?? 'query') === 'query' ||
      !!serverGroupingSelection.loadAllMatchingRowIds) &&
    !!summary?.isAll &&
    !summary.isSelectAllMatching

  // In grouped mode, rowCount represents root groups rather than records.
  const listsRecords =
    !summary ||
    table.getServerGroupingPathState(MVT_SERVER_GROUPING_ROOT_PATH_ID)?.kind === 'records'

  const selectedText = summary?.isSelectAllMatching
    ? (o.localization.allMatchingRecordsSelected ??
        'All records matching the current filters are selected') +
      (summary.excludedRowIds.length ? ` (${summary.excludedRowIds.length} excluded)` : '')
    : listsRecords
      ? o.localization.selectedCountOfRowCountRowsSelected
          .replace('{selectedCount}', String(selectedCount))
          .replace('{rowCount}', String(total))
      : (o.localization.selectedCountRowsSelected ?? '{selectedCount} row(s) selected').replace(
          '{selectedCount}',
          String(selectedCount),
        )

  return h(Flex, { align: 'center', gap: 'sm' }, () => [
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
          if (summary) {
            table.toggleAllServerGroupingRecordsSelected(false)
            return
          }
          getMVT_SelectAllHandler({ table })(event, false, true)
        },
      },
      () => o.localization.clearSelection,
    ),
  ])
}

const buildGroupedAlert = (): VNodeChild => {
  const { table } = props
  const o = table.options
  const { grouping } = table.getState()
  if (!grouping.length) return null

  const badgeProps = parseFromValuesOrFunc(o.mantineToolbarAlertBannerBadgeProps, { table })

  return h(Flex, null, () => [
    `${o.localization.groupedBy} `,
    ...grouping.flatMap((columnId, index) => {
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
                    : table.setGrouping((prev) => prev.filter((field) => field !== columnId)),
              },
              () => h(o.icons.IconX, { style: { transform: 'scale(0.8)' } }),
            ),
          } as any,
          () => `${label} `,
        ),
      ]
    }),
  ])
}

/**
 * The selected alert is built by the outermost `<Collapse>` binding because it
 * also decides whether the banner expands. The grouped alert is built inside
 * the Collapse slot so its render effect directly tracks grouping changes.
 */
let selectedAlert: VNodeChild = null

const collapseProps = () => {
  selectedAlert = buildSelectedAlert()
  const hasGroupedAlert = props.table.getState().grouping.length > 0

  return {
    expanded: props.table.getState().showAlertBanner || !!selectedAlert || hasGroupedAlert,
    transitionDuration: props.stackAlertBanner ? 200 : 0,
  }
}

const customContent = createRenderable(() => {
  const context = { groupedAlert: buildGroupedAlert(), selectedAlert, table: props.table }
  return slots.default?.(context) ?? props.table.options.renderToolbarAlertBannerContent?.(context)
})

const renderAlertChildren = () => alertProps().children
const renderSelectedAlert = () => selectedAlert

// A component render owns the reactive dependency even though Collapse's
// compiled slot is stable and its props can remain unchanged between groups.
const GroupedAlert = () => buildGroupedAlert()

const showSelectAllCheckbox = computed(() => {
  const { enableRowSelection, enableSelectAll, positionToolbarAlertBanner } = props.table.options
  return enableRowSelection && enableSelectAll && positionToolbarAlertBanner === 'head-overlay'
})

const toolbarAlertClass = computed(() =>
  clsx(
    classes['toolbar-alert'],
    props.table.options.positionToolbarAlertBanner === 'head-overlay' && classes['head-overlay'],
    props.table.getState().density,
  ),
)
</script>

<template>
  <Collapse v-bind="collapseProps()">
    <Alert v-bind="alertProps()">
      <MVT_RenderNode v-if="customContent.has()" :node="customContent.node" />
      <Flex v-else :class="toolbarAlertClass">
        <MVT_SelectCheckbox v-if="showSelectAllCheckbox" :table="table" />
        <Stack>
          <MVT_RenderNode :node="renderAlertChildren()" />
          <MVT_RenderNode :node="renderSelectedAlert()" />
          <GroupedAlert />
        </Stack>
      </Flex>
    </Alert>
  </Collapse>
</template>
