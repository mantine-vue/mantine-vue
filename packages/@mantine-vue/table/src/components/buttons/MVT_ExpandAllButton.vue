<script setup lang="ts">
import clsx from 'clsx'
import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { useMVT_Slots } from '../MVT_TableSlots'
import classes from './MVT_ExpandAllButton.module.css'

defineOptions({ name: 'MVTExpandAllButton', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

defineSlots<{
  default?: (arg: { expanded: boolean; table: MVT_TableInstance<MVT_RowData> }) => any
}>()

const attrs = useAttrs()
const mvtSlots = useMVT_Slots()

const isExpanded = computed(() => props.table.getIsAllRowsExpanded())

const actionProps = computed(
  () =>
    ({
      ...parseFromValuesOrFunc(props.table.options.mantineExpandAllButtonProps, {
        table: props.table,
      }),
      ...attrs,
    }) as Record<string, any>,
)

const label = () => {
  const { localization } = props.table.options
  return (
    actionProps.value.title ??
    (isExpanded.value ? localization.collapseAll : localization.expandAll)
  )
}

// Injected slots are not reactive, so anything derived from them is recomputed
// on every render rather than cached in a `computed`.
const actionIconProps = (): any => {
  const { table } = props
  const { localization, renderDetailPanel } = table.options
  const state = table.getState()
  const hasDetailPanel = !!renderDetailPanel || !!mvtSlots.detailPanel

  return {
    'aria-label': localization.expandAll,
    color: 'gray',
    variant: 'subtle',
    ...actionProps.value,
    class: clsx('mvt-expand-all-button', classes.root, actionProps.value.class, state.density),
    disabled: state.isLoading || (!hasDetailPanel && !table.getCanSomeRowsExpand()),
    title: undefined,
    onClick: () => table.toggleAllRowsExpanded(!isExpanded.value),
  }
}

const chevronClass = computed(() =>
  clsx(
    classes.chevron,
    isExpanded.value ? classes.up : props.table.getIsSomeRowsExpanded() ? classes.right : undefined,
  ),
)
</script>

<template>
  <Tooltip :label="label()" :openDelay="1000" :withinPortal="true">
    <ActionIcon v-bind="actionIconProps()">
      <slot :expanded="isExpanded" :table="table">
        <component :is="table.options.icons.IconChevronsDown" :class="chevronClass" />
      </slot>
    </ActionIcon>
  </Tooltip>
</template>
