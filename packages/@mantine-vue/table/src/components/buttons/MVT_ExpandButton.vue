<script setup lang="ts">
import clsx from 'clsx'
import { ActionIcon, Tooltip, useDirection } from '@mantine-vue/core'
import { computed, h, useAttrs } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_EditCellTextInput from '../inputs/MVT_EditCellTextInput.vue'
import { useMVT_Slots } from '../MVT_TableSlots'
import classes from './MVT_ExpandButton.module.css'

defineOptions({ name: 'MVTExpandButton', inheritAttrs: false })

const props = defineProps<{
  row: MVT_Row<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

defineSlots<{
  default?: (arg: { row: MVT_Row<MVT_RowData>; table: MVT_TableInstance<MVT_RowData> }) => any
}>()

const attrs = useAttrs()
const direction = useDirection()
const mvtSlots = useMVT_Slots()

const canExpand = computed(() => props.row.getCanExpand())
const isExpanded = computed(() => props.row.getIsExpanded())

const actionProps = computed(
  () =>
    ({
      ...parseFromValuesOrFunc(props.table.options.mantineExpandButtonProps, {
        row: props.row,
        table: props.table,
      }),
      ...attrs,
    }) as Record<string, any>,
)

/**
 * `renderDetailPanel` is handed the same internal edit components the detail
 * panel itself receives, so the button can tell whether a panel would render.
 */
const hasDetailPanel = () => {
  const { row, table } = props
  if (mvtSlots.detailPanel) return true
  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => h(MVT_EditCellTextInput, { key: cell.id, cell, table }))
  return !!table.options.renderDetailPanel?.({ internalEditComponents, row, table })
}

const label = () => {
  const { localization } = props.table.options
  return actionProps.value.title ?? (isExpanded.value ? localization.collapse : localization.expand)
}

const isDisabled = () => !canExpand.value && !hasDetailPanel()

const actionIconProps = (): any => {
  const { row, table } = props
  const rtl = direction.dir.value === 'rtl' || table.options.positionExpandColumn === 'last'

  return {
    'aria-label': table.options.localization.expand,
    color: 'gray',
    disabled: isDisabled(),
    variant: 'subtle',
    ...actionProps.value,
    class: clsx(
      'mvt-expand-button',
      classes.root,
      classes[`root-${rtl ? 'rtl' : 'ltr'}`],
      actionProps.value.class,
    ),
    style: { '--mvt-row-depth': `${row.depth}`, ...actionProps.value.style },
    title: undefined,
    onClick: (event: MouseEvent) => {
      event.stopPropagation()
      row.toggleExpanded()
      actionProps.value.onClick?.(event)
    },
  }
}

const chevronClass = () =>
  clsx(
    'mvt-expand-button-chevron',
    classes.chevron,
    isDisabled() ? classes.right : isExpanded.value ? classes.up : undefined,
  )
</script>

<template>
  <Tooltip :disabled="isDisabled()" :label="label()" :openDelay="1000" :withinPortal="true">
    <ActionIcon v-bind="actionIconProps()">
      <slot :row="row" :table="table">
        <component :is="table.options.icons.IconChevronDown" :class="chevronClass()" />
      </slot>
    </ActionIcon>
  </Tooltip>
</template>
