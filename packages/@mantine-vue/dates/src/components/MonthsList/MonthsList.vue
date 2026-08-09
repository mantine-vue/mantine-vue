<script setup lang="ts">
import dayjs from 'dayjs'
import { computed } from 'vue'
import { SimpleGrid } from '@mantine-vue/core'
import PickerControl from '../PickerControl/PickerControl.vue'
import { focusAdjacentControl, keyToDirection, setGridRef } from '../../utils'
import type { DateStringValue, MonthsListEmits, MonthsListProps } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'MonthsList' })
const props = withDefaults(defineProps<MonthsListProps>(), {
  year: () => dayjs().format('YYYY-MM-DD'),
  monthsListFormat: 'MMM',
  fullWidth: false,
})
const emit = defineEmits<MonthsListEmits>()
const controlRefs: (HTMLElement | null | undefined)[][] = []
const months = computed(() =>
  Array.from({ length: 12 }, (_, index) =>
    dayjs(props.year).month(index).startOf('month').format('YYYY-MM-DD'),
  ),
)
const controlProps = (date: DateStringValue) => props.getMonthControlProps?.(date) || {}
const enabled = (date: DateStringValue) =>
  !(
    (props.minDate && dayjs(date).endOf('month').isBefore(props.minDate, 'day')) ||
    (props.maxDate && dayjs(date).startOf('month').isAfter(props.maxDate, 'day')) ||
    controlProps(date).disabled
  )
const selected = (date: DateStringValue) =>
  Array.isArray(props.value)
    ? (props.value as DateStringValue[]).some((item) => dayjs(item).isSame(date, 'month'))
    : !!props.value && dayjs(props.value as any).isSame(date, 'month')
const tabDate = computed(
  () =>
    months.value.filter(enabled).find(selected) ??
    months.value.filter(enabled).find((date) => dayjs().isSame(date, 'month')) ??
    months.value.filter(enabled)[0],
)
const label = (date: DateStringValue) =>
  typeof props.monthsListFormat === 'function'
    ? props.monthsListFormat(date)
    : dayjs(date)
        .locale(props.locale || 'en')
        .format(props.monthsListFormat)
function onClick(date: DateStringValue, event: MouseEvent) {
  controlProps(date).onClick?.(event)
  if (enabled(date)) emit('month-select', date)
}
function onMouseEnter(date: DateStringValue, event: MouseEvent) {
  controlProps(date).onMouseenter?.(event)
  emit('month-mouse-enter', date)
}
function onKeydown(date: DateStringValue, index: number, event: KeyboardEvent) {
  controlProps(date).onKeydown?.(event)
  const direction = keyToDirection(event.key)
  if (direction) {
    event.preventDefault()
    focusAdjacentControl(controlRefs, Math.floor(index / 3), index % 3, direction)
  }
}
</script>

<template>
  <SimpleGrid
    :cols="3"
    :spacing="4"
    :class="classes.controlsGrid"
    :data-full-width="props.fullWidth || undefined"
  >
    <PickerControl
      v-for="(date, index) in months"
      :key="date"
      v-bind="controlProps(date)"
      :ref="(node: any) => setGridRef(controlRefs, Math.floor(index / 3), index % 3, node)"
      :full-width="props.fullWidth"
      :disabled="!enabled(date) || controlProps(date).disabled"
      :selected="selected(date)"
      :tabindex="date === tabDate ? 0 : -1"
      :data-autofocus="selected(date) || undefined"
      @click="onClick(date, $event)"
      @mouseenter="onMouseEnter(date, $event)"
      @keydown="onKeydown(date, index, $event)"
      >{{ label(date) }}</PickerControl
    >
  </SimpleGrid>
</template>
