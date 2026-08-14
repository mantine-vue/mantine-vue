import { defineComponent, Fragment, h, type PropType, type VNodeChild } from 'vue'

import { ActionIcon, Alert, Button, Group, Loader, TableTd, TableTr, Text } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_Column, type MVT_RowData, type MVT_TableInstance } from '../types'
import { parseFromValuesOrFunc } from '../utils/utils'
import { getMVT_ColumnWidthStyles } from '../utils/style.utils'
import { flexRender } from '../utils/tanstack.helpers'
import { useMVT_Slots } from '../components/MVT_TableSlots'
import { MVT_TableBodyRow } from '../components/body/MVT_TableBodyRow'
import {
  MVT_SERVER_GROUPING_ROOT_PATH_ID,
  type MVT_ServerGroupNode,
  type MVT_ServerGroupPathId,
  type MVT_ServerGroupRowContext,
  type MVT_ServerGroupingPathState,
} from './serverGrouping.types'
import { createServerGroupPathId, getServerGroupPathDepth } from './serverGrouping.utils'
import { type MVT_ServerGroupingManager } from './useMVT_ServerGrouping'
import classes from './MVT_ServerGrouping.module.css'

const INDENT_PX = 24

/** Renders the server-grouping hierarchy as rows of the root table body. */
export const MVT_ServerGroupingBody = defineComponent({
  name: 'MVTServerGroupingBody',
  inheritAttrs: false,
  props: {
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
    tableProps: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },
  setup(props) {
    const mvtSlots = useMVT_Slots()

    return () => {
      const { tableProps } = props
      const table = props.table as MVT_TableInstance<any>
      const manager = (table as any)._serverGrouping as
        | MVT_ServerGroupingManager<MVT_RowData>
        | undefined
      if (!manager) return null

      const { options: sgOptions } = manager
      const tableOptions = table.options
      const localization = tableOptions.localization as unknown as Record<string, string>
      const icons = tableOptions.icons
      const visibleColumns = (table as any).getVisibleLeafColumns() as MVT_Column<MVT_RowData>[]
      const colSpan = visibleColumns.length || 1

      const layoutMode = tableOptions.layoutMode
      const paginationOptions = {
        enabled: sgOptions.pagination?.enabled ?? true,
        mantineActionIconProps: sgOptions.pagination?.mantineActionIconProps ?? {},
        showAtRoot:
          sgOptions.pagination?.showAtRoot ??
          (tableOptions.enablePagination === false || tableOptions.positionPagination === 'none'),
        showForGroups: sgOptions.pagination?.showForGroups ?? true,
        showForRecords: sgOptions.pagination?.showForRecords ?? true,
      }

      const indentStyle = (depth: number) => ({
        paddingInlineStart: `${8 + depth * INDENT_PX}px`,
      })

      const columnStyle = (column: MVT_Column<MVT_RowData>, extra?: Record<string, any>) => ({
        ...getMVT_ColumnWidthStyles({
          columnId: column.id,
          grow: column.columnDef.grow,
          layoutMode,
          minSize: column.columnDef.minSize,
        }),
        ...extra,
      })

      const auxRow = (key: string, depth: number, children: VNodeChild) =>
        h(
          TableTr,
          {
            class: clsx(classes['aux-row'], layoutMode?.startsWith('grid') && classes['row-grid']),
            key,
          } as any,
          () =>
            h(
              TableTd,
              {
                class: classes['aux-cell'],
                colspan: colSpan,
                style: {
                  ...indentStyle(depth),
                  ...(layoutMode?.startsWith('grid') ? { flex: '1 0 auto', width: '100%' } : {}),
                },
              } as any,
              () => children,
            ),
        )

      const loadingContent = (pathId: MVT_ServerGroupPathId, depth: number) =>
        (mvtSlots as any).serverGroupLoading?.({ depth, pathId, table }) ??
        parseFromValuesOrFunc(sgOptions.renderGroupLoading, { depth, pathId, table }) ??
        h(Group, { gap: 'xs' } as any, () => [
          h(Loader, { size: 'xs' } as any),
          h(Text, { c: 'dimmed', size: 'sm' } as any, () => localization.loading ?? 'Loading…'),
        ])

      const errorContent = (pathId: MVT_ServerGroupPathId, error: unknown, retry: () => void) =>
        (mvtSlots as any).serverGroupError?.({ error, pathId, retry, table }) ??
        parseFromValuesOrFunc(sgOptions.renderGroupError, { error, pathId, retry, table }) ??
        h(Alert, { color: 'red', role: 'alert', variant: 'light' } as any, () =>
          h(Group, { gap: 'sm' } as any, () => [
            h(
              Text,
              { size: 'sm' } as any,
              () =>
                localization.errorLoadingData ??
                (error instanceof Error && error.message) ??
                'Error loading data',
            ),
            h(
              Button,
              { color: 'red', onClick: retry, size: 'compact-xs', variant: 'outline' } as any,
              () => localization.retry ?? 'Retry',
            ),
          ]),
        )

      const emptyContent = (pathId: MVT_ServerGroupPathId, field: string | undefined) => {
        const parentGroup = manager.getParentItems(pathId).at(-1)
        return (
          (mvtSlots as any).serverGroupEmpty?.({ field, parentGroup, pathId, table }) ??
          parseFromValuesOrFunc(sgOptions.renderGroupEmpty, {
            field,
            parentGroup,
            pathId,
            table,
          }) ??
          h(
            Text,
            { c: 'dimmed', size: 'sm' } as any,
            () => localization.noRecordsToDisplay ?? 'No records to display',
          )
        )
      }

      const paginationRow = (
        pathId: MVT_ServerGroupPathId,
        depth: number,
        state: MVT_ServerGroupingPathState<MVT_RowData>,
      ): VNodeChild | null => {
        const isRoot = pathId === MVT_SERVER_GROUPING_ROOT_PATH_ID
        const { pageIndex, pageSize } = state.pagination
        const totalRowCount = state.rowCount
        const show =
          paginationOptions.enabled &&
          (state.kind === 'groups'
            ? paginationOptions.showForGroups
            : paginationOptions.showForRecords) &&
          (!isRoot || paginationOptions.showAtRoot) &&
          (totalRowCount > pageSize || pageIndex > 0)
        if (!show) return null
        const firstRowIndex = pageIndex * pageSize
        const lastRowIndex = Math.min(firstRowIndex + pageSize, totalRowCount)
        const setPageIndex = (nextPageIndex: number) =>
          manager.setPagination(pathId, { pageIndex: nextPageIndex })
        return auxRow(
          `${pathId}:pagination`,
          depth,
          h(Group, { class: classes.pagination, gap: 'xs', wrap: 'nowrap' } as any, () => [
            h(
              Text,
              { c: 'dimmed', size: 'sm' } as any,
              () =>
                `${totalRowCount === 0 ? 0 : (firstRowIndex + 1).toLocaleString()}-${lastRowIndex.toLocaleString()} ${localization.of} ${totalRowCount.toLocaleString()}`,
            ),
            h(
              ActionIcon,
              {
                color: 'gray',
                size: 'sm',
                variant: 'subtle',
                ...paginationOptions.mantineActionIconProps,
                'aria-label': localization.goToPreviousPage,
                disabled: pageIndex <= 0 || state.isFetching,
                onClick: () => setPageIndex(pageIndex - 1),
              } as any,
              () => h(icons.IconChevronLeft),
            ),
            h(
              ActionIcon,
              {
                color: 'gray',
                size: 'sm',
                variant: 'subtle',
                ...paginationOptions.mantineActionIconProps,
                'aria-label': localization.goToNextPage,
                disabled: lastRowIndex >= totalRowCount || state.isFetching,
                onClick: () => setPageIndex(pageIndex + 1),
              } as any,
              () => h(icons.IconChevronRight),
            ),
          ]),
        )
      }

      const groupRow = (
        node: MVT_ServerGroupNode,
        parentPathId: MVT_ServerGroupPathId,
        field: string,
        depth: number,
      ): VNodeChild[] => {
        const pathId = createServerGroupPathId(parentPathId, field, node.id)
        const expanded = manager.isExpanded(pathId)
        const childState = manager.getPathState(pathId)
        const context: MVT_ServerGroupRowContext = {
          depth,
          field,
          group: node,
          isExpanded: expanded,
          parentGroups: manager.getParentItems(pathId).slice(0, -1),
          pathId,
          table,
        }
        const hasChildren = node.hasChildren !== false

        const rowProps = parseFromValuesOrFunc(sgOptions.mantineGroupRowProps, context) ?? {}

        const label =
          (mvtSlots as any).serverGroupLabel?.(context) ??
          parseFromValuesOrFunc(sgOptions.renderGroupLabel, context) ??
          node.label
        const count =
          (mvtSlots as any).serverGroupCount?.(context) ??
          parseFromValuesOrFunc(sgOptions.renderGroupCount, context) ??
          (node.count !== undefined ? `(${node.count.toLocaleString()})` : null)

        // Group labels occupy the first data column; display columns remain empty.
        const labelColumn = visibleColumns.find(
          (column) => (column.columnDef as any).columnDefType !== 'display',
        )
        const labelCell = (column?: MVT_Column<MVT_RowData>) =>
          h(
            TableTd,
            {
              class: classes['group-cell'],
              key: column?.id ?? 'mvt-server-group-label',
              style: column ? columnStyle(column, indentStyle(depth)) : indentStyle(depth),
            } as any,
            () =>
              h(Group, { gap: 'xs', wrap: 'nowrap' } as any, () => [
                hasChildren
                  ? h(
                      ActionIcon,
                      {
                        'aria-expanded': String(expanded),
                        'aria-label': `${expanded ? localization.collapse : localization.expand} ${node.label}`,
                        color: 'gray',
                        onClick: () => manager.toggle(pathId),
                        size: 'sm',
                        variant: 'subtle',
                      } as any,
                      () => h(expanded ? icons.IconChevronDown : icons.IconChevronRight),
                    )
                  : h('span', { class: classes['expand-spacer'] }),
                h(Text, { fw: 600, size: 'sm' } as any, () => [label]),
                count !== null && h(Text, { c: 'dimmed', size: 'sm' } as any, () => [count]),
                expanded &&
                  childState?.isFetching &&
                  !childState.isLoading &&
                  h(Loader, { size: 'xs' } as any),
              ]),
          )

        const aggregateCell = (column: MVT_Column<MVT_RowData>) => {
          const columnServerGrouping = (column.columnDef as any).serverGrouping
          let content: VNodeChild = null
          if (columnServerGrouping?.visible !== false && columnServerGrouping?.getValue) {
            const value = columnServerGrouping.getValue({ ...context, column })
            const cellContext = { ...context, column, value }
            content =
              (mvtSlots as any).serverGroupCell?.(cellContext) ??
              (columnServerGrouping.Cell
                ? flexRender(columnServerGrouping.Cell, cellContext)
                : ((value ?? null) as VNodeChild))
          } else if ((mvtSlots as any).serverGroupCell) {
            content = (mvtSlots as any).serverGroupCell({ ...context, column, value: undefined })
          }
          return h(
            TableTd,
            {
              class: classes['aggregate-cell'],
              key: column.id,
              style: columnStyle(column),
            } as any,
            () => [content],
          )
        }

        const spacerCell = (column: MVT_Column<MVT_RowData>) =>
          h(TableTd, { key: column.id, style: columnStyle(column) } as any, () => null)

        const cells = visibleColumns.length
          ? visibleColumns.map((column) =>
              column.id === labelColumn?.id
                ? labelCell(column)
                : (column.columnDef as any).columnDefType === 'display'
                  ? spacerCell(column)
                  : aggregateCell(column),
            )
          : [labelCell()]

        const rows: VNodeChild[] = [
          h(
            TableTr,
            {
              'aria-expanded': hasChildren ? String(expanded) : undefined,
              'aria-level': depth + 1,
              'data-depth': depth,
              'data-expanded': expanded || undefined,
              key: pathId,
              ...(rowProps as any),
              class: clsx(
                classes['group-row'],
                layoutMode?.startsWith('grid') && classes['row-grid'],
                (rowProps as any)?.class,
              ),
            } as any,
            () => cells,
          ),
        ]
        if (expanded) {
          rows.push(...levelRows(pathId, depth + 1))
        }
        return rows
      }

      const recordRows = (pathId: MVT_ServerGroupPathId) => {
        // Reuse manager-cached rows so rendering and selection share stable ids.
        const rows = manager.getRecordRows(pathId)
        return rows.map((row, index) =>
          h(MVT_TableBodyRow, {
            key: row.id,
            numRows: rows.length,
            renderedRowIndex: index,
            row,
            table,
            tableProps,
          } as any),
        )
      }

      const levelRows = (pathId: MVT_ServerGroupPathId, depth: number): VNodeChild[] => {
        const state = manager.getPathState(pathId)
        const groupingFields = manager.getGroupingFields()
        const field = groupingFields[getServerGroupPathDepth(pathId)]

        if (!state || state.isLoading) {
          return [auxRow(`${pathId}:loading`, depth, loadingContent(pathId, depth))]
        }
        if (state.error != null) {
          return [
            auxRow(
              `${pathId}:error`,
              depth,
              errorContent(pathId, state.error, () => manager.retry(pathId)),
            ),
          ]
        }
        const out: VNodeChild[] = []
        if (state.kind === 'groups') {
          const groups = state.groups ?? []
          if (!groups.length) {
            out.push(auxRow(`${pathId}:empty`, depth, emptyContent(pathId, field)))
          } else {
            groups.forEach((node) => out.push(...groupRow(node, pathId, field, depth)))
          }
        } else {
          const rows = state.rows ?? []
          if (!rows.length) {
            out.push(auxRow(`${pathId}:empty`, depth, emptyContent(pathId, field)))
          } else {
            out.push(...recordRows(pathId))
          }
        }
        const pagination = paginationRow(pathId, depth, state)
        if (pagination) out.push(pagination)
        return out
      }

      return h(Fragment, null, levelRows(MVT_SERVER_GROUPING_ROOT_PATH_ID, 0))
    }
  },
})
