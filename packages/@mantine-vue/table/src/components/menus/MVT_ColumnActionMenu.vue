<script setup lang="ts">
import { ActionIcon, Menu, Tooltip } from '@mantine-vue/core'
import { computed, h, useAttrs, useSlots, type Component, type VNodeChild } from 'vue'
import { getServerGroupingColumnActions } from '../../server-grouping/MVT_ServerGroupingGroupBy.vue'
import type { MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { useMVT_Slots } from '../MVT_TableSlots'
import classes from './MVT_ColumnActionMenu.module.css'
import { MVT_RenderNode } from '../../utils/renderable'

/** One entry of the built-in column menu, kept as data so it can be rendered
 * into the template *and* handed to `renderColumnActionsMenuItems` as vnodes. */
interface ColumnMenuEntry {
  disabled?: boolean
  icon?: Component
  iconClass?: string
  key: string
  label?: string
  onClick?: () => void
  type: 'divider' | 'item'
}

defineOptions({ name: 'MVTColumnActionMenu', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    header: MVT_Header<MVT_RowData>
    onChange?: (opened: boolean) => void
    opened?: boolean
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { onChange: undefined, opened: undefined },
)

defineSlots<{
  default?: (arg: {
    column: MVT_Header<MVT_RowData>['column']
    internalColumnMenuItems: VNodeChild[]
    table: MVT_TableInstance<MVT_RowData>
  }) => any
}>()

const attrs = useAttrs()
const slots = useSlots()
const mvtSlots = useMVT_Slots()

const column = computed(() => props.header.column)
const columnDef = computed(() => column.value.columnDef)

const actionProps = computed(() => {
  const context = { column: column.value, table: props.table }
  return {
    ...parseFromValuesOrFunc(props.table.options.mantineColumnActionsButtonProps, context),
    ...parseFromValuesOrFunc(columnDef.value.mantineColumnActionsButtonProps, context),
  } as Record<string, any>
})

const menuEntries = computed<ColumnMenuEntry[]>(() => {
  const { table } = props
  const col = column.value
  const def = columnDef.value
  const o = table.options
  const { icons, localization: l } = o
  const state = table.getState()
  const header = String(def.header)
  const entries: ColumnMenuEntry[] = []

  const divider = (key: string) => entries.push({ key, type: 'divider' })
  const item = (entry: Omit<ColumnMenuEntry, 'type'>) => entries.push({ ...entry, type: 'item' })

  if (o.enableSorting && col.getCanSort()) {
    if (o.enableSortingRemoval !== false)
      item({
        disabled: !col.getIsSorted(),
        icon: icons.IconClearAll,
        key: 'clear-sort',
        label: l.clearSort,
        onClick: () => col.clearSorting(),
      })
    item({
      disabled: col.getIsSorted() === 'asc',
      icon: icons.IconSortAscending,
      key: 'sort-asc',
      label: l.sortByColumnAsc.replace('{column}', header),
      onClick: () => col.toggleSorting(false),
    })
    item({
      disabled: col.getIsSorted() === 'desc',
      icon: icons.IconSortDescending,
      key: 'sort-desc',
      label: l.sortByColumnDesc.replace('{column}', header),
      onClick: () => col.toggleSorting(true),
    })
    if (o.enableColumnFilters || o.enableGrouping || o.enableHiding) divider('after-sort')
  }

  if (o.enableColumnFilters && o.columnFilterDisplayMode !== 'popover' && col.getCanFilter()) {
    item({
      disabled: !col.getFilterValue(),
      icon: icons.IconFilterOff,
      key: 'clear-filter',
      label: l.clearFilter,
      onClick: () => col.setFilterValue(''),
    })
    item({
      icon: icons.IconFilter,
      key: 'filter-by',
      label: l.filterByColumn.replace('{column}', header),
      onClick: () => {
        table.setShowColumnFilters(true)
        setTimeout(() => table.refs.filterInputRefs.value[`${col.id}-0`]?.focus(), 100)
      },
    })
    if (o.enableGrouping || o.enableHiding) divider('after-filter')
  }

  const serverGroupBy = getServerGroupingColumnActions(table as MVT_TableInstance<any>, col.id)

  if (o.enableGrouping && col.getCanGroup()) {
    item({
      icon: icons.IconBoxMultiple,
      key: 'grouping',
      label: l[col.getIsGrouped() ? 'ungroupByColumn' : 'groupByColumn'].replace(
        '{column}',
        header,
      ),
      onClick: () => {
        col.toggleGrouping()
        table.setColumnOrder((old: string[]) => ['mvt-row-expand', ...old])
      },
    })
    if (o.enableColumnPinning) divider('after-grouping')
  } else if (serverGroupBy) {
    const { addGroup, grouping, removeGroup } = serverGroupBy
    item(
      grouping.includes(col.id)
        ? {
            icon: icons.IconClearAll,
            key: 'grouping',
            label: l.clearGrouping ?? 'Clear grouping',
            onClick: () => removeGroup(col.id),
          }
        : {
            icon: icons.IconBoxMultiple,
            key: 'grouping',
            label: l.groupByColumn.replace('{column}', header),
            onClick: () => addGroup(col.id),
          },
    )
    if (o.enableColumnPinning) divider('after-grouping')
  }

  if (o.enableColumnPinning && col.getCanPin()) {
    item({
      disabled: col.getIsPinned() === 'left',
      icon: icons.IconPinned,
      iconClass: classes.left,
      key: 'pin-left',
      label: l.pinToLeft,
      onClick: () => col.pin('left'),
    })
    item({
      disabled: col.getIsPinned() === 'right',
      icon: icons.IconPinned,
      iconClass: classes.right,
      key: 'pin-right',
      label: l.pinToRight,
      onClick: () => col.pin('right'),
    })
    item({
      disabled: !col.getIsPinned(),
      icon: icons.IconPinnedOff,
      key: 'unpin',
      label: l.unpin,
      onClick: () => col.pin(false),
    })
    if (o.enableHiding) divider('after-pinning')
  }

  if (o.enableColumnResizing && col.getCanResize())
    item({
      disabled: !state.columnSizing[col.id],
      icon: icons.IconArrowAutofitContent,
      key: 'reset-size',
      label: l.resetColumnSize,
      onClick: () => {
        table.setColumnSizingInfo((old: typeof state.columnSizingInfo) => ({
          ...old,
          isResizingColumn: false,
        }))
        col.resetSize()
      },
    })

  if (o.enableHiding) {
    item({
      disabled: !col.getCanHide(),
      icon: icons.IconEyeOff,
      key: 'hide-column',
      label: l.hideColumn.replace('{column}', header),
      onClick: () => col.toggleVisibility(false),
    })
    item({
      disabled: !Object.values(state.columnVisibility).some((visible) => !visible),
      icon: icons.IconColumns,
      key: 'show-all-columns',
      label: l.showAllColumns.replace('{column}', header),
      onClick: () => table.toggleAllColumnsVisible(true),
    })
  }

  return entries
})

const leftSection = (entry: ColumnMenuEntry) => h(entry.icon!, { class: entry.iconClass })

/** Same entries as the template renders, as vnodes, for `internalColumnMenuItems`. */
const internalColumnMenuItems = () =>
  menuEntries.value.map((entry) =>
    entry.type === 'divider'
      ? h(Menu.Divider, { key: entry.key })
      : h(
          Menu.Item,
          {
            key: entry.key,
            disabled: entry.disabled,
            leftSection: leftSection(entry),
            onClick: entry.onClick,
          },
          () => entry.label,
        ),
  )

/**
 * Slot or `renderColumnActionsMenuItems` replacing the built-in list. Resolved
 * as the template branches so each callback runs once per render.
 */
let customItems: VNodeChild
const hasCustomItems = () => {
  const { table } = props
  const context = {
    column: column.value,
    internalColumnMenuItems: internalColumnMenuItems(),
    table,
  }
  customItems =
    slots.default?.(context) ??
    mvtSlots.columnActionsMenuItems?.(context) ??
    columnDef.value.renderColumnActionsMenuItems?.(context) ??
    table.options.renderColumnActionsMenuItems?.(context)
  return !!customItems
}
const renderCustomItems = () => customItems

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const menuProps = (): any => ({
  closeOnItemClick: true,
  position: 'bottom-start',
  withinPortal: true,
  ...attrs,
  opened: props.opened,
  'onUpdate:opened': props.onChange,
})

const actionIconProps = computed<any>(() => ({
  'aria-label': props.table.options.localization.columnActions,
  color: 'gray',
  size: 'sm',
  variant: 'subtle',
  ...actionProps.value,
}))
</script>

<template>
  <Menu v-bind="menuProps()">
    <Tooltip
      :label="actionProps.title ?? table.options.localization.columnActions"
      :openDelay="1000"
      :withinPortal="true"
    >
      <Menu.Target>
        <ActionIcon v-bind="actionIconProps">
          <component :is="table.options.icons.IconDotsVertical" size="100%" />
        </ActionIcon>
      </Menu.Target>
    </Tooltip>
    <Menu.Dropdown>
      <MVT_RenderNode v-if="hasCustomItems()" :node="renderCustomItems()" />
      <template v-else>
        <template v-for="entry in menuEntries" :key="entry.key">
          <Menu.Divider v-if="entry.type === 'divider'" />
          <Menu.Item
            v-else
            :disabled="entry.disabled"
            :leftSection="leftSection(entry)"
            @click="entry.onClick"
          >
            {{ entry.label }}
          </Menu.Item>
        </template>
      </template>
    </Menu.Dropdown>
  </Menu>
</template>
