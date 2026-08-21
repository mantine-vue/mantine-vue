<script lang="ts">
import type { ScheduleViewLevel } from '../../../types'

const defaultProps = {
  views: ['day', 'week', 'month', 'year'],
} as const

const SWITCH_LABELS: Record<
  ScheduleViewLevel,
  'switchToDayView' | 'switchToWeekView' | 'switchToMonthView' | 'switchToYearView'
> = {
  day: 'switchToDayView',
  week: 'switchToWeekView',
  month: 'switchToMonthView',
  year: 'switchToYearView',
}

export { defaultProps, SWITCH_LABELS }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps, useStyles } from '@mantine-vue/core'
import { getLabel } from '../../../labels'
import { HeaderControl } from '../HeaderControl'
import { useScheduleHeaderLabels } from '../ScheduleHeader.context'
import type { ViewSelectEmits, ViewSelectOwnProps } from './ViewSelect.types'
import classes from './ViewSelect.module.css'

defineOptions({
  name: 'ViewSelect',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<ViewSelectOwnProps>(), {
  views: undefined,
  modelValue: undefined,
  value: undefined,
  radius: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<ViewSelectEmits>()

const attrs = useAttrs()

const props = useProps('ViewSelect', defaultProps, rawProps)

const labels = useScheduleHeaderLabels(() => props.labels)

const getStyles = useStyles({
  name: 'ViewSelect',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  rootSelector: 'viewSelect',
})

const selected = computed(() => props.modelValue ?? props.value)

const select = (view: ScheduleViewLevel) => {
  emit('update:modelValue', view)
  emit('change', view)
}

/** Roving tabindex across the tablist, matching the WAI-ARIA tabs pattern. */
const handleKeydown = (nativeEvent: KeyboardEvent, index: number) => {
  const controls = (
    nativeEvent.currentTarget as HTMLElement
  ).parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')

  if (!controls?.length) {
    return
  }

  let next = index

  if (nativeEvent.key === 'ArrowRight') {
    next = (index + 1) % controls.length
  } else if (nativeEvent.key === 'ArrowLeft') {
    next = (index - 1 + controls.length) % controls.length
  } else if (nativeEvent.key === 'Home') {
    next = 0
  } else if (nativeEvent.key === 'End') {
    next = controls.length - 1
  } else {
    return
  }

  nativeEvent.preventDefault()
  controls[next]?.focus()
}
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('viewSelect') }"
    role="tablist"
    :aria-label="getLabel('viewSelectLabel', labels)"
  >
    <HeaderControl
      v-for="(view, index) in props.views"
      :key="view"
      :active="view === selected"
      :radius="props.radius"
      role="tab"
      :data-type="view"
      :aria-selected="view === selected"
      :aria-label="getLabel(SWITCH_LABELS[view], labels)"
      :tabindex="view === selected ? 0 : -1"
      @click="select(view)"
      @keydown="handleKeydown($event, index)"
    >
      {{ getLabel(view, labels) }}
    </HeaderControl>
  </Box>
</template>
