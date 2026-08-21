<script setup lang="ts">
import clsx from 'clsx'
import { Box, Menu, Switch, Text, Tooltip } from '@mantine-vue/core'
import { computed, ref } from 'vue'
import type { MVT_Column, MVT_RowData, MVT_TableInstance } from '../../types'
import { reorderColumn } from '../../utils/column.utils'
import MVT_ColumnPinningButtons from '../buttons/MVT_ColumnPinningButtons.vue'
import MVT_GrabHandleButton from '../buttons/MVT_GrabHandleButton.vue'
import classes from './MVT_ShowHideColumnsMenuItems.module.css'

defineOptions({ name: 'MVTShowHideColumnsMenuItems' })

const props = withDefaults(
  defineProps<{
    allColumns: MVT_Column<MVT_RowData>[]
    column: MVT_Column<MVT_RowData>
    getHoveredColumn?: () => MVT_Column<MVT_RowData> | null
    hoveredColumn?: MVT_Column<MVT_RowData> | null
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { getHoveredColumn: undefined, hoveredColumn: null },
)

const emit = defineEmits<{ hoveredColumnChange: [MVT_Column<MVT_RowData> | null] }>()

const menuItemRef = ref<HTMLElement | null>(null)
const dragging = ref(false)

const columnDef = computed(() => props.column.columnDef)
const isGroup = computed(() => columnDef.value.columnDefType === 'group')

const isVisibleInMenu = computed(
  () => !!columnDef.value.header && columnDef.value.visibleInShowHideMenu !== false,
)

const childColumns = computed(() => props.column.columns ?? [])

const isChecked = computed(() =>
  isGroup.value
    ? props.column.getLeafColumns().some((column) => column.getIsVisible())
    : props.column.getIsVisible(),
)

const toggleVisibility = () =>
  isGroup.value
    ? props.column.columns?.forEach((column) => column.toggleVisibility(!isChecked.value))
    : props.column.toggleVisibility()

const setMenuItemRef = (el: any) => {
  menuItemRef.value = el?.$el ?? el
}

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const menuItemProps = () => ({
  class: clsx(classes.root),
  component: 'span',
  ref: setMenuItemRef,
  style: { '--_column-depth': `${(props.column.depth + 0.5) * 2}rem` },
  'data-dragging': dragging.value || undefined,
  'data-order-hovered': props.hoveredColumn?.id === props.column.id || undefined,
  onDragenter: () => {
    if (!dragging.value && columnDef.value.enableColumnOrdering !== false)
      emit('hoveredColumnChange', props.column)
  },
})

const showOrderingSlot = computed(
  () =>
    !isGroup.value &&
    !!props.table.options.enableColumnOrdering &&
    !props.allColumns.some((column) => column.columnDef.columnDefType === 'group'),
)

const canReorder = computed(() => columnDef.value.enableColumnOrdering !== false)

const handleDragStart = (event: DragEvent) => {
  dragging.value = true
  if (menuItemRef.value) event.dataTransfer?.setDragImage(menuItemRef.value, 0, 0)
}

const handleDragEnd = () => {
  dragging.value = false
  const hovered = props.getHoveredColumn?.() ?? props.hoveredColumn
  if (hovered)
    props.table.setColumnOrder(
      reorderColumn(props.column, hovered, props.table.getState().columnOrder),
    )
  emit('hoveredColumnChange', null)
}
</script>

<template>
  <template v-if="isVisibleInMenu">
    <Menu.Item v-bind="menuItemProps()">
      <Box :class="classes.menu">
        <template v-if="showOrderingSlot">
          <MVT_GrabHandleButton
            v-if="canReorder"
            :table="table"
            :onDragStart="handleDragStart"
            :onDragEnd="handleDragEnd"
          />
          <Box v-else :class="classes.grab" />
        </template>
        <template v-if="table.options.enableColumnPinning">
          <MVT_ColumnPinningButtons v-if="column.getCanPin()" :column="column" :table="table" />
          <Box v-else :class="classes.pin" />
        </template>
        <Tooltip
          v-if="table.options.enableHiding"
          :label="table.options.localization.toggleVisibility"
          :openDelay="1000"
          :withinPortal="true"
        >
          <Switch
            :modelValue="isChecked"
            :class="classes.switch"
            :disabled="!column.getCanHide()"
            :label="columnDef.header"
            @change="toggleVisibility"
          />
        </Tooltip>
        <Text v-else :class="classes.header">{{ columnDef.header }}</Text>
      </Box>
    </Menu.Item>
    <MVT_ShowHideColumnsMenuItems
      v-for="child in childColumns"
      :key="child.id"
      :allColumns="allColumns"
      :column="child"
      :getHoveredColumn="getHoveredColumn"
      :hoveredColumn="hoveredColumn"
      :table="table"
      @hoveredColumnChange="emit('hoveredColumnChange', $event)"
    />
  </template>
</template>
