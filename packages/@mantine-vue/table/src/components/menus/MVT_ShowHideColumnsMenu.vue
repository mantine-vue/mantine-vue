<script setup lang="ts">
import clsx from 'clsx'
import { Button, Flex, Menu } from '@mantine-vue/core'
import { computed, shallowRef } from 'vue'
import type { MVT_Column, MVT_RowData, MVT_TableInstance } from '../../types'
import { getDefaultColumnOrderIds } from '../../utils/displayColumn.utils'
import MVT_ShowHideColumnsMenuItems from './MVT_ShowHideColumnsMenuItems.vue'
import classes from './MVT_ShowHideColumnsMenu.module.css'

defineOptions({ name: 'MVTShowHideColumnsMenu' })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

// `shallowRef` keeps the TanStack column object intact — a deep `ref` would hand
// down a reactive proxy instead of the column the table knows about.
const hoveredColumn = shallowRef<MVT_Column<MVT_RowData> | null>(null)

/** Read lazily during a drag, when the prop snapshot is already stale. */
const getHoveredColumn = () => hoveredColumn.value

const allColumns = computed(() => {
  const { table } = props
  const columns = table.getAllColumns()
  const order = table.getState().columnOrder
  if (order.length && !columns.some((column) => column.columnDef.columnDefType === 'group'))
    return [
      ...table.getLeftLeafColumns(),
      ...Array.from(new Set(order)).map((id) =>
        table.getCenterLeafColumns().find((column) => column.id === id),
      ),
      ...table.getRightLeafColumns(),
    ].filter(Boolean) as MVT_Column<MVT_RowData>[]
  return columns
})

const toggleAll = (value: boolean) =>
  props.table
    .getAllLeafColumns()
    .filter((column) => column.columnDef.enableHiding !== false)
    .forEach((column) => column.toggleVisibility(value))

const resetOrder = () =>
  props.table.setColumnOrder(getDefaultColumnOrderIds(props.table.options, true))
</script>

<template>
  <Menu.Dropdown :class="clsx('mvt-show-hide-columns-menu', classes.root)">
    <Flex :class="classes.content">
      <Button
        v-if="table.options.enableHiding"
        :disabled="!table.getIsSomeColumnsVisible()"
        variant="subtle"
        @click="toggleAll(false)"
      >
        {{ table.options.localization.hideAll }}
      </Button>
      <Button v-if="table.options.enableColumnOrdering" variant="subtle" @click="resetOrder">
        {{ table.options.localization.resetOrder }}
      </Button>
      <Button
        v-if="table.options.enableColumnPinning"
        :disabled="!table.getIsSomeColumnsPinned()"
        variant="subtle"
        @click="table.resetColumnPinning(true)"
      >
        {{ table.options.localization.unpinAll }}
      </Button>
      <Button
        v-if="table.options.enableHiding"
        :disabled="table.getIsAllColumnsVisible()"
        variant="subtle"
        @click="toggleAll(true)"
      >
        {{ table.options.localization.showAll }}
      </Button>
    </Flex>
    <Menu.Divider />
    <MVT_ShowHideColumnsMenuItems
      v-for="column in allColumns"
      :key="column.id"
      :allColumns="allColumns"
      :column="column"
      :hoveredColumn="hoveredColumn"
      :getHoveredColumn="getHoveredColumn"
      :table="table"
      @hoveredColumnChange="hoveredColumn = $event"
    />
  </Menu.Dropdown>
</template>
