<script lang="ts">
import { type MVT_RowData, type MVT_TableInstance } from '../types'
import {
  type MVT_ServerGroupableColumn,
  type MVT_ServerGroupingGroupByContext,
} from './serverGrouping.types'
import { type MVT_ServerGroupingManager } from './useMVT_ServerGrouping'

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
</script>

<script setup lang="ts">
/**
 * Built-in group-by toolbar control for server-side grouping. Renders a
 * "Group by" menu (add / reorder / remove / clear levels) plus the active
 * levels as removable pills. Hidden when server grouping is inactive, when
 * `groupBy.enabled` is `false`, or when grouping is a static
 * `serverGrouping.grouping` array (which the control could not change).
 */
import { computed, h, type VNodeChild } from 'vue'

import { ActionIcon, Box, Button, Menu, Pill, PillGroup, Text } from '@mantine-vue/core'

import clsx from 'clsx'

import { parseFromValuesOrFunc } from '../utils/utils'
import { useMVT_Slots } from '../components/MVT_TableSlots'
import classes from './MVT_ServerGrouping.module.css'
import { MVT_RenderNode } from '../utils/renderable'

defineOptions({ name: 'MVTServerGroupingGroupBy', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const mvtSlots = useMVT_Slots()

const manager = computed(
  () => (props.table as any)._serverGrouping as MVT_ServerGroupingManager<MVT_RowData> | undefined,
)

const groupByOptions = computed(() => manager.value?.options.groupBy ?? {})

/** The control can only drive grouping the table actually owns. */
const isEnabled = computed(() => {
  const activeManager = manager.value
  if (!activeManager) return false
  const options = activeManager.options.groupBy ?? {}
  if (options.enabled === false) return false
  if (activeManager.options.grouping && options.enabled !== true) return false
  return true
})

const context = computed(() =>
  manager.value
    ? getServerGroupingGroupByContext(props.table as MVT_TableInstance<any>, manager.value)
    : undefined,
)

const grouping = computed(() => context.value?.grouping ?? [])
const groupableColumns = computed(() => context.value?.groupableColumns ?? [])

const localization = computed(
  () => props.table.options.localization as unknown as Record<string, string>,
)
const icons = computed(() => props.table.options.icons)

const allowReorder = computed(() => groupByOptions.value.allowReorder ?? true)
const allowClearAll = computed(() => groupByOptions.value.allowClearAll ?? true)

const labelFor = (field: string) =>
  groupableColumns.value.find((column) => column.id === field)?.label ?? field

const activeLabel = (field: string, index: number) => `${index + 1}. ${labelFor(field)}`

const ungroupLabel = (field: string) =>
  (localization.value.ungroupByColumn ?? 'Ungroup by {column}').replace('{column}', labelFor(field))

const addGroup = (field: string) => context.value?.addGroup(field)
const moveGroup = (field: string, direction: 1 | -1) => context.value?.moveGroup(field, direction)
const removeGroup = (field: string) => context.value?.removeGroup(field)
const clearGrouping = () => context.value?.clearGrouping()

/**
 * A replacement control counts whenever it is not nullish — unlike the other
 * `renderX` hooks, an empty string or `false` here still suppresses the
 * built-in UI. Resolved during the `v-if` so it runs once per render.
 */
let customControl: VNodeChild
const hasCustomControl = () => {
  const activeContext = context.value
  customControl = activeContext
    ? ((mvtSlots as any).serverGroupByControl?.(activeContext) ??
      parseFromValuesOrFunc(groupByOptions.value.renderControl, activeContext))
    : undefined
  return customControl !== undefined && customControl !== null
}
const renderCustomControl = () => customControl

const menuProps = computed<any>(() => ({
  closeOnItemClick: false,
  position: 'bottom-start',
  shadow: 'md',
  width: 260,
  ...groupByOptions.value.mantineMenuProps,
}))

const buttonProps = () => {
  const mantineButtonProps = groupByOptions.value.mantineButtonProps
  return {
    size: 'xs',
    variant: 'default',
    ...mantineButtonProps,
    leftSection: mantineButtonProps?.leftSection ?? h(icons.value.IconColumns),
  }
}

const pillProps = (field: string, index: number): any => {
  const custom =
    parseFromValuesOrFunc(groupByOptions.value.mantinePillProps, { field, index }) ?? {}
  return {
    size: 'sm',
    withRemoveButton: true,
    ...custom,
    onRemove: () => removeGroup(field),
    removeButtonProps: {
      'aria-label': ungroupLabel(field),
      ...custom?.removeButtonProps,
    },
  }
}

const rotatedChevronStyle = { transform: 'rotate(180deg)' }
</script>

<template>
  <template v-if="isEnabled">
    <MVT_RenderNode v-if="hasCustomControl()" :node="renderCustomControl()" />
    <Box
      v-else
      :class="clsx('mvt-server-groupby-control', classes['groupby-control'])"
      :style="{ display: 'flex', gap: '8px' }"
    >
      <Menu v-bind="menuProps">
        <Menu.Target>
          <Button v-bind="buttonProps()">{{ localization.groupBy ?? 'Group by' }}</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <template v-if="groupableColumns.length">
            <Menu.Item
              v-for="column in groupableColumns"
              :key="column.id"
              :disabled="grouping.includes(column.id)"
              @click="addGroup(column.id)"
            >
              {{ column.label }}
            </Menu.Item>
          </template>
          <Menu.Label v-else>
            {{ localization.noGroupableColumns ?? 'No groupable columns' }}
          </Menu.Label>
          <template v-if="grouping.length > 0">
            <Menu.Divider />
            <Menu.Label>{{ (localization.groupedBy ?? 'Grouped by ').trim() }}</Menu.Label>
            <Box
              v-for="(field, index) in grouping"
              :key="field"
              :class="classes['groupby-active-row']"
            >
              <ActionIcon
                v-if="allowReorder"
                :aria-label="`${localization.moveUp ?? 'Move up'} ${labelFor(field)}`"
                color="gray"
                :disabled="index === 0"
                size="xs"
                variant="subtle"
                @click="moveGroup(field, -1)"
              >
                <component :is="icons.IconChevronDown" :style="rotatedChevronStyle" />
              </ActionIcon>
              <ActionIcon
                v-if="allowReorder"
                :aria-label="`${localization.moveDown ?? 'Move down'} ${labelFor(field)}`"
                color="gray"
                :disabled="index === grouping.length - 1"
                size="xs"
                variant="subtle"
                @click="moveGroup(field, 1)"
              >
                <component :is="icons.IconChevronDown" />
              </ActionIcon>
              <Text :class="classes['groupby-active-label']" size="sm">
                {{ activeLabel(field, index) }}
              </Text>
              <ActionIcon
                :aria-label="ungroupLabel(field)"
                color="gray"
                size="xs"
                variant="subtle"
                @click="removeGroup(field)"
              >
                <component :is="icons.IconX" />
              </ActionIcon>
            </Box>
          </template>
          <template v-if="allowClearAll && grouping.length > 0">
            <Menu.Divider />
            <Menu.Item color="red" @click="clearGrouping()">
              {{ localization.clearGrouping ?? 'Clear grouping' }}
            </Menu.Item>
          </template>
        </Menu.Dropdown>
      </Menu>
      <PillGroup v-if="grouping.length > 0" :gap="4">
        <Pill v-for="(field, index) in grouping" :key="field" v-bind="pillProps(field, index)">
          {{ activeLabel(field, index) }}
        </Pill>
      </PillGroup>
    </Box>
  </template>
</template>
