<script setup lang="ts">
import clsx from 'clsx'
import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { computed } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import classes from './MVT_GrabHandleButton.module.css'

defineOptions({ name: 'MVTGrabHandleButton' })

const props = withDefaults(
  defineProps<{
    actionIconProps?: Record<string, any>
    onDragEnd: (event: DragEvent) => void
    onDragStart: (event: DragEvent) => void
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { actionIconProps: () => ({}) },
)

defineSlots<{ default?: (arg: { table: MVT_TableInstance<MVT_RowData> }) => any }>()

const label = computed(() => props.actionIconProps.title ?? props.table.options.localization.move)

const actionIconProps = computed<any>(() => ({
  'aria-label': label.value,
  draggable: true,
  ...props.actionIconProps,
  class: clsx('mvt-grab-handle-button', classes['grab-icon'], props.actionIconProps.class),
  color: 'gray',
  size: 'sm',
  title: undefined,
  variant: 'transparent',
  onClick: (event: MouseEvent) => {
    event.stopPropagation()
    props.actionIconProps.onClick?.(event)
  },
  onDragend: props.onDragEnd,
  onDragstart: props.onDragStart,
}))
</script>

<template>
  <Tooltip :label="label" :openDelay="1000" :withinPortal="true">
    <ActionIcon v-bind="actionIconProps">
      <slot :table="table">
        <component :is="table.options.icons.IconGripHorizontal" size="100%" />
      </slot>
    </ActionIcon>
  </Tooltip>
</template>
