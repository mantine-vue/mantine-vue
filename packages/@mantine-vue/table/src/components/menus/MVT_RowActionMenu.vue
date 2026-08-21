<script setup lang="ts">
import { ActionIcon, Menu, Tooltip } from '@mantine-vue/core'
import { computed, h, useAttrs, useSlots } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import { renderMVT_Renderable, useMVT_Slots } from '../MVT_TableSlots'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTRowActionMenu', inheritAttrs: false })

const props = defineProps<{
  handleEdit: (event: MouseEvent) => void
  row: MVT_Row<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

defineSlots<{
  default?: (arg: { row: MVT_Row<MVT_RowData>; table: MVT_TableInstance<MVT_RowData> }) => any
}>()

const attrs = useAttrs()
const slots = useSlots()
const mvtSlots = useMVT_Slots()

const menuPosition = computed(() => {
  const { positionActionsColumn } = props.table.options
  return positionActionsColumn === 'first'
    ? 'bottom-start'
    : positionActionsColumn === 'last'
      ? 'bottom-end'
      : undefined
})

const actionIconProps = computed<any>(() => ({
  'aria-label': props.table.options.localization.rowActions,
  color: 'gray',
  size: 'sm',
  variant: 'subtle',
  ...attrs,
  onClick: (event: MouseEvent) => event.stopPropagation(),
}))

const showEditItem = computed(
  () => !!props.table.options.enableEditing && props.table.options.editDisplayMode !== 'table',
)

const editIcon = () => h(props.table.options.icons.IconEdit)

const renderMenuItems = () => {
  const { row, table } = props
  return (
    slots.default?.({ row, table }) ??
    renderMVT_Renderable(mvtSlots.rowActionMenuItems, table.options.renderRowActionMenuItems, {
      row,
      table,
    })
  )
}

const stopPropagation = (event: MouseEvent) => event.stopPropagation()
</script>

<template>
  <Menu :closeOnItemClick="true" :position="menuPosition" :withinPortal="true">
    <Tooltip :label="table.options.localization.rowActions" :openDelay="1000" :withinPortal="true">
      <Menu.Target>
        <ActionIcon v-bind="actionIconProps">
          <component :is="table.options.icons.IconDots" />
        </ActionIcon>
      </Menu.Target>
    </Tooltip>
    <Menu.Dropdown @click="stopPropagation">
      <Menu.Item v-if="showEditItem" :leftSection="editIcon()" @click="handleEdit">
        {{ table.options.localization.edit }}
      </Menu.Item>
      <MVT_RenderNode :node="renderMenuItems()" />
    </Menu.Dropdown>
  </Menu>
</template>
