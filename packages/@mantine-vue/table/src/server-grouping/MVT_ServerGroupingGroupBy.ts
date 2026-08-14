import { defineComponent, h, type PropType, type VNodeChild } from 'vue'

import { ActionIcon, Box, Button, Menu, Pill, PillGroup, Text } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_RowData, type MVT_TableInstance } from '../types'
import { parseFromValuesOrFunc } from '../utils/utils'
import { useMVT_Slots } from '../components/MVT_TableSlots'
import {
  type MVT_ServerGroupableColumn,
  type MVT_ServerGroupingGroupByContext,
} from './serverGrouping.types'
import { type MVT_ServerGroupingManager } from './useMVT_ServerGrouping'
import classes from './MVT_ServerGrouping.module.css'

/**
 * Resolve the columns/fields offered by the group-by toolbar control.
 *
 * With `serverGrouping.groupBy.columns` set, exactly that whitelist is used
 * (entries may be custom descriptors like `'createdAt:month'`). Otherwise
 * every leaf `data` column whose `enableGrouping` is not `false` is offered —
 * display columns and columns with `enableGrouping: false` never appear.
 */
export const getServerGroupableColumns = (
  table: MVT_TableInstance<any>,
): MVT_ServerGroupableColumn[] => {
  const groupByOptions = table.options.serverGrouping?.groupBy
  const getFieldLabel = groupByOptions?.getFieldLabel

  const labelFor = (field: string): string => {
    if (getFieldLabel) return getFieldLabel(field, table)
    const column = table.getAllLeafColumns().find((leafColumn) => leafColumn.id === field)
    const header = column?.columnDef.header
    return typeof header === 'string' && header.length ? header : field
  }

  if (groupByOptions?.columns) {
    return groupByOptions.columns.map((field) => ({ id: field, label: labelFor(field) }))
  }
  return table
    .getAllLeafColumns()
    .filter(
      (column) =>
        (column.columnDef as any).columnDefType === 'data' &&
        column.columnDef.enableGrouping !== false,
    )
    .map((column) => ({ id: column.id, label: labelFor(column.id) }))
}

/** Build the scoped context handed to the group-by slot / render callback. */
export const getServerGroupingGroupByContext = (
  table: MVT_TableInstance<any>,
  manager: MVT_ServerGroupingManager<MVT_RowData>,
): MVT_ServerGroupingGroupByContext => {
  const grouping = manager.getGroupingFields()
  const setGrouping = (next: string[]) => (table as any).setGrouping(next)
  return {
    addGroup: (field) => {
      if (!grouping.includes(field)) setGrouping([...grouping, field])
    },
    clearGrouping: () => setGrouping([]),
    groupableColumns: getServerGroupableColumns(table),
    grouping,
    moveGroup: (field, direction) => {
      const index = grouping.indexOf(field)
      const target = index + direction
      if (index === -1 || target < 0 || target >= grouping.length) return
      const next = [...grouping]
      ;[next[index], next[target]] = [next[target], next[index]]
      setGrouping(next)
    },
    removeGroup: (field) => setGrouping(grouping.filter((activeField) => activeField !== field)),
    table,
  }
}

/**
 * Grouping actions for one column's action menu, or `undefined` when the
 * column cannot be grouped by.
 *
 * Uses exactly the same rules as the toolbar "Group by" control: server
 * grouping must be active and driven by the table's `grouping` state, the
 * control must not be disabled, and the column must be offered by
 * {@link getServerGroupableColumns}.
 */
export const getServerGroupingColumnActions = (
  table: MVT_TableInstance<any>,
  columnId: string,
): MVT_ServerGroupingGroupByContext | undefined => {
  const manager = (table as any)._serverGrouping as
    | MVT_ServerGroupingManager<MVT_RowData>
    | undefined
  if (!manager) return undefined
  const groupByOptions = manager.options.groupBy ?? {}
  if (groupByOptions.enabled === false || groupByOptions.showInColumnActions === false) {
    return undefined
  }
  if (manager.options.grouping && groupByOptions.enabled !== true) return undefined

  const context = getServerGroupingGroupByContext(table, manager)
  return context.groupableColumns.some((column) => column.id === columnId) ? context : undefined
}

/**
 * Built-in group-by toolbar control for server-side grouping. Renders a
 * "Group by" menu (add / reorder / remove / clear levels) plus the active
 * levels as removable pills. Hidden when server grouping is inactive, when
 * `groupBy.enabled` is `false`, or when grouping is a static
 * `serverGrouping.grouping` array (which the control could not change).
 */
export const MVT_ServerGroupingGroupBy = defineComponent({
  name: 'MVTServerGroupingGroupBy',
  inheritAttrs: false,
  props: {
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
  },
  setup(props) {
    const mvtSlots = useMVT_Slots()

    return () => {
      const table = props.table as MVT_TableInstance<any>
      const manager = (table as any)._serverGrouping as
        | MVT_ServerGroupingManager<MVT_RowData>
        | undefined
      if (!manager) return null

      const sgOptions = manager.options
      const groupByOptions = sgOptions.groupBy ?? {}
      if (groupByOptions.enabled === false) return null
      if (sgOptions.grouping && groupByOptions.enabled !== true) return null

      const localization = table.options.localization as unknown as Record<string, string>
      const icons = table.options.icons
      const allowReorder = groupByOptions.allowReorder ?? true
      const allowClearAll = groupByOptions.allowClearAll ?? true

      const context = getServerGroupingGroupByContext(table, manager)
      const { addGroup, clearGrouping, groupableColumns, grouping, moveGroup, removeGroup } =
        context

      const custom =
        (mvtSlots as any).serverGroupByControl?.(context) ??
        parseFromValuesOrFunc(groupByOptions.renderControl, context)
      if (custom !== undefined && custom !== null) return custom as VNodeChild

      const labelFor = (field: string) =>
        groupableColumns.find((column) => column.id === field)?.label ?? field

      const activeRows = grouping.map((field, index) =>
        // Vue warns when component slots are passed as array children.
        h(Box, { class: classes['groupby-active-row'], key: field } as any, () => [
          allowReorder &&
            h(
              ActionIcon,
              {
                'aria-label': `${localization.moveUp ?? 'Move up'} ${labelFor(field)}`,
                color: 'gray',
                disabled: index === 0,
                onClick: () => moveGroup(field, -1),
                size: 'xs',
                variant: 'subtle',
              } as any,
              () => h(icons.IconChevronDown, { style: { transform: 'rotate(180deg)' } }),
            ),
          allowReorder &&
            h(
              ActionIcon,
              {
                'aria-label': `${localization.moveDown ?? 'Move down'} ${labelFor(field)}`,
                color: 'gray',
                disabled: index === grouping.length - 1,
                onClick: () => moveGroup(field, 1),
                size: 'xs',
                variant: 'subtle',
              } as any,
              () => h(icons.IconChevronDown),
            ),
          h(
            Text,
            { class: classes['groupby-active-label'], size: 'sm' } as any,
            () => `${index + 1}. ${labelFor(field)}`,
          ),
          h(
            ActionIcon,
            {
              'aria-label': (localization.ungroupByColumn ?? 'Ungroup by {column}').replace(
                '{column}',
                labelFor(field),
              ),
              color: 'gray',
              onClick: () => removeGroup(field),
              size: 'xs',
              variant: 'subtle',
            } as any,
            () => h(icons.IconX),
          ),
        ]),
      )

      const menu = h(
        Menu,
        {
          closeOnItemClick: false,
          position: 'bottom-start',
          shadow: 'md',
          width: 260,
          ...groupByOptions.mantineMenuProps,
        } as any,
        () => [
          h(Menu.Target, null, () =>
            h(
              Button,
              {
                size: 'xs',
                variant: 'default',
                ...groupByOptions.mantineButtonProps,
                leftSection: groupByOptions.mantineButtonProps?.leftSection ?? h(icons.IconColumns),
              } as any,
              () => localization.groupBy ?? 'Group by',
            ),
          ),
          h(Menu.Dropdown, null, () => [
            groupableColumns.length
              ? groupableColumns.map((column) =>
                  h(
                    Menu.Item,
                    {
                      disabled: grouping.includes(column.id),
                      key: column.id,
                      onClick: () => addGroup(column.id),
                    } as any,
                    () => column.label,
                  ),
                )
              : h(
                  Menu.Label,
                  null,
                  () => localization.noGroupableColumns ?? 'No groupable columns',
                ),
            grouping.length > 0 && [
              h(Menu.Divider),
              h(Menu.Label, null, () => (localization.groupedBy ?? 'Grouped by ').trim()),
              ...activeRows,
            ],
            allowClearAll &&
              grouping.length > 0 && [
                h(Menu.Divider),
                h(
                  Menu.Item,
                  { color: 'red', onClick: () => clearGrouping() } as any,
                  () => localization.clearGrouping ?? 'Clear grouping',
                ),
              ],
          ]),
        ],
      )

      const pills =
        grouping.length > 0 &&
        h(PillGroup, { gap: 4 } as any, () =>
          grouping.map((field, index) => {
            const pillProps =
              parseFromValuesOrFunc(groupByOptions.mantinePillProps, { field, index }) ?? {}
            return h(
              Pill,
              {
                size: 'sm',
                withRemoveButton: true,
                ...pillProps,
                key: field,
                onRemove: () => removeGroup(field),
                removeButtonProps: {
                  'aria-label': (localization.ungroupByColumn ?? 'Ungroup by {column}').replace(
                    '{column}',
                    labelFor(field),
                  ),
                  ...pillProps?.removeButtonProps,
                },
              } as any,
              () => `${index + 1}. ${labelFor(field)}`,
            )
          }),
        )

      return h(
        Box,
        {
          class: clsx('mvt-server-groupby-control', classes['groupby-control']),
          style: { display: 'flex', gap: '8px' },
        } as any,
        () => [menu, pills],
      )
    }
  },
})
