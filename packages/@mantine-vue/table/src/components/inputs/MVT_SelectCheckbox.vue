<script setup lang="ts">
import { Checkbox, Radio, Switch, Tooltip } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import {
  getIsRowSelected,
  getMVT_RowSelectionHandler,
  getMVT_SelectAllHandler,
} from '../../utils/row.utils'
import {
  getServerGroupingManager,
  getServerGroupingSelectionSummary,
  isServerGroupingRecordSelected,
  toggleAllServerGroupingRecordsSelected,
} from '../../server-grouping/serverGroupingSelection'
import { parseFromValuesOrFunc } from '../../utils/utils'

defineOptions({ name: 'MVTSelectCheckbox', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    renderedRowIndex?: number
    row?: MVT_Row<MVT_RowData>
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { renderedRowIndex: 0, row: undefined },
)

const attrs = useAttrs()

// Tracked outside the reactive state: Mantine's `onChange` only reports the next
// checked value, so the modifier has to be captured on the preceding click.
let lastShiftKey = false

const isSelectAll = computed(() => !props.row)

// Provider rows live outside TanStack's row model.
const anyTable = computed(() => props.table as MVT_TableInstance<any>)
const isServerGrouping = computed(() => !!getServerGroupingManager(anyTable.value))

const serverGroupingSummary = computed(() =>
  isSelectAll.value && isServerGrouping.value
    ? getServerGroupingSelectionSummary(anyTable.value)
    : undefined,
)

const isChecked = computed(() => {
  const { row, table } = props
  const summary = serverGroupingSummary.value
  if (summary) return summary.isAll
  if (isSelectAll.value)
    return table.options.selectAllMode === 'page'
      ? table.getIsAllPageRowsSelected()
      : table.getIsAllRowsSelected()
  // record rows honor exclude mode ("all matching records")
  return isServerGrouping.value && row
    ? isServerGroupingRecordSelected(anyTable.value, row)
    : getIsRowSelected({ row: row as MVT_Row<MVT_RowData>, table })
})

const checkboxProps = computed(
  () =>
    ({
      ...(isSelectAll.value
        ? parseFromValuesOrFunc(props.table.options.mantineSelectAllCheckboxProps, {
            table: props.table,
          })
        : parseFromValuesOrFunc(props.table.options.mantineSelectCheckboxProps, {
            row: props.row as MVT_Row<MVT_RowData>,
            table: props.table,
          })),
      ...attrs,
    }) as Record<string, any>,
)

const label = computed(() => {
  const { localization } = props.table.options
  return (
    checkboxProps.value.title ??
    (isSelectAll.value ? localization.toggleSelectAll : localization.toggleSelectRow)
  )
})

const selectionHandler = computed(() => {
  const { renderedRowIndex, row, table } = props
  const summary = serverGroupingSummary.value
  if (row) return getMVT_RowSelectionHandler({ renderedRowIndex, row, table })
  if (summary)
    return (event: Event) =>
      toggleAllServerGroupingRecordsSelected(
        anyTable.value,
        (event.target as HTMLInputElement)?.checked ?? !summary.isAll,
      )
  return getMVT_SelectAllHandler({ table })
})

const controlProps = computed(() => {
  const { row, table } = props
  const state = table.getState()
  const summary = serverGroupingSummary.value

  return {
    'aria-label': label.value,
    checked: isChecked.value,
    disabled:
      state.isLoading ||
      (row && !row.getCanSelect()) ||
      row?.id === 'mvt-row-create' ||
      // Keep the control enabled when it can clear an off-screen selection.
      (summary?.selectableCount === 0 && summary.selectedRowIds.length === 0),
    size: state.density === 'xs' ? 'sm' : 'md',
    ...checkboxProps.value,
    title: undefined,
    onChange: (nextChecked: boolean) => {
      selectionHandler.value({ shiftKey: lastShiftKey } as unknown as Event, nextChecked)
      checkboxProps.value.onChange?.(nextChecked)
      lastShiftKey = false
    },
    onClick: (event: MouseEvent) => {
      event.stopPropagation()
      lastShiftKey = event.shiftKey
      checkboxProps.value.onClick?.(event)
    },
  }
})

const checkboxControlProps = computed(() => {
  const { row, table } = props
  const summary = serverGroupingSummary.value

  return {
    indeterminate: summary
      ? summary.isSome
      : !isChecked.value && isSelectAll.value
        ? table.getIsSomeRowsSelected()
        : row?.getIsSomeSelected() && row.getCanSelectSubRows(),
    ...controlProps.value,
  }
})

const useSwitch = computed(() => props.table.options.selectDisplayMode === 'switch')
const useRadio = computed(
  () =>
    props.table.options.selectDisplayMode === 'radio' ||
    props.table.options.enableMultiRowSelection === false,
)
</script>

<template>
  <Tooltip :label="label" :openDelay="1000" :withinPortal="true">
    <span>
      <Switch v-if="useSwitch" v-bind="controlProps" />
      <Radio v-else-if="useRadio" v-bind="controlProps" />
      <Checkbox v-else v-bind="checkboxControlProps" />
    </span>
  </Tooltip>
</template>
