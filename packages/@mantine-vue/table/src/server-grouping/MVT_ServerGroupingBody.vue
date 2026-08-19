<script lang="ts">
import type { VNodeChild } from 'vue'
import type { MVT_Column, MVT_Row, MVT_RowData } from '../types'
import type {
  MVT_ServerGroupNode,
  MVT_ServerGroupPathId,
  MVT_ServerGroupingPathState,
} from './serverGrouping.types'

const INDENT_PX = 24

interface ServerGroupingCell {
  content?: VNodeChild
  key: string
  kind: 'aggregate' | 'label' | 'spacer'
  style: Record<string, any>
}

/**
 * The hierarchy flattened into sibling `<tr>`s. Table rows cannot nest, so the
 * recursive walk produces a list the template renders in one pass.
 */
type ServerGroupingEntry =
  | {
      cells: ServerGroupingCell[]
      count: VNodeChild
      depth: number
      expanded: boolean
      hasChildren: boolean
      key: string
      kind: 'group'
      label: VNodeChild
      node: MVT_ServerGroupNode
      pathId: MVT_ServerGroupPathId
      rowProps: Record<string, any>
      showLoader: boolean
    }
  | {
      custom: VNodeChild
      depth: number
      error: unknown
      key: string
      kind: 'error'
      retry: () => void
    }
  | { custom: VNodeChild; depth: number; key: string; kind: 'empty' | 'loading' }
  | { index: number; key: string; kind: 'record'; numRows: number; row: MVT_Row<MVT_RowData> }
  | {
      depth: number
      isFetching: boolean
      key: string
      kind: 'pagination'
      pageIndex: number
      rangeLabel: string
      setPageIndex: (pageIndex: number) => void
      totalRowCount: number
      lastRowIndex: number
    }

export type { ServerGroupingCell, ServerGroupingEntry, MVT_Column }
</script>

<script setup lang="ts">
/** Renders the server-grouping hierarchy as rows of the root table body. */
import { computed } from 'vue'

import { ActionIcon, Alert, Button, Group, Loader, TableTd, TableTr, Text } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_TableInstance } from '../types'
import { parseFromValuesOrFunc } from '../utils/utils'
import { getMVT_ColumnWidthStyles } from '../utils/style.utils'
import { flexRender } from '../utils/tanstack.helpers'
import { MVT_RenderNode } from '../utils/renderable'
import { useMVT_Slots } from '../components/MVT_TableSlots'
import MVT_TableBodyRow from '../components/body/MVT_TableBodyRow.vue'
import {
  MVT_SERVER_GROUPING_ROOT_PATH_ID,
  type MVT_ServerGroupRowContext,
} from './serverGrouping.types'
import { createServerGroupPathId, getServerGroupPathDepth } from './serverGrouping.utils'
import { type MVT_ServerGroupingManager } from './useMVT_ServerGrouping'
import classes from './MVT_ServerGrouping.module.css'

defineOptions({ name: 'MVTServerGroupingBody', inheritAttrs: false })

const props = defineProps<{
  table: MVT_TableInstance<MVT_RowData>
  tableProps: Record<string, any>
}>()

const mvtSlots = useMVT_Slots()

const manager = computed(
  () => (props.table as any)._serverGrouping as MVT_ServerGroupingManager<MVT_RowData> | undefined,
)

const localization = computed(
  () => props.table.options.localization as unknown as Record<string, string>,
)
const icons = computed(() => props.table.options.icons)
const layoutMode = computed(() => props.table.options.layoutMode)
const isGridLayout = computed(() => !!layoutMode.value?.startsWith('grid'))

const visibleColumns = computed(
  () => (props.table as any).getVisibleLeafColumns() as MVT_Column<MVT_RowData>[],
)
const colSpan = computed(() => visibleColumns.value.length || 1)

const paginationOptions = computed(() => {
  const sgOptions = manager.value?.options
  const tableOptions = props.table.options
  return {
    enabled: sgOptions?.pagination?.enabled ?? true,
    mantineActionIconProps: sgOptions?.pagination?.mantineActionIconProps ?? {},
    showAtRoot:
      sgOptions?.pagination?.showAtRoot ??
      (tableOptions.enablePagination === false || tableOptions.positionPagination === 'none'),
    showForGroups: sgOptions?.pagination?.showForGroups ?? true,
    showForRecords: sgOptions?.pagination?.showForRecords ?? true,
  }
})

const indentStyle = (depth: number) => ({ paddingInlineStart: `${8 + depth * INDENT_PX}px` })

const columnStyle = (column: MVT_Column<MVT_RowData>, extra?: Record<string, any>) => ({
  ...getMVT_ColumnWidthStyles({
    columnId: column.id,
    grow: column.columnDef.grow,
    layoutMode: layoutMode.value,
    minSize: column.columnDef.minSize,
  }),
  ...extra,
})

const auxCellStyle = (depth: number) => ({
  ...indentStyle(depth),
  ...(isGridLayout.value ? { flex: '1 0 auto', width: '100%' } : {}),
})

/**
 * Walks the loaded hierarchy into a flat row list. Called on every render (not
 * cached in a `computed`) because the resolved slot / `renderX` results it
 * carries are vnodes, which must not be handed to a second patch.
 */
const rowEntries = () => {
  const activeManager = manager.value
  const entries: ServerGroupingEntry[] = []
  if (!activeManager) return entries

  const table = props.table as MVT_TableInstance<any>
  const sgOptions = activeManager.options
  const l = localization.value

  const loadingCustom = (pathId: MVT_ServerGroupPathId, depth: number) =>
    (mvtSlots as any).serverGroupLoading?.({ depth, pathId, table }) ??
    parseFromValuesOrFunc(sgOptions.renderGroupLoading, { depth, pathId, table })

  const errorCustom = (pathId: MVT_ServerGroupPathId, error: unknown, retry: () => void) =>
    (mvtSlots as any).serverGroupError?.({ error, pathId, retry, table }) ??
    parseFromValuesOrFunc(sgOptions.renderGroupError, { error, pathId, retry, table })

  const emptyCustom = (pathId: MVT_ServerGroupPathId, field: string | undefined) => {
    const parentGroup = activeManager.getParentItems(pathId).at(-1)
    return (
      (mvtSlots as any).serverGroupEmpty?.({ field, parentGroup, pathId, table }) ??
      parseFromValuesOrFunc(sgOptions.renderGroupEmpty, { field, parentGroup, pathId, table })
    )
  }

  const pushPagination = (
    pathId: MVT_ServerGroupPathId,
    depth: number,
    state: MVT_ServerGroupingPathState<MVT_RowData>,
  ) => {
    const options = paginationOptions.value
    const isRoot = pathId === MVT_SERVER_GROUPING_ROOT_PATH_ID
    const { pageIndex, pageSize } = state.pagination
    const totalRowCount = state.rowCount

    const show =
      options.enabled &&
      (state.kind === 'groups' ? options.showForGroups : options.showForRecords) &&
      (!isRoot || options.showAtRoot) &&
      (totalRowCount > pageSize || pageIndex > 0)
    if (!show) return

    const firstRowIndex = pageIndex * pageSize
    const lastRowIndex = Math.min(firstRowIndex + pageSize, totalRowCount)

    entries.push({
      depth,
      isFetching: !!state.isFetching,
      key: `${pathId}:pagination`,
      kind: 'pagination',
      lastRowIndex,
      pageIndex,
      rangeLabel: `${totalRowCount === 0 ? 0 : (firstRowIndex + 1).toLocaleString()}-${lastRowIndex.toLocaleString()} ${l.of} ${totalRowCount.toLocaleString()}`,
      setPageIndex: (nextPageIndex: number) =>
        activeManager.setPagination(pathId, { pageIndex: nextPageIndex }),
      totalRowCount,
    })
  }

  const pushGroup = (
    node: MVT_ServerGroupNode,
    parentPathId: MVT_ServerGroupPathId,
    field: string,
    depth: number,
  ) => {
    const pathId = createServerGroupPathId(parentPathId, field, node.id)
    const expanded = activeManager.isExpanded(pathId)
    const childState = activeManager.getPathState(pathId)
    const context: MVT_ServerGroupRowContext = {
      depth,
      field,
      group: node,
      isExpanded: expanded,
      parentGroups: activeManager.getParentItems(pathId).slice(0, -1),
      pathId,
      table,
    }

    const label =
      (mvtSlots as any).serverGroupLabel?.(context) ??
      parseFromValuesOrFunc(sgOptions.renderGroupLabel, context) ??
      node.label
    const count =
      (mvtSlots as any).serverGroupCount?.(context) ??
      parseFromValuesOrFunc(sgOptions.renderGroupCount, context) ??
      (node.count !== undefined ? `(${node.count.toLocaleString()})` : null)

    // Group labels occupy the first data column; display columns remain empty.
    const labelColumn = visibleColumns.value.find(
      (column) => (column.columnDef as any).columnDefType !== 'display',
    )

    const aggregateContent = (column: MVT_Column<MVT_RowData>): VNodeChild => {
      const columnServerGrouping = (column.columnDef as any).serverGrouping
      if (columnServerGrouping?.visible !== false && columnServerGrouping?.getValue) {
        const value = columnServerGrouping.getValue({ ...context, column })
        const cellContext = { ...context, column, value }
        return (
          (mvtSlots as any).serverGroupCell?.(cellContext) ??
          (columnServerGrouping.Cell
            ? flexRender(columnServerGrouping.Cell, cellContext)
            : ((value ?? null) as VNodeChild))
        )
      }
      if ((mvtSlots as any).serverGroupCell) {
        return (mvtSlots as any).serverGroupCell({ ...context, column, value: undefined })
      }
      return null
    }

    const cells: ServerGroupingCell[] = visibleColumns.value.length
      ? visibleColumns.value.map((column) =>
          column.id === labelColumn?.id
            ? {
                key: column.id,
                kind: 'label' as const,
                style: columnStyle(column, indentStyle(depth)),
              }
            : (column.columnDef as any).columnDefType === 'display'
              ? { key: column.id, kind: 'spacer' as const, style: columnStyle(column) }
              : {
                  content: aggregateContent(column),
                  key: column.id,
                  kind: 'aggregate' as const,
                  style: columnStyle(column),
                },
        )
      : [{ key: 'mvt-server-group-label', kind: 'label', style: indentStyle(depth) }]

    entries.push({
      cells,
      count,
      depth,
      expanded,
      hasChildren: node.hasChildren !== false,
      key: pathId,
      kind: 'group',
      label,
      node,
      pathId,
      rowProps: (parseFromValuesOrFunc(sgOptions.mantineGroupRowProps, context) ?? {}) as Record<
        string,
        any
      >,
      showLoader: !!(expanded && childState?.isFetching && !childState.isLoading),
    })

    if (expanded) pushLevel(pathId, depth + 1)
  }

  const pushLevel = (pathId: MVT_ServerGroupPathId, depth: number) => {
    const state = activeManager.getPathState(pathId)
    const field = activeManager.getGroupingFields()[getServerGroupPathDepth(pathId)]

    if (!state || state.isLoading) {
      entries.push({
        custom: loadingCustom(pathId, depth),
        depth,
        key: `${pathId}:loading`,
        kind: 'loading',
      })
      return
    }
    if (state.error != null) {
      const retry = () => activeManager.retry(pathId)
      entries.push({
        custom: errorCustom(pathId, state.error, retry),
        depth,
        error: state.error,
        key: `${pathId}:error`,
        kind: 'error',
        retry,
      })
      return
    }

    if (state.kind === 'groups') {
      const groups = state.groups ?? []
      if (!groups.length) {
        entries.push({
          custom: emptyCustom(pathId, field),
          depth,
          key: `${pathId}:empty`,
          kind: 'empty',
        })
      } else {
        groups.forEach((node) => pushGroup(node, pathId, field, depth))
      }
    } else if (!(state.rows ?? []).length) {
      entries.push({
        custom: emptyCustom(pathId, field),
        depth,
        key: `${pathId}:empty`,
        kind: 'empty',
      })
    } else {
      // Reuse manager-cached rows so rendering and selection share stable ids.
      const rows = activeManager.getRecordRows(pathId)
      rows.forEach((row, index) =>
        entries.push({ index, key: row.id, kind: 'record', numRows: rows.length, row }),
      )
    }

    pushPagination(pathId, depth, state)
  }

  pushLevel(MVT_SERVER_GROUPING_ROOT_PATH_ID, 0)
  return entries
}

const auxRowClass = computed(() =>
  clsx(classes['aux-row'], isGridLayout.value && classes['row-grid']),
)

const groupRowProps = (entry: Extract<ServerGroupingEntry, { kind: 'group' }>) => ({
  'aria-expanded': entry.hasChildren ? String(entry.expanded) : undefined,
  'aria-level': entry.depth + 1,
  'data-depth': entry.depth,
  'data-expanded': entry.expanded || undefined,
  ...entry.rowProps,
  class: clsx(
    classes['group-row'],
    isGridLayout.value && classes['row-grid'],
    entry.rowProps.class,
  ),
})

const toggleGroup = (pathId: MVT_ServerGroupPathId) => manager.value?.toggle(pathId)

const paginationActionIconProps = computed(() => paginationOptions.value.mantineActionIconProps)

const errorMessage = (error: unknown) =>
  localization.value.errorLoadingData ??
  (error instanceof Error && error.message) ??
  'Error loading data'
</script>

<template>
  <template v-for="entry in rowEntries()" :key="entry.key">
    <MVT_TableBodyRow
      v-if="entry.kind === 'record'"
      :numRows="entry.numRows"
      :renderedRowIndex="entry.index"
      :row="entry.row"
      :table="table"
      :tableProps="tableProps"
    />
    <TableTr v-else-if="entry.kind === 'group'" v-bind="groupRowProps(entry)">
      <TableTd
        v-for="cell in entry.cells"
        :key="cell.key"
        :class="
          cell.kind === 'label'
            ? classes['group-cell']
            : cell.kind === 'aggregate'
              ? classes['aggregate-cell']
              : undefined
        "
        :style="cell.style"
      >
        <Group v-if="cell.kind === 'label'" gap="xs" wrap="nowrap">
          <ActionIcon
            v-if="entry.hasChildren"
            :aria-expanded="entry.expanded ? 'true' : 'false'"
            :aria-label="`${entry.expanded ? localization.collapse : localization.expand} ${entry.node.label}`"
            color="gray"
            size="sm"
            variant="subtle"
            @click="toggleGroup(entry.pathId)"
          >
            <component :is="entry.expanded ? icons.IconChevronDown : icons.IconChevronRight" />
          </ActionIcon>
          <span v-else :class="classes['expand-spacer']" />
          <Text :fw="600" size="sm"><MVT_RenderNode :node="entry.label" /></Text>
          <Text v-if="entry.count !== null" c="dimmed" size="sm">
            <MVT_RenderNode :node="entry.count" />
          </Text>
          <Loader v-if="entry.showLoader" size="xs" />
        </Group>
        <MVT_RenderNode v-else-if="cell.kind === 'aggregate'" :node="cell.content" />
      </TableTd>
    </TableTr>
    <TableTr v-else :class="auxRowClass">
      <TableTd :class="classes['aux-cell']" :colspan="colSpan" :style="auxCellStyle(entry.depth)">
        <MVT_RenderNode
          v-if="entry.kind !== 'pagination' && entry.custom != null"
          :node="entry.custom"
        />
        <Group v-else-if="entry.kind === 'loading'" gap="xs">
          <Loader size="xs" />
          <Text c="dimmed" size="sm">{{ localization.loading ?? 'Loading…' }}</Text>
        </Group>
        <Alert v-else-if="entry.kind === 'error'" color="red" role="alert" variant="light">
          <Group gap="sm">
            <Text size="sm">{{ errorMessage(entry.error) }}</Text>
            <Button color="red" size="compact-xs" variant="outline" @click="entry.retry">
              {{ localization.retry ?? 'Retry' }}
            </Button>
          </Group>
        </Alert>
        <Text v-else-if="entry.kind === 'empty'" c="dimmed" size="sm">
          {{ localization.noRecordsToDisplay ?? 'No records to display' }}
        </Text>
        <Group
          v-else-if="entry.kind === 'pagination'"
          :class="classes.pagination"
          gap="xs"
          wrap="nowrap"
        >
          <Text c="dimmed" size="sm">{{ entry.rangeLabel }}</Text>
          <ActionIcon
            color="gray"
            size="sm"
            variant="subtle"
            v-bind="paginationActionIconProps"
            :aria-label="localization.goToPreviousPage"
            :disabled="entry.pageIndex <= 0 || entry.isFetching"
            @click="entry.setPageIndex(entry.pageIndex - 1)"
          >
            <component :is="icons.IconChevronLeft" />
          </ActionIcon>
          <ActionIcon
            color="gray"
            size="sm"
            variant="subtle"
            v-bind="paginationActionIconProps"
            :aria-label="localization.goToNextPage"
            :disabled="entry.lastRowIndex >= entry.totalRowCount || entry.isFetching"
            @click="entry.setPageIndex(entry.pageIndex + 1)"
          >
            <component :is="icons.IconChevronRight" />
          </ActionIcon>
        </Group>
      </TableTd>
    </TableTr>
  </template>
</template>
